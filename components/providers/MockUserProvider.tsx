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
import { useAuth } from "@/components/providers/AuthProvider";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { ORGANIZATIONS, type Organization } from "@/lib/mock-data";

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

const DEMO_GROUP_ID = 1;

export function MockUserProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const { allTransactions } = useDashboardData();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [addGroupOpen, setAddGroupOpen] = useState(false);

  const isDemoAccount = session.groupId === DEMO_GROUP_ID;
  const isEmptyDashboard = allTransactions.length === 0;
  const hasEmptyData = isEmptyDashboard;
  const currentOrganization = organizations[0] ?? null;

  const syncOrganizations = useCallback(() => {
    if (isDemoAccount) {
      setOrganizations(ORGANIZATIONS);
      return;
    }

    setOrganizations([
      {
        id: String(session.groupId),
        name: session.groupName,
        semester: "2026년 1학기",
      },
    ]);
  }, [isDemoAccount, session.groupId, session.groupName, session.role]);

  useEffect(() => {
    syncOrganizations();
  }, [syncOrganizations]);

  const handleAddGroup = (data: NewGroupFormData) => {
    const newOrg = toOrganization(data);

    if (isDemoAccount) {
      setOrganizations((prev) => [...prev, newOrg]);
      setAddGroupOpen(false);
      return;
    }

    setOrganizations((prev) => [...prev, newOrg]);
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
