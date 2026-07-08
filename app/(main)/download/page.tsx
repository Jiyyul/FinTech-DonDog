export default function DownloadPage() {
  return (
    <div className="max-w-2xl">
      <p className="ui-page-subtitle mb-6">
        회계 장부를 엑셀(.xlsx) 파일로 다운로드합니다.
      </p>
      <button
        type="button"
        className="rounded-btn bg-brand px-5 py-3 text-[14px] font-semibold text-inverse transition-all duration-200 hover:brightness-110"
      >
        장부 다운로드 (.xlsx)
      </button>
    </div>
  );
}
