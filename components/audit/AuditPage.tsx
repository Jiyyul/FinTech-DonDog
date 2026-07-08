"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuditCard from "@/components/dashboard/AuditCard";
import AnomalyReviewModal from "@/components/dashboard/AnomalyReviewModal";
import ExceptionModal from "@/components/dashboard/ExceptionModal";
import Card from "@/components/common/Card";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { useAuditReviewActions } from "@/hooks/useAuditReviewActions";
import { ANOMALY_TYPE_LABELS, type AuditAnomaly, type BudgetCategory } from "@/lib/dashboard-types";
import { formatCurrency } from "@/lib/format";

export default function AuditPage() {
  const {
    anomalyQueue,
    deferredAnomalies: initialDeferred,
    pendingCoApprovals: initialPendingCoApprovals,
    calendarEvents,
  } = useDashboardData();
  const { persistReview } = useAuditReviewActions();

  const [anomalies, setAnomalies] = useState(anomalyQueue);
  const [deferredAnomalies, setDeferredAnomalies] = useState(initialDeferred);
  const [pendingCoApprovals, setPendingCoApprovals] = useState(initialPendingCoApprovals);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AuditAnomaly | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [exceptionOpen, setExceptionOpen] = useState(false);

  useEffect(() => setAnomalies(anomalyQueue), [anomalyQueue]);
  useEffect(() => setDeferredAnomalies(initialDeferred), [initialDeferred]);
  useEffect(() => setPendingCoApprovals(initialPendingCoApprovals), [initialPendingCoApprovals]);

  const openReview = (anomaly: AuditAnomaly) => {
    setSelectedAnomaly(anomaly);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAnomaly(null);
  };

  const removeFromQueue = (id: string) => {
    setAnomalies((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCategoryChange = async (category: BudgetCategory) => {
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

    await persistReview(selectedAnomaly, "category_change", { category });
  };

  return (
    <div className="mx-auto max-w-4xl pb-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-[14px] font-medium text-ink2 transition-colors duration-200 hover:text-navy"
      >
        <ArrowLeft size={18} strokeWidth={1.75} />
        대시보드
      </Link>

      <div className="mb-8">
        <p className="dash-section-label normal-case tracking-normal">AI 감사</p>
        <h1 className="ui-page-title mt-1">이상 거래 검토</h1>
      </div>

      <div className="mb-8 min-h-[360px]">
        <AuditCard
          className="h-full"
          anomalies={anomalies}
          deferredAnomalies={deferredAnomalies}
          pendingCoApprovals={pendingCoApprovals}
          onReview={openReview}
          onReviewDeferred={openReview}
          onReviewPendingCoApproval={openReview}
        />
      </div>

      <Card>
        <h2 className="mb-4 text-[16px] font-semibold text-navy">전체 이상 거래 목록</h2>
        {anomalies.length === 0 &&
        deferredAnomalies.length === 0 &&
        pendingCoApprovals.length === 0 ? (
          <p className="text-[14px] text-muted">검토할 이상 거래가 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {[...anomalies, ...pendingCoApprovals, ...deferredAnomalies].map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => openReview(item)}
                  className="flex w-full flex-col gap-1 rounded-2xl border border-hairline bg-surface/50 px-4 py-3 text-left transition-colors duration-200 hover:bg-surface"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-ink">{item.transaction.merchant}</span>
                    <span className="shrink-0 font-semibold tabular-nums text-navy">
                      {formatCurrency(item.transaction.amount)}
                    </span>
                  </div>
                  <span className="text-[12px] font-medium text-warning">
                    {ANOMALY_TYPE_LABELS[item.type]}
                  </span>
                  <p className="text-[13px] text-ink2">{item.reason}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <AnomalyReviewModal
        open={modalOpen}
        anomaly={selectedAnomaly}
        onClose={closeModal}
        onApprove={async () => {
          if (!selectedAnomaly) return;
          const action = selectedAnomaly.coApprovalPending ? "co_approved" : "approved";
          await persistReview(selectedAnomaly, action, {
            category: selectedAnomaly.transaction.category,
          });
          removeFromQueue(selectedAnomaly.id);
          setPendingCoApprovals((prev) => prev.filter((a) => a.id !== selectedAnomaly.id));
          closeModal();
        }}
        onException={() => setExceptionOpen(true)}
        onDefer={async () => {
          if (!selectedAnomaly) return;
          await persistReview(selectedAnomaly, "deferred", {
            category: selectedAnomaly.transaction.category,
          });
          setDeferredAnomalies((prev) => [...prev, { ...selectedAnomaly, deferred: true }]);
          removeFromQueue(selectedAnomaly.id);
          setExceptionOpen(false);
          closeModal();
        }}
        onRequestCoApproval={async () => {
          if (!selectedAnomaly) return;
          await persistReview(selectedAnomaly, "co_approval_pending", {
            category: selectedAnomaly.transaction.category,
          });
          setPendingCoApprovals((prev) => {
            if (prev.some((a) => a.id === selectedAnomaly.id)) return prev;
            return [...prev, { ...selectedAnomaly, coApprovalPending: true }];
          });
          removeFromQueue(selectedAnomaly.id);
          closeModal();
        }}
        onCategoryChange={handleCategoryChange}
      />

      <ExceptionModal
        open={exceptionOpen}
        schedules={calendarEvents}
        onClose={() => setExceptionOpen(false)}
        onLinkSchedule={async (scheduleId) => {
          if (!selectedAnomaly) return;
          const schedule = calendarEvents.find((e) => e.id === scheduleId);
          await persistReview(selectedAnomaly, "exception", {
            category: selectedAnomaly.transaction.category,
            relatedScheduleId: scheduleId,
            relatedScheduleTitle: schedule?.title,
          });
          removeFromQueue(selectedAnomaly.id);
          setExceptionOpen(false);
          closeModal();
        }}
        onDefer={async () => {
          if (!selectedAnomaly) return;
          await persistReview(selectedAnomaly, "deferred", {
            category: selectedAnomaly.transaction.category,
          });
          setDeferredAnomalies((prev) => [...prev, { ...selectedAnomaly, deferred: true }]);
          removeFromQueue(selectedAnomaly.id);
          setExceptionOpen(false);
          closeModal();
        }}
      />
    </div>
  );
}
