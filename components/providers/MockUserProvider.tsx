"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import AddGroupModal, { type NewGroupFormData } from "@/components/layout/AddGroupModal";
import GroupEntryCodeModal from "@/components/layout/GroupEntryCodeModal";
import { useAuth } from "@/components/providers/AuthProvider";
import type { Organization } from "@/lib/mock-data";

type MockUserContextValue = {
  organizations: Organization[];
  currentOrganization: Organization | null;
  addGroupOpen: boolean;
  openAddGroupModal: () => void;
  closeAddGroupModal: () => void;
};

const MockUserContext = createContext<MockUserContextValue | null>(null);

export function MockUserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { session, isAccountant } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [entryCodeModal, setEntryCodeModal] = useState<{
    groupName: string;
    entryCode: string;
  } | null>(null);

  const currentOrganization =
    organizations.find((org) => org.id === String(session.groupId)) ?? organizations[0] ?? null;

  const syncOrganizations = useCallback(() => {
    if (session.role === "member") {
      setOrganizations([
        {
          id: String(session.groupId),
          name: session.groupName,
          semester: "",
        },
      ]);
      return;
    }

    const groups = session.groups?.length
      ? session.groups
      : [{ id: session.groupId, name: session.groupName, entryCode: session.entryCode }];

    setOrganizations(
      groups.map((group) => ({
        id: String(group.id),
        name: group.name,
        semester: "2026년 1학기",
      }))
    );
  }, [session.groupId, session.groupName, session.entryCode, session.groups, session.role]);

  useEffect(() => {
    syncOrganizations();
  }, [syncOrganizations]);

  const handleAddGroup = async (data: NewGroupFormData) => {
    const totalBudget = Number(data.totalBudget.replace(/,/g, ""));
    const res = await fetch("/api/auth/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupName: data.name,
        totalBudget,
      }),
    });

    if (!res.ok) return;

    const json = (await res.json()) as {
      session?: { groupName: string; entryCode: string };
    };

    setAddGroupOpen(false);
    if (json.session) {
      setEntryCodeModal({
        groupName: json.session.groupName,
        entryCode: json.session.entryCode,
      });
    }
    router.refresh();
  };

  const value = useMemo(
    () => ({
      organizations,
      currentOrganization,
      addGroupOpen,
      openAddGroupModal: () => setAddGroupOpen(true),
      closeAddGroupModal: () => setAddGroupOpen(false),
    }),
    [organizations, currentOrganization, addGroupOpen]
  );

  return (
    <MockUserContext.Provider value={value}>
      {children}
      {isAccountant && (
        <>
          <AddGroupModal
            open={addGroupOpen}
            onClose={() => setAddGroupOpen(false)}
            onSave={handleAddGroup}
          />
          <GroupEntryCodeModal
            open={!!entryCodeModal}
            groupName={entryCodeModal?.groupName ?? ""}
            entryCode={entryCodeModal?.entryCode ?? ""}
            onClose={() => setEntryCodeModal(null)}
          />
        </>
      )}
    </MockUserContext.Provider>
  );
}

export function useMockUser() {
  const context = useContext(MockUserContext);
  if (!context) {
    throw new Error("useMockUser must be used within MockUserProvider");
  }
  return context;
}
