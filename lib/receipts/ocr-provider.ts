export type OcrScanResult = {
  rawText: string;
  confidence: number;
};

/** kor+eng 조합이 불안정할 때를 대비한 순차 폴백 언어 조합 */
const OCR_LANG_ATTEMPTS: string[][] = [
  ["kor", "eng"],
  ["eng", "kor"],
  ["kor"],
];

/**
 * 업로드된 영수증 이미지를 tesseract.js로 실제 OCR 처리한다.
 * 언어 조합을 순서대로 시도하다가 전부 실패하면 에러를 던지며,
 * 호출부(receipt-parser.ts)는 이를 잡아 사용자에게 실패 메시지를 보여준다.
 */
export async function runOcr(file: File): Promise<OcrScanResult> {
  const { createWorker } = await import("tesseract.js");

  let lastError: unknown = null;

  for (const langs of OCR_LANG_ATTEMPTS) {
    let worker: Awaited<ReturnType<typeof createWorker>> | null = null;
    try {
      worker = await createWorker(langs);
      const { data } = await worker.recognize(file);
      return {
        rawText: data.text ?? "",
        confidence: Math.round(data.confidence ?? 0),
      };
    } catch (err) {
      lastError = err;
    } finally {
      if (worker) {
        await worker.terminate().catch(() => {});
      }
    }
  }

  throw new Error(
    lastError instanceof Error ? lastError.message : "OCR_FAILED"
  );
}
