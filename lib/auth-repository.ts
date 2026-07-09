import { getSupabase } from "@/lib/supabase";
import { hashPassword, verifyPassword } from "@/lib/auth-session";
import { initializeGroupBudget } from "@/lib/budget-repository";
import type {
  AccountantRecord,
  AuthSession,
  GroupRecord,
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

  const { error: accountantError } = await db.from("accountants").insert({
    username: DEMO_ADMIN_USERNAME,
    password_hash: hashPassword("admin"),
    account_number: "110-123-456789",
    phone: "010-1234-5678",
    affiliation: "경영학과",
    group_id: group.id,
  });

  if (accountantError) {
    throw new Error(`데모 계정 생성 실패: ${accountantError.message}`);
  }

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

  await initializeGroupBudget(group.id, totalBudget);

  return {
    entryCode,
    session: {
      role: "accountant",
      groupId: group.id,
      groupName: group.name,
      entryCode: group.entry_code,
      userId: accountant.id,
      username: accountant.username,
    },
  };
}

export async function loginAccountant(
  username: string,
  password: string
): Promise<AuthSession | null> {
  const accountant = await getAccountantByUsername(username);
  if (!accountant || !verifyPassword(password, accountant.passwordHash)) {
    return null;
  }

  const group = await getGroupById(accountant.groupId);
  if (!group) return null;

  return {
    role: "accountant",
    groupId: group.id,
    groupName: group.name,
    entryCode: group.entryCode,
    userId: accountant.id,
    username: accountant.username,
  };
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
