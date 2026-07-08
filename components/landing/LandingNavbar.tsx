"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useMockSession } from "@/components/auth/useMockSession";
import LandingLoggedInNav from "@/components/landing/LandingLoggedInNav";
import { LANDING_NAV_LINKS } from "@/lib/landing-data";

export default function LandingNavbar() {
  const { openAuth } = useAuth();
  const { session, hydrated } = useMockSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = hydrated && Boolean(session?.isLoggedIn);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogin = () => {
    setMobileOpen(false);
    openAuth("login");
  };

  const handleSignup = () => {
    setMobileOpen(false);
    openAuth("signup");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-premium ${
        scrolled
          ? "border-b border-hairline/80 bg-card/75 shadow-card backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 min-[1200px]:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo/dondog-logo.png"
            alt="Don Dog"
            width={453}
            height={428}
            className="h-9 w-auto object-contain"
            priority
          />
          <span className="text-[17px] font-bold tracking-title-tight text-navy">
            돈독
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {LANDING_NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-ink2 transition-colors duration-200 hover:text-navy"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn && session?.user ? (
            <LandingLoggedInNav user={session.user} />
          ) : (
            <>
              <button
                type="button"
                onClick={() => openAuth("login")}
                className="inline-flex h-11 items-center rounded-btn px-4 text-[14px] font-semibold text-ink2 transition-all duration-200 ease-premium hover:bg-surface hover:text-navy"
              >
                로그인
              </button>
              <button
                type="button"
                onClick={() => openAuth("signup")}
                className="inline-flex h-11 items-center rounded-btn bg-brand px-5 text-[14px] font-semibold text-inverse shadow-[0_1px_2px_rgba(10,22,128,0.12)] transition-all duration-200 ease-premium hover:scale-[1.04] hover:bg-brand-hover active:scale-[0.99]"
              >
                무료 시작하기
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="ui-icon-btn lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-hairline bg-card/95 px-6 py-5 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {LANDING_NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 text-[15px] font-medium text-ink2 transition-colors hover:bg-surface hover:text-navy"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 border-t border-hairline pt-4">
            {isLoggedIn && session?.user ? (
              <LandingLoggedInNav
                user={session.user}
                onNavigate={() => setMobileOpen(false)}
                stacked
              />
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="inline-flex h-11 items-center justify-center rounded-btn border border-hairline bg-card text-[14px] font-semibold text-ink"
                >
                  로그인
                </button>
                <button
                  type="button"
                  onClick={handleSignup}
                  className="inline-flex h-11 items-center justify-center rounded-btn bg-brand text-[14px] font-semibold text-inverse"
                >
                  무료 시작하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
