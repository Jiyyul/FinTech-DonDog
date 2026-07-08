"use client";

import LandingBackground from "@/components/landing/LandingBackground";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BeforeAfterSection from "@/components/landing/BeforeAfterSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import AuthModal from "@/components/auth/AuthModal";
import Toast from "@/components/common/Toast";

function LandingFooter() {
  const { openAuth } = useAuth();

  return (
    <footer
      id="support"
      className="border-t border-hairline bg-card/50 px-6 py-12 min-[1200px]:px-8"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Don Dog · 돈독. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-ink2">
          <a href="#support" className="transition-colors hover:text-navy">
            고객센터
          </a>
          <a href="#blog" className="transition-colors hover:text-navy">
            블로그
          </a>
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="transition-colors hover:text-navy"
          >
            로그인
          </button>
        </div>
      </div>
    </footer>
  );
}

function LandingPageContent() {
  const { toast } = useAuth();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-appbg">
      <LandingBackground />
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <BeforeAfterSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <div id="blog" className="sr-only" aria-hidden />
      <LandingFooter />
      <AuthModal />
      <Toast message={toast} />
    </div>
  );
}

export default function LandingPage() {
  return (
    <AuthProvider>
      <LandingPageContent />
    </AuthProvider>
  );
}
