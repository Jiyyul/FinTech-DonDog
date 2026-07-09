import { getSupabase } from "@/lib/supabase";
import { hashPassword, verifyPassword } from "@/lib/auth-session";
import { initializeGroupBudget } from "@/lib/budget-repository";
import type {
  AccountantRecord,
  AuthSession,
  GroupRecord,
  GroupSummary,
  SignupInput,
} from "@/lib/auth-types";

const ENTRY_CODE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const ENTRY_CODE_LENGTH = 10;
const DEMO_ADMIN_USERNAME = "admin123";
const DEMO_ADMIN_ENTRY_CODE = "1234567890";

type GroupRow = { id: number; name: string; entry_code: string };
type AccountantRow = {
  id: number;
  username: string;
  password_hash: string;
  account_number: string;
  phone: string;
  affiliation: string | null;
  group_id: number;
};

function mapGroup(row: GroupRow): GroupRecord {
  return { id: row.id, name: row.name, entryCode: row.entry_code };
}

function toGroupSummary(group: GroupRecord): GroupSummary {
  return { id: group.id, name: group.name, entryCode: group.entryCode };
}

async function linkAccountantToGroup(accountantId: number, groupId: number) {
  const { error } = await getSupabase()
    .from("accountant_groups")
    .upsert(
      { accountant_id: accountantId, group_id: groupId },
      { onConflict: "accountant_id,group_id" }
    );
  if (error) throw new Error(`그룹 연결 실패: ${error.message}`);
}

export async function getAccountantGroups(
  accountantId: number,
  fallbackGroupId?: number
): Promise<GroupRecord[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("accountant_groups")
    .select("groups(id, name, entry_code)")
    .eq("accountant_id", accountantId);

  if (error) {
    if (fallbackGroupId) {
      const group = await getGroupById(fallbackGroupId);
      return group ? [group] : [];
    }
    throw new Error(`담당자 그룹 목록 조회 실패: ${error.message}`);
  }

  const groups = (data ?? [])
    .map((row) => row.groups as GroupRow | GroupRow[] | null)
    .flatMap((value) => (Array.isArray(value) ? value : value ? [value] : []))
    .map((row) => mapGroup(row));

  if (groups.length === 0 && fallbackGroupId) {
    const group = await getGroupById(fallbackGroupId);
    if (group) {
      await linkAccountantToGroup(accountantId, group.id).catch(() => undefined);
      return [group];
    }
  }

  return groups;
}

async function buildAccountantSession(
  accountant: AccountantRecord,
  activeGroupId?: number
): Promise<AuthSession | null> {
  const groups = await getAccountantGroups(accountant.id, accountant.groupId);
  if (groups.length === 0) return null;

  const preferredId = activeGroupId ?? accountant.groupId;
  const active = groups.find((group) => group.id === preferredId) ?? groups[0];

  return {
    role: "accountant",
    groupId: active.id,
    groupName: active.name,
    entryCode: active.entryCode,
    userId: accountant.id,
    username: accountant.username,
    groups: groups.map(toGroupSummary),
  };
}

function mapAccountant(row: AccountantRow): AccountantRecord & { passwordHash: string } {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    accountNumber: row.account_number,
    phone: row.phone,
    affiliation: row.affiliation ?? undefined,
    groupId: row.group_id,
  };
}

function generateEntryCode() {
  let code = "";
  for (let i = 0; i < ENTRY_CODE_LENGTH; i += 1) {
    code += ENTRY_CODE_CHARS[Math.floor(Math.random() * ENTRY_CODE_CHARS.length)];
  }
  return code;
}

async function createUniqueEntryCode() {
  const db = getSupabase();
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const code = generateEntryCode();
    const { data } = await db.from("groups").select("id").eq("entry_code", code).maybeSingle();
    if (!data) return code;
  }
  throw new Error("입장 코드를 생성하지 못했습니다.");
}

export async function getDemoGroupId(): Promise<number> {
  const db = getSupabase();
  const { data: admin } = await db
    .from("accountants")
    .select("group_id")
    .eq("username", DEMO_ADMIN_USERNAME)
    .maybeSingle();

  if (admin?.group_id) return admin.group_id;

  const { data: group } = await db.from("groups").select("id").order("id").limit(1).maybeSingle();
  return group?.id ?? 1;
}

