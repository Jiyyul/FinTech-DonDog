"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  approveAnomalyAction,
  deferAnomalyAction,
  recordExceptionAction,
  requestCoApprovalAction,
} from "@/lib/actions/anomaly-actions";
import { updateTransactionCategoryAction } from "@/lib/actions/classification-actions";
import { deleteScheduleAction, saveScheduleAction } from "@/lib/actions/schedule-actions";
import HeroBudgetCard from "@/components/dashboard/HeroBudgetCard";
import AuditCard from "@/components/dashboard/AuditCard";
import CalendarCard from "@/components/dashboard/CalendarCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import BudgetTrendCard from "@/components/dashboard/BudgetTrendCard";
import AIReportCard from "@/components/dashboard/AIReportCard";
import ActivityFeedCard from "@/components/dashboard/ActivityFeedCard";
import AnomalyReviewModal from "@/components/dashboard/AnomalyReviewModal";
import TransactionDrawer from "@/components/dashboard/TransactionDrawer";
import ExceptionModal from "@/components/dashboard/ExceptionModal";
import ScheduleFormModal from "@/components/dashboard/ScheduleFormModal";
import FloatingAIChat from "@/components/ai/FloatingAIChat";
import { useSearch } from "@/components/layout/SearchProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { useMockUser } from "@/components/providers/MockUserProvider";
import { matchesSearch } from "@/lib/search-utils";
import type {
  AuditAnomaly,
  BudgetCategory,
  CalendarEvent,
  DashboardTransaction,
} from "@/lib/dashboard-types";

