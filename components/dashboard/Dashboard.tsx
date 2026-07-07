"use client";

import { useState } from "react";
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
import ReceiptUploadModal from "@/components/dashboard/ReceiptUploadModal";
import ScheduleFormModal from "@/components/dashboard/ScheduleFormModal";
import FloatingAIChat from "@/components/ai/FloatingAIChat";
import {
  ANOMALY_QUEUE,
  CALENDAR_EVENTS,
  RECENT_TRANSACTIONS,
} from "@/lib/dashboard-mock-data";
import type {
  AuditAnomaly,
  BudgetCategory,
  CalendarEvent,
  DashboardTransaction,
} from "@/lib/dashboard-types";

export default function Dashboard() {
  const [anomalies, setAnomalies] = useState(ANOMALY_QUEUE);
  const [deferredAnomalies, setDeferredAnomalies] = useState<AuditAnomaly[]>([]);
  const [transactions, setTransactions] = useState(RECENT_TRANSACTIONS);
  const [calendarEvents, setCalendarEvents] = useState(CALENDAR_EVENTS);

  const [anomalyModalOpen, setAnomalyModalOpen] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AuditAnomaly | null>(null);
  const [exceptionModalOpen, setExceptionModalOpen] = useState(false);

  const [txDrawerOpen, setTxDrawerOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<DashboardTransaction | null>(null);

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptTx, setReceiptTx] = useState<DashboardTransaction | null>(null);

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
      openAnomalyReview(linkedAnomaly);
      return;
    }
    setSelectedTx(tx);
    setTxDrawerOpen(true);
  };

  const closeAnomalyModal = () => {
    setAnomalyModalOpen(false);
    setSelectedAnomaly(null);
  };

  const removeFromActiveQueue = (id: string) => {
    setAnomalies((prev) => prev.filter((a) => a.id !== id));
  };

  const handleApprove = () => {
    if (!selectedAnomaly) return;
    removeFromActiveQueue(selectedAnomaly.id);
    setDeferredAnomalies((prev) => prev.filter((a) => a.id !== selectedAnomaly.id));
    closeAnomalyModal();
  };

  const handleDefer = () => {
    if (!selectedAnomaly) return;

    const deferredItem: AuditAnomaly = { ...selectedAnomaly, deferred: true };

    setDeferredAnomalies((prev) => {
      if (prev.some((a) => a.id === deferredItem.id)) return prev;
      return [...prev, deferredItem];
    });
    removeFromActiveQueue(selectedAnomaly.id);
    setExceptionModalOpen(false);
    closeAnomalyModal();
  };

  const handleCoApproval = () => {
    if (!selectedAnomaly) return;
    removeFromActiveQueue(selectedAnomaly.id);
    setDeferredAnomalies((prev) => prev.filter((a) => a.id !== selectedAnomaly.id));
    closeAnomalyModal();
  };

  const handleLinkSchedule = (scheduleId: string) => {
    if (!selectedAnomaly) return;
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
    }
    removeFromActiveQueue(selectedAnomaly.id);
    setExceptionModalOpen(false);
    closeAnomalyModal();
  };

  const handleCategoryChange = (category: BudgetCategory) => {
    if (!selectedAnomaly) return;
    const update = (a: AuditAnomaly) =>
      a.id === selectedAnomaly.id
        ? { ...a, transaction: { ...a.transaction, category } }
        : a;
    setAnomalies((prev) => prev.map(update));
    setDeferredAnomalies((prev) => prev.map(update));
    setSelectedAnomaly((prev) =>
      prev ? { ...prev, transaction: { ...prev.transaction, category } } : null
    );
  };

  const handleSaveEvent = (event: Omit<CalendarEvent, "id"> & { id?: string }) => {
    if (event.id) {
      setCalendarEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, ...event, id: event.id } : e))
      );
    } else {
      const newEvent: CalendarEvent = {
        ...event,
        id: `ev-${Date.now()}`,
      };
      setCalendarEvents((prev) => [...prev, newEvent]);
    }
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
    setEditingEvent(null);
  };

  const handleReceiptUpload = () => {
    if (!receiptTx) return;
    setTransactions((prev) =>
      prev.map((t) => (t.id === receiptTx.id ? { ...t, hasReceipt: true } : t))
    );
    setReceiptModalOpen(false);
    setReceiptTx(null);
  };

  return (
    <div className="min-w-0 space-y-10">
      <section className="dash-row-duo">
        <div className="dash-grid-cell min-w-0">
          <HeroBudgetCard />
        </div>
        <div className="dash-grid-cell min-w-0">
          <AuditCard
            className="h-full min-h-[360px]"
            anomalies={anomalies}
            deferredAnomalies={deferredAnomalies}
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
            transactions={transactions}
            onSelect={handleSelectTransaction}
            onAddReceipt={(tx) => {
              setReceiptTx(tx);
              setReceiptModalOpen(true);
            }}
          />
        </div>
        <div className="dash-grid-cell min-w-0">
          <ActivityFeedCard className="h-full min-h-0" />
        </div>
      </section>

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

      <TransactionDrawer
        open={txDrawerOpen}
        transaction={selectedTx}
        onClose={() => {
          setTxDrawerOpen(false);
          setSelectedTx(null);
        }}
      />

      <ReceiptUploadModal
        open={receiptModalOpen}
        merchant={receiptTx?.merchant ?? ""}
        onClose={() => {
          setReceiptModalOpen(false);
          setReceiptTx(null);
        }}
        onUpload={handleReceiptUpload}
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

      <FloatingAIChat />
    </div>
  );
}
