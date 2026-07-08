"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PaymentPlanId } from "@/lib/payment-data";

type PaymentContextValue = {
  isOpen: boolean;
  planId: PaymentPlanId | null;
  toast: string | null;
  openPayment: (planId: PaymentPlanId) => void;
  closePayment: () => void;
  showToast: (message: string) => void;
};

const PaymentContext = createContext<PaymentContextValue | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [planId, setPlanId] = useState<PaymentPlanId | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const openPayment = useCallback((nextPlanId: PaymentPlanId) => {
    setPlanId(nextPlanId);
    setIsOpen(true);
  }, []);

  const closePayment = useCallback(() => {
    setIsOpen(false);
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const value = useMemo(
    () => ({ isOpen, planId, toast, openPayment, closePayment, showToast }),
    [isOpen, planId, toast, openPayment, closePayment, showToast]
  );

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within PaymentProvider");
  }
  return context;
}
