"use client";

import { useEffect, useRef, useState } from "react";
import { X, Plus, Trash2, Upload } from "lucide-react";
import Button from "@/components/common/Button";
import type { Organization } from "@/lib/mock-data";

export type GroupScheduleDraft = {
  id: string;
  name: string;
  date: string;
  budget: string;
};

export type NewGroupFormData = {
  name: string;
  activityStart: string;
  activityEnd: string;
  year: string;
  semester: "1" | "2";
  totalBudget: string;
  anomalyThreshold: string;
  schedules: GroupScheduleDraft[];
  rulesFileName?: string;
};

type AddGroupModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: NewGroupFormData) => void;
};

const inputClass =
  "h-12 w-full rounded-btn border border-hairline bg-card px-4 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]";

const emptySchedule = (): GroupScheduleDraft => ({
  id: `sch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: "",
  date: "",
  budget: "",
});

export default function AddGroupModal({ open, onClose, onSave }: AddGroupModalProps) {
  const [name, setName] = useState("");
  const [activityStart, setActivityStart] = useState("");
  const [activityEnd, setActivityEnd] = useState("");
  const [year, setYear] = useState("2026");
  const [semester, setSemester] = useState<"1" | "2">("1");
  const [totalBudget, setTotalBudget] = useState("");
  const [anomalyThreshold, setAnomalyThreshold] = useState("300000");
  const [schedules, setSchedules] = useState<GroupScheduleDraft[]>([]);
  const [rulesFileName, setRulesFileName] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setName("");
    setActivityStart("");
    setActivityEnd("");
    setYear("2026");
    setSemester("1");
    setTotalBudget("");
    setAnomalyThreshold("300000");
    setSchedules([]);
    setRulesFileName(undefined);
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      activityStart,
      activityEnd,
      year,
      semester,
      totalBudget,
      anomalyThreshold,
      schedules: schedules.filter((s) => s.name.trim()),
      rulesFileName,
    });
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-[90] flex max-h-[90vh] w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover animate-chat-open"
        role="dialog"
        aria-modal
        aria-labelledby="add-group-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-hairline px-6 py-5">
          <h2
            id="add-group-title"
            className="text-[18px] font-semibold tracking-title-tight text-navy"
          >
            새 모임 추가
          </h2>
          <button type="button" onClick={onClose} className="ui-icon-btn" aria-label="닫기">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">모임 이름</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="예: 컴퓨터공학과 학생회"
                required
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-[13px] text-muted">활동 시작일</span>
                <input
                  type="text"
                  value={activityStart}
                  onChange={(e) => setActivityStart(e.target.value)}
                  className={inputClass}
                  placeholder="2026.03.01"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] text-muted">활동 종료일</span>
                <input
                  type="text"
                  value={activityEnd}
                  onChange={(e) => setActivityEnd(e.target.value)}
                  className={inputClass}
                  placeholder="2026.08.31"
                  required
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-[13px] text-muted">년도</span>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={inputClass}
                  min={2020}
                  max={2099}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] text-muted">학기</span>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as "1" | "2")}
                  className={inputClass}
                >
                  <option value="1">1학기</option>
                  <option value="2">2학기</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">모임 총 예산 (원)</span>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className={inputClass}
                placeholder="8000000"
                min={0}
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">
                이상감지 기준 금액 (원)
              </span>
              <input
                type="number"
                value={anomalyThreshold}
                onChange={(e) => setAnomalyThreshold(e.target.value)}
                className={inputClass}
                placeholder="300000"
                min={0}
                required
              />
              <p className="mt-1.5 text-[12px] text-muted">
                일정 예산을 초과한 거래 발생 시 이상감지 알림을 보냅니다.
              </p>
            </label>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] text-muted">일정 등록 (선택)</span>
                <button
                  type="button"
                  onClick={() => setSchedules((prev) => [...prev, emptySchedule()])}
                  className="flex items-center gap-1 text-[12px] font-medium text-brand transition-colors hover:text-navy"
                >
                  <Plus size={14} strokeWidth={1.75} />
                  일정 추가
                </button>
              </div>
              {schedules.length === 0 ? (
                <p className="rounded-xl bg-surface px-4 py-3 text-[12px] text-muted">
                  일정은 나중에 등록해도 됩니다.
                </p>
              ) : (
                <ul className="space-y-2">
                  {schedules.map((schedule) => (
                    <li
                      key={schedule.id}
                      className="flex items-center gap-2 rounded-xl bg-surface p-3 ring-1 ring-hairline"
                    >
                      <input
                        value={schedule.name}
                        onChange={(e) =>
                          setSchedules((prev) =>
                            prev.map((s) =>
                              s.id === schedule.id ? { ...s, name: e.target.value } : s
                            )
                          )
                        }
                        className="h-10 min-w-0 flex-1 rounded-btn border border-hairline bg-card px-3 text-[13px] outline-none focus:border-brand"
                        placeholder="일정 이름"
                      />
                      <input
                        type="text"
                        value={schedule.date}
                        onChange={(e) =>
                          setSchedules((prev) =>
                            prev.map((s) =>
                              s.id === schedule.id ? { ...s, date: e.target.value } : s
                            )
                          )
                        }
                        className="h-10 w-[6.5rem] shrink-0 rounded-btn border border-hairline bg-card px-3 text-[13px] outline-none focus:border-brand"
                        placeholder="2026.07.12"
                      />
                      <input
                        type="number"
                        value={schedule.budget}
                        onChange={(e) =>
                          setSchedules((prev) =>
                            prev.map((s) =>
                              s.id === schedule.id ? { ...s, budget: e.target.value } : s
                            )
                          )
                        }
                        className="h-10 w-24 shrink-0 rounded-btn border border-hairline bg-card px-3 text-[13px] outline-none focus:border-brand"
                        placeholder="예산"
                        min={0}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSchedules((prev) => prev.filter((s) => s.id !== schedule.id))
                        }
                        className="ui-icon-btn h-9 w-9 shrink-0"
                        aria-label="일정 삭제"
                      >
                        <Trash2 size={15} strokeWidth={1.5} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <span className="mb-1.5 block text-[13px] text-muted">회칙 업로드</span>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.hwp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setRulesFileName(file?.name);
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-hairline bg-surface py-8 transition-colors hover:border-brand/30 hover:bg-brand-subtle/20"
              >
                <Upload size={20} className="text-muted" strokeWidth={1.5} />
                <span className="text-[13px] text-ink2">
                  {rulesFileName ?? "PDF, DOC, HWP 파일 선택"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex shrink-0 gap-2.5 border-t border-hairline px-6 py-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              모임 생성
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export function toOrganization(data: NewGroupFormData): Organization {
  return {
    id: `org-${Date.now()}`,
    name: data.name,
    semester: `${data.year}년 ${data.semester}학기`,
  };
}
