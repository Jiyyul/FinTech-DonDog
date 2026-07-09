import Image from "next/image";
import Link from "next/link";

const LOGO_SRC = "/logo/dondog-logo.png";
const LOGO_WIDTH = 453;
const LOGO_HEIGHT = 428;

export default function DonDogLogo() {
  return (
    <Link
      href="/landing"
      className="sidebar-logo-block rounded-xl transition-opacity duration-200 hover:opacity-80"
      aria-label="돈독 서비스 소개로 이동"
    >
      <div className="sidebar-logo-mark flex shrink-0 items-center justify-center p-1">
        <Image
          src={LOGO_SRC}
          alt="Don Dog"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          className="h-[38px] w-auto object-contain"
          priority
        />
      </div>

      <div className="sidebar-label sidebar-brand-text min-w-0">
        <p className="text-[13px] font-bold tracking-[0.1em] text-navy">
          DON DOG
        </p>
        <p className="mt-1 text-[11px] font-medium leading-snug tracking-[0.02em] text-muted">
          AI Accounting Platform
        </p>
      </div>
    </Link>
  );
}
