import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#C4FF4D",
          hover: "#B8F23F",
          pressed: "#A8E032",
          subtle: "#F4FFE0",
        },
        navy: {
          DEFAULT: "#23324F",
          hover: "#1C2840",
        },
        accent: {
          DEFAULT: "#BA8CFF",
          subtle: "#F3EBFF",
        },
        appbg: "#F8FAFC",
        sidebar: "#FCFCFD",
        surface: "#F3F5F7",
        card: "#FFFFFF",
        hairline: "#E8EDF2",
        ink: "#1A1A1A",
        ink2: "#64748B",
        muted: "#94A3B8",
        disabled: "#CBD5E1",
        inverse: "#FFFFFF",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
        purple: "#8B5CF6",
        chart: {
          event: "#5B8DEF",
          food: "#8FD36B",
          ops: "#BA8CFF",
          transport: "#FFD166",
          promo: "#FF8C69",
          equipment: "#4FB3BF",
          etc: "#CBD5E1",
        },
      },
      borderRadius: {
        card: "24px",
        btn: "14px",
        modal: "24px",
      },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.06)",
        "card-hover": "0 12px 36px rgba(0,0,0,0.08)",
      },
      letterSpacing: {
        "title-tight": "-0.03em",
        "label-wide": "0.06em",
      },
      fontFamily: {
        sans: ["Pretendard", "SUIT", "-apple-system", "sans-serif"],
      },
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "6.5": "1.625rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },
      transitionDuration: {
        DEFAULT: "200ms",
        card: "250ms",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
