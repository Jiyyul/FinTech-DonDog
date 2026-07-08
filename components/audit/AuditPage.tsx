"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  approveAnomalyAction,
  deferAnomalyAction,
  recordExceptionAction,
  requestCoApprovalAction,
} from "@/lib/actions/anomaly-actions";
import { updateTransactionCategoryAction } from "@/lib/actions/classification-actions";
import AuditCard from "@/components/dashboard/AuditCard";
import AnomalyReviewModal from "@/components/dashboard/AnomalyReviewModal";
import ExceptionModal from "@/components/dashboard/ExceptionModal";
import Card from "@/components/common/Card";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { ANOMALY_TYPE_LABELS, type AuditAnomaly } from "@/lib/dashboard-types";
import { formatCurrency } from "@/lib/format";

export default function AuditPage() {
  const router = useRouter();
  const { anomalyQueue, calendarEvents } = useDashboardData();
  const [anomalies, setAnomalies] = useState(anomalyQueue);
  const [deferredAnomalies, setDeferredAnomalies] = useState<AuditAnomaly[]>([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AuditAnomaly | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [exceptionOpen, setExceptionOpen] = useState(false);

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

  return (
    <div className="mx-auto max-w-4xl pb-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-[14px] font-medium text-ink2 transition-colors duration-200 hover:text-navy"
      >
        <ArrowLeft size={18} strokeWidth={1.75} />
        대시보드
      </Link>

      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="dash-section-label normal-case tracking-normal">AI 감사</p>
          <h1 className="ui-page-title mt-1">이상 거래 검토</h1>
        </div>
        <Link
          href="/audit/overview"
          className="shrink-0 text-[13px] font-medium text-navy underline-offset-4 hover:underline"
        >
          전체 이상거래 보기 →
        </Link>
      </div>

      <div className="mb-8 min-h-[360px]">
        <AuditCard
          className="h-full"
          anomalies={anomalies}
          deferredAnomalies={deferredAnomalies}
          onReview={openReview}
          onReviewDeferred={openReview}
        />
      </div>

      <Card>
        <h2 className="mb-4 text-[16px] font-semibold text-navy">전체 이상 거래 목록</h2>
        {anomalies.length === 0 && deferredAnomalies.length === 0 ? (
          <p className="text-[14px] text-muted">검토할 이상 거래가 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {[...anomalies, ...deferredAnomalies].map((item) => (
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
          const transactionId = selectedAnomaly.transaction.id;
          const { merchant, category } = selectedAnomaly.transaction;
          removeFromQueue(selectedAnomaly.id);
          closeModal();
          await approveAnomalyAction(transactionId, merchant, category);
          router.refresh();
        }}
        onException={() => setExceptionOpen(true)}
        onDefer={async () => {
          if (!selectedAnomaly) return;
          const transactionId = selectedAnomaly.transaction.id;
          setDeferredAnomalies((prev) => [...prev, { ...selectedAnomaly, deferred: true }]);
          removeFromQueue(selectedAnomaly.id);
          setExceptionOpen(false);
          closeModal();
          await deferAnomalyAction(transactionId);
          router.refresh();
        }}
        onRequestCoApproval={async () => {
          if (!selectedAnomaly) return;
          const transactionId = selectedAnomaly.transaction.id;
          const { merchant, category } = selectedAnomaly.transaction;
          removeFromQueue(selectedAnomaly.id);
          closeModal();
          await requestCoApprovalAction(transactionId, merchant, category);
          router.refresh();
        }}
        onCategoryChange={async (category) => {
          if (!selectedAnomaly) return;
          const transactionId = selectedAnomaly.transaction.id;
          const update = (a: AuditAnomaly) =>
            a.id === selectedAnomaly.id
              ? { ...a, transaction: { ...a.transaction, category } }
              : a;
          setAnomalies((prev) => prev.map(update));
          setSelectedAnomaly((prev) =>
            prev ? { ...prev, transaction: { ...prev.transaction, category } } : null
          );
          await updateTransactionCategoryAction(transactionId, category);
          router.refresh();
        }}
      />

      <ExceptionModal
        open={exceptionOpen}
        schedules={calendarEvents}
        onClose={() => setExceptionOpen(false)}
        onLinkSchedule={async () => {
          if (!selectedAnomaly) return;
          const transactionId = selectedAnomaly.transaction.id;
          removeFromQueue(selectedAnomaly.id);
          setExceptionOpen(false);
          closeModal();
          await recordExceptionAction(transactionId);
          router.refresh();
        }}
        onDefer={async () => {
          if (!selectedAnomaly) return;
          const transactionId = selectedAnomaly.transaction.id;
          setDeferredAnomalies((prev) => [...prev, { ...selectedAnomaly, deferred: true }]);
          removeFromQueue(selectedAnomaly.id);
          setExceptionOpen(false);
          closeModal();
          await deferAnomalyAction(transactionId);
          router.refresh();
        }}
      />
    </div>
  );
}
