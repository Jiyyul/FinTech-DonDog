export default function DownloadPage() {
  return (
    <div className="max-w-2xl">
      <p className="ui-page-subtitle mb-6">
        회계 장부를 CSV 파일로 다운로드합니다. 엑셀, 구글 시트에서 바로 열 수 있어요.
      </p>
      <a
        href="/api/export"
        download
        className="inline-block rounded-btn bg-brand px-5 py-3 text-[14px] font-semibold text-inverse transition-all duration-200 hover:brightness-110"
      >
        장부 다운로드 (.csv)
      </a>
    </div>
  );
}
