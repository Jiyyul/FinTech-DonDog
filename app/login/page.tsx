"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("dondok-session");
    }
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-appbg px-4">
      <div className="w-full max-w-sm rounded-card border border-hairline bg-card p-8 shadow-card">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo/dondog-logo.png"
            alt="Don Dog"
            width={453}
            height={428}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>
        <h1 className="text-center text-[22px] font-semibold tracking-title-tight text-navy">
          로그인
        </h1>
        <p className="mt-2 text-center text-[14px] text-muted">
          Don Dog에 다시 접속하려면 로그인하세요.
        </p>
        <Button type="button" variant="primary" className="mt-8 w-full" onClick={handleLogin}>
          대시보드로 이동
        </Button>
      </div>
    </div>
  );
}
