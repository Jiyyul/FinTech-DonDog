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
import AddGroupModal, {
  toOrganization,
  type NewGroupFormData,
} from "@/components/layout/AddGroupModal";
import { useMockSession } from "@/components/auth/useMockSession";
import { ORGANIZATIONS, type Organization } from "@/lib/mock-data";
import {
  addUserOrganization,
  getUserOrganizations,
} from "@/lib/mock-user-store";

type MockUserContextValue = {
  organizations: Organization[];
  currentOrganization: Organization | null;
  isDemoAccount: boolean;
  isEmptyDashboard: boolean;
  hasEmptyData: boolean;
  addGroupOpen: boolean;
  openAddGroupModal: () => void;
  closeAddGroupModal: () => void;
};

const MockUserContext = createContext<MockUserContextValue | null>(null);

export function MockUserProvider({ children }: { children: ReactNode }) {
  const { session } = useMockSession();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [addGroupOpen, setAddGroupOpen] = useState(false);

  const isDemoAccount = session?.accountType === "demo";
  const isEmptyDashboard = Boolean(session && !isDemoAccount && organizations.length === 0);
  const hasEmptyData = Boolean(session && !isDemoAccount);
  const currentOrganization = organizations[0] ?? null;

  const syncOrganizations = useCallback(() => {
    if (!session) {
      setOrganizations([]);
      return;
    }

    if (session.accountType === "demo") {
      setOrganizations(ORGANIZATIONS);
      return;
    }

    setOrganizations(getUserOrganizations(session.user.id));
  }, [session]);

  useEffect(() => {
    syncOrganizations();
  }, [syncOrganizations]);

  useEffect(() => {
    const handleDataChange = () => syncOrganizations();
    window.addEventListener("dondok-user-data-change", handleDataChange);
    return () => window.removeEventListener("dondok-user-data-change", handleDataChange);
  }, [syncOrganizations]);

  const handleAddGroup = (data: NewGroupFormData) => {
    const newOrg = toOrganization(data);

    if (isDemoAccount) {
      setOrganizations((prev) => [...prev, newOrg]);
      setAddGroupOpen(false);
      return;
    }

    if (!session) return;

    const next = addUserOrganization(session.user.id, newOrg);
    setOrganizations(next);
    setAddGroupOpen(false);
  };

  const value = useMemo(
    () => ({
      organizations,
      currentOrganization,
      isDemoAccount,
      isEmptyDashboard,
      hasEmptyData,
      addGroupOpen,
      openAddGroupModal: () => setAddGroupOpen(true),
      closeAddGroupModal: () => setAddGroupOpen(false),
    }),
    [
      organizations,
      currentOrganization,
      isDemoAccount,
      isEmptyDashboard,
      hasEmptyData,
      addGroupOpen,
    ]
  );

  return (
    <MockUserContext.Provider value={value}>
      {children}
      <AddGroupModal
        open={addGroupOpen}
        onClose={() => setAddGroupOpen(false)}
        onSave={handleAddGroup}
      />
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