export async function ensureDemoAdmin(): Promise<number> {
  const db = getSupabase();
  const { data: existing } = await db
    .from("accountants")
    .select("group_id")
    .eq("username", DEMO_ADMIN_USERNAME)
    .maybeSingle();

  if (existing?.group_id) {
    await db
      .from("groups")
      .update({ entry_code: DEMO_ADMIN_ENTRY_CODE })
      .eq("id", existing.group_id);
    const admin = await getAccountantByUsername(DEMO_ADMIN_USERNAME);
    if (admin) {
      await linkAccountantToGroup(admin.id, existing.group_id).catch(() => undefined);
    }
    return existing.group_id;
  }

  const { data: group, error: groupError } = await db
    .from("groups")
    .insert({ name: "AI 핀테크 동아리", entry_code: DEMO_ADMIN_ENTRY_CODE })
    .select("id")
    .single();

  if (groupError || !group) {
    throw new Error(`데모 그룹 생성 실패: ${groupError?.message}`);
  }

  const { data: createdAccountant, error: accountantError } = await db.from("accountants").insert({
    username: DEMO_ADMIN_USERNAME,
    password_hash: hashPassword("admin"),
    account_number: "110-123-456789",
    phone: "010-1234-5678",
    affiliation: "경영학과",
    group_id: group.id,
  }).select("id").single();

  if (accountantError || !createdAccountant) {
    throw new Error(`데모 계정 생성 실패: ${accountantError?.message}`);
  }

  await linkAccountantToGroup(createdAccountant.id, group.id);

  await initializeGroupBudget(group.id, 2_500_000);
  return group.id;
}

export async function getGroupByEntryCode(entryCode: string): Promise<GroupRecord | null> {
  const { data, error } = await getSupabase()
    .from("groups")
    .select("id, name, entry_code")
    .eq("entry_code", entryCode.trim())
    .maybeSingle();

  if (error) throw new Error(`그룹 조회 실패: ${error.message}`);
  return data ? mapGroup(data as GroupRow) : null;
}

export async function getGroupById(groupId: number): Promise<GroupRecord | null> {
  const { data, error } = await getSupabase()
    .from("groups")
    .select("id, name, entry_code")
    .eq("id", groupId)
    .maybeSingle();

  if (error) throw new Error(`그룹 조회 실패: ${error.message}`);
  return data ? mapGroup(data as GroupRow) : null;
}

export async function getAccountantByUsername(username: string) {
  const { data, error } = await getSupabase()
    .from("accountants")
    .select("id, username, password_hash, account_number, phone, affiliation, group_id")
    .eq("username", username.trim())
    .maybeSingle();

  if (error) throw new Error(`계정 조회 실패: ${error.message}`);
  return data ? mapAccountant(data as AccountantRow) : null;
}

export async function signupAccountant(input: SignupInput): Promise<{
  session: AuthSession;
  entryCode: string;
}> {
  const existing = await getAccountantByUsername(input.username);
  if (existing) {
    throw new Error("이미 사용 중인 아이디입니다.");
  }

  const totalBudget = Math.round(input.totalBudget);
  if (!Number.isFinite(totalBudget) || totalBudget <= 0) {
    throw new Error("유효한 총 예산을 입력하세요.");
  }

  const entryCode = await createUniqueEntryCode();
  const db = getSupabase();

  const { data: group, error: groupError } = await db
    .from("groups")
    .insert({ name: input.groupName.trim(), entry_code: entryCode })
    .select("id, name, entry_code")
    .single();

  if (groupError || !group) {
    throw new Error(`그룹 생성 실패: ${groupError?.message}`);
  }

  const { data: accountant, error: accountantError } = await db
    .from("accountants")
    .insert({
      username: input.username.trim(),
      password_hash: hashPassword(input.password),
      account_number: input.accountNumber.trim(),
      phone: input.phone.trim(),
      affiliation: input.affiliation?.trim() || null,
      group_id: group.id,
    })
    .select("id, username")
    .single();

  if (accountantError || !accountant) {
    throw new Error(`회원가입 실패: ${accountantError?.message}`);
  }

  await linkAccountantToGroup(accountant.id, group.id);
  await initializeGroupBudget(group.id, totalBudget);

  const session = await buildAccountantSession(
    {
      id: accountant.id,
      username: accountant.username,
      accountNumber: input.accountNumber.trim(),
      phone: input.phone.trim(),
      affiliation: input.affiliation?.trim(),
      groupId: group.id,
    },
    group.id
  );

  if (!session) {
    throw new Error("세션 생성에 실패했습니다.");
  }

  return {
    entryCode,
    session,
  };
}

export async function getAccountantById(accountantId: number) {
  const { data, error } = await getSupabase()
    .from("accountants")
    .select("id, username, password_hash, account_number, phone, affiliation, group_id")
    .eq("id", accountantId)
    .maybeSingle();

  if (error) throw new Error(`계정 조회 실패: ${error.message}`);
  return data ? mapAccountant(data as AccountantRow) : null;
}

