import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Don Dog · 돈독 — AI 기반 동아리 회계 관리",
  description:
    "계좌와 카드를 연결하면 AI가 거래를 자동 분류하고, 회계장부 작성부터 이상거래 탐지, 실시간 회계 공개까지 한 번에.",
};

export default function RootPage() {
  const session = getServerSession();
  if (session) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