export default function Dashboard() {
  const router = useRouter();
  const { canEdit } = useAuth();
  const {
    anomalyQueue,
    calendarEvents: initialCalendarEvents,
    recentTransactions: transactions,
    activityFeed,
    logActivity,
  } = useDashboardData();
  const { currentOrganization } = useMockUser();
  const { query, selectTransactionId, clearSelectTransaction } = useSearch();

  const [anomalies, setAnomalies] = useState(anomalyQueue);
  const [deferredAnomalies, setDeferredAnomalies] = useState<AuditAnomaly[]>([]);
  const [calendarEvents, setCalendarEvents] = useState(initialCalendarEvents);

  const [anomalyModalOpen, setAnomalyModalOpen] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AuditAnomaly | null>(null);
  const [exceptionModalOpen, setExceptionModalOpen] = useState(false);

  const [txDrawerOpen, setTxDrawerOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<DashboardTransaction | null>(null);

  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const openAnomalyReview = (anomaly: AuditAnomaly) => {
    setSelectedAnomaly(anomaly);
    setAnomalyModalOpen(true);
  };

  const handleSelectTransaction = (tx: DashboardTransaction) => {
    const linkedAnomaly =
      anomalies.find((a) => a.transaction.id === tx.id) ??
      deferredAnomalies.find((a) => a.transaction.id === tx.id);
    if (linkedAnomaly) {
      if (canEdit) {
        openAnomalyReview(linkedAnomaly);
      } else {
        setSelectedTx(tx);
        setTxDrawerOpen(true);
      }
      return;
    }
    setSelectedTx(tx);
    setTxDrawerOpen(true);
  };

  const displayedTransactions = useMemo(() => {
    if (!query.trim()) return transactions;
    return transactions.filter((tx) => matchesSearch(tx, query));
  }, [transactions, query]);

  useEffect(() => {
    if (!selectTransactionId) return;

    const tx = transactions.find((t) => t.id === selectTransactionId);

    if (tx) handleSelectTransaction(tx);
    clearSelectTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectTransactionId, transactions, clearSelectTransaction]);

  const closeAnomalyModal = () => {
    setAnomalyModalOpen(false);
    setSelectedAnomaly(null);
  };

  const removeFromActiveQueue = (id: string) => {
    setAnomalies((prev) => prev.filter((a) => a.id !== id));
  };

  const handleApprove = async () => {
    if (!selectedAnomaly) return;
    const transactionId = selectedAnomaly.transaction.id;
    logActivity(`${selectedAnomaly.transaction.merchant} 이상거래를 승인했습니다.`, {
      icon: "check",
    });
    removeFromActiveQueue(selectedAnomaly.id);
    setDeferredAnomalies((prev) => prev.filter((a) => a.id !== selectedAnomaly.id));
    closeAnomalyModal();
    await approveAnomalyAction(
      transactionId,
      selectedAnomaly.transaction.merchant,
      selectedAnomaly.transaction.category
    );
    router.refresh();
  };

  const handleDefer = async () => {
    if (!selectedAnomaly) return;
    const transactionId = selectedAnomaly.transaction.id;

    const deferredItem: AuditAnomaly = { ...selectedAnomaly, deferred: true };

    setDeferredAnomalies((prev) => {
      if (prev.some((a) => a.id === deferredItem.id)) return prev;
      return [...prev, deferredItem];
    });
    logActivity(`${selectedAnomaly.transaction.merchant} 이상거래를 보류했습니다.`, {
      icon: "clock",
    });
    removeFromActiveQueue(selectedAnomaly.id);
    setExceptionModalOpen(false);
    closeAnomalyModal();
    await deferAnomalyAction(transactionId);
    router.refresh();
  };

  const handleCoApproval = async () => {
    if (!selectedAnomaly) return;
    const transactionId = selectedAnomaly.transaction.id;
    logActivity(`${selectedAnomaly.transaction.merchant} 공동 승인을 요청했습니다.`, {
      icon: "check",
    });
    removeFromActiveQueue(selectedAnomaly.id);
    setDeferredAnomalies((prev) => prev.filter((a) => a.id !== selectedAnomaly.id));
    closeAnomalyModal();
    await requestCoApprovalAction(
      transactionId,
      selectedAnomaly.transaction.merchant,
      selectedAnomaly.transaction.category
    );
    router.refresh();
  };

  const handleLinkSchedule = async (scheduleId: string) => {
    if (!selectedAnomaly) return;
    const transactionId = selectedAnomaly.transaction.id;
    const schedule = calendarEvents.find((e) => e.id === scheduleId);
    if (schedule) {
      setAnomalies((prev) =>
        prev.map((a) =>
          a.id === selectedAnomaly.id
            ? { ...a, relatedScheduleId: scheduleId, relatedSchedule: schedule.title }
            : a
        )
      );
      setSelectedAnomaly((prev) =>
        prev
          ? { ...prev, relatedScheduleId: scheduleId, relatedSchedule: schedule.title }
          : null
      );
      logActivity(
        `${selectedAnomaly.transaction.merchant} 거래를 "${schedule.title}" 일정에 연결했습니다.`,
        { icon: "calendar" }
      );
    }
    removeFromActiveQueue(selectedAnomaly.id);
    setExceptionModalOpen(false);
    closeAnomalyModal();
    await recordExceptionAction(transactionId, schedule ? `일정 연결: ${schedule.title}` : undefined);
    router.refresh();
  };

  const handleCategoryChange = async (category: BudgetCategory) => {
    if (!selectedAnomaly) return;
    if (selectedAnomaly.transaction.category === category) return;
    const transactionId = selectedAnomaly.transaction.id;
    const update = (a: AuditAnomaly) =>
      a.id === selectedAnomaly.id
        ? { ...a, transaction: { ...a.transaction, category } }
        : a;
    setAnomalies((prev) => prev.map(update));
    setDeferredAnomalies((prev) => prev.map(update));
    setSelectedAnomaly((prev) =>
      prev ? { ...prev, transaction: { ...prev.transaction, category } } : null
    );
    logActivity(
      `${selectedAnomaly.transaction.merchant} 카테고리를 ${category}(으)로 변경했습니다.`,
      { hasDogIcon: true }
    );
    await updateTransactionCategoryAction(transactionId, category);
    router.refresh();
  };

  const handleSaveEvent = async (event: Omit<CalendarEvent, "id"> & { id?: string }) => {
    const saved = await saveScheduleAction(event);
    setCalendarEvents((prev) => {
      const exists = prev.some((e) => e.id === saved.id);
      return exists ? prev.map((e) => (e.id === saved.id ? saved : e)) : [...prev, saved];
    });
    logActivity(
      event.id
        ? `일정 "${saved.title}"을(를) 수정했습니다.`
        : `새 일정 "${saved.title}"이(가) 등록되었습니다.`,
      { icon: "calendar" }
    );
    setEditingEvent(null);
    router.refresh();
  };

  const handleDeleteEvent = async (id: string) => {
    const event = calendarEvents.find((e) => e.id === id);
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
    if (event) {
      logActivity(`일정 "${event.title}"을(를) 삭제했습니다.`, { icon: "calendar" });
    }
    setEditingEvent(null);
    await deleteScheduleAction(id);
    router.refresh();
  };

  const semester = currentOrganization?.semester ?? "2026년 1학기";

  return (
    <div className="min-w-0 space-y-10">
      <section className="dash-row-duo">
        <div className="dash-grid-cell min-w-0">
          <HeroBudgetCard semester={semester} />
        </div>
        <div className="dash-grid-cell min-w-0">
          <AuditCard
            className="h-full min-h-[360px]"
            anomalies={anomalies}
            deferredAnomalies={deferredAnomalies}
            readOnly={!canEdit}
            onReview={openAnomalyReview}
            onReviewDeferred={openAnomalyReview}
          />
        </div>
      </section>

      <section className="dash-row-triple">
        <div className="dash-grid-cell min-w-0">
          <CalendarCard
            variant="compact"
            className="h-full min-h-[360px]"
            events={calendarEvents}
            readOnly={!canEdit}
            onAddEvent={() => {
              setEditingEvent(null);
              setScheduleFormOpen(true);
            }}
            onSelectEvent={(event) => {
              setEditingEvent(event);
              setScheduleFormOpen(true);
            }}
          />
        </div>
        <div className="dash-grid-cell min-w-0">
          <BudgetTrendCard className="h-full min-h-[360px]" />
        </div>
        <div className="dash-grid-cell min-w-0">
          <AIReportCard className="h-full min-h-[360px]" />
        </div>
      </section>

      <section className="dash-row-bottom">
        <div className="dash-grid-cell min-w-0">
          <RecentTransactions
            transactions={displayedTransactions}
            searchQuery={query}
            onSelect={handleSelectTransaction}
            showReceiptActions={canEdit}
            onAddReceipt={(tx) => {
              if (canEdit) router.push(`/receipts?transactionId=${tx.id}`);
            }}
            onViewReceipt={() => router.push("/receipts")}
          />
        </div>
        <div className="dash-grid-cell min-w-0">
          <ActivityFeedCard activities={activityFeed} className="h-full min-h-0" />
        </div>
      </section>

      {canEdit && (
        <>
          <AnomalyReviewModal
            open={anomalyModalOpen}
            anomaly={selectedAnomaly}
            onClose={closeAnomalyModal}
            onApprove={handleApprove}
            onException={() => setExceptionModalOpen(true)}
            onDefer={handleDefer}
            onRequestCoApproval={handleCoApproval}
            onCategoryChange={handleCategoryChange}
          />

          <ExceptionModal
            open={exceptionModalOpen}
            schedules={calendarEvents}
            onClose={() => setExceptionModalOpen(false)}
            onLinkSchedule={handleLinkSchedule}
            onDefer={handleDefer}
          />

          <ScheduleFormModal
            open={scheduleFormOpen}
            initial={editingEvent}
            year={2026}
            month={7}
            onClose={() => {
              setScheduleFormOpen(false);
              setEditingEvent(null);
            }}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
          />
        </>
      )}

      <TransactionDrawer
        open={txDrawerOpen}
        transaction={selectedTx}
        onClose={() => {
          setTxDrawerOpen(false);
          setSelectedTx(null);
        }}
      />

      <FloatingAIChat />
    </div>
  );
}
