import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Don Dog · 돈독 대시보드",
  description: "AI 기반 모임 회계 감사 및 예산 관리 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
