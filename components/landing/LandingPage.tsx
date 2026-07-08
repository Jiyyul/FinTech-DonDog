"use client";

import LandingBackground from "@/components/landing/LandingBackground";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AIChatbotSection from "@/components/landing/AIChatbotSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BeforeAfterSection from "@/components/landing/BeforeAfterSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import AuthModal from "@/components/auth/AuthModal";
import PaymentModal from "@/components/payment/PaymentModal";
import { PaymentProvider, usePayment } from "@/components/payment/PaymentProvider";
import Toast from "@/components/common/Toast";

function LandingFooter() {
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
        </div>
      </div>
    </footer>
  );
}

function LandingPageContent() {
  const { toast: authToast } = useAuth();
  const { toast: paymentToast } = usePayment();
  const toast = authToast ?? paymentToast;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-appbg">
      <LandingBackground />
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AIChatbotSection />
        <HowItWorksSection />
        <BeforeAfterSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <div id="blog" className="sr-only" aria-hidden />
      <LandingFooter />
      <AuthModal />
      <PaymentModal />
      <Toast message={toast} />
    </div>
  );
}

export default function LandingPage() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <LandingPageContent />
      </PaymentProvider>
    </AuthProvider>
  );
}