export async function loginAccountant(
  username: string,
  password: string
): Promise<AuthSession | null> {
  const accountant = await getAccountantByUsername(username);
  if (!accountant || !verifyPassword(password, accountant.passwordHash)) {
    return null;
  }

  return buildAccountantSession(accountant);
}

export async function switchAccountantGroup(
  accountantId: number,
  groupId: number
): Promise<AuthSession | null> {
  const groups = await getAccountantGroups(accountantId);
  if (!groups.some((group) => group.id === groupId)) {
    return null;
  }

  const { error } = await getSupabase()
    .from("accountants")
    .update({ group_id: groupId })
    .eq("id", accountantId);
  if (error) throw new Error(`활성 그룹 변경 실패: ${error.message}`);

  const accountant = await getAccountantById(accountantId);
  if (!accountant) return null;

  return buildAccountantSession(accountant, groupId);
}

export async function createGroupForAccountant(
  accountantId: number,
  input: { groupName: string; totalBudget: number }
): Promise<AuthSession> {
  const accountant = await getAccountantById(accountantId);
  if (!accountant) {
    throw new Error("계정을 찾을 수 없습니다.");
  }

  const totalBudget = Math.round(input.totalBudget);
  if (!input.groupName.trim()) {
    throw new Error("동아리(모임)명을 입력하세요.");
  }
  if (!Number.isFinite(totalBudget) || totalBudget <= 0) {
    throw new Error("유효한 총 예산을 입력하세요.");
  }

  const entryCode = await createUniqueEntryCode();
  const db = getSupabase();

  const { data: group, error: groupError } = await db
    .from("groups")
    .insert({ name: input.groupName.trim(), entry_code: entryCode })
    .select("id, name, entry_code")
    .single();

  if (groupError || !group) {
    throw new Error(`그룹 생성 실패: ${groupError?.message}`);
  }

  await linkAccountantToGroup(accountantId, group.id);
  await initializeGroupBudget(group.id, totalBudget);

  const { error: updateError } = await db
    .from("accountants")
    .update({ group_id: group.id })
    .eq("id", accountantId);
  if (updateError) throw new Error(`활성 그룹 설정 실패: ${updateError.message}`);

  const session = await buildAccountantSession(
    { ...accountant, groupId: group.id },
    group.id
  );
  if (!session) {
    throw new Error("세션 생성에 실패했습니다.");
  }
  return session;
}

export async function loginWithEntryCode(entryCode: string): Promise<AuthSession | null> {
  const group = await getGroupByEntryCode(entryCode);
  if (!group) return null;

  return {
    role: "member",
    groupId: group.id,
    groupName: group.name,
    entryCode: group.entryCode,
  };
}

export type AccountantProfile = {
  username: string;
  phone: string;
  accountNumber: string;
  affiliation: string;
};

export async function getAccountantProfile(
  accountantId: number
): Promise<AccountantProfile | null> {
  const accountant = await getAccountantById(accountantId);
  if (!accountant) return null;

  return {
    username: accountant.username,
    phone: accountant.phone,
    accountNumber: accountant.accountNumber,
    affiliation: accountant.affiliation ?? "",
  };
}

export type UpdateAccountantProfileInput = {
  phone?: string;
  accountNumber?: string;
  affiliation?: string;
  password?: string;
};

export async function updateAccountantProfile(
  accountantId: number,
  input: UpdateAccountantProfileInput
): Promise<AccountantProfile | null> {
  const updates: Record<string, string | null> = {};

  if (input.phone !== undefined) {
    const phone = input.phone.trim();
    if (!phone) throw new Error("연락처를 입력하세요.");
    updates.phone = phone;
  }

  if (input.accountNumber !== undefined) {
    const accountNumber = input.accountNumber.trim();
    if (!accountNumber) throw new Error("계좌번호를 입력하세요.");
    updates.account_number = accountNumber;
  }

  if (input.affiliation !== undefined) {
    updates.affiliation = input.affiliation.trim() || null;
  }

  if (input.password) {
    if (input.password.length < 4) {
      throw new Error("비밀번호는 4자 이상이어야 합니다.");
    }
    updates.password_hash = hashPassword(input.password);
  }

  if (Object.keys(updates).length > 0) {
    const { error } = await getSupabase()
      .from("accountants")
      .update(updates)
      .eq("id", accountantId);
    if (error) throw new Error(`프로필 저장 실패: ${error.message}`);
  }

  return getAccountantProfile(accountantId);
}
