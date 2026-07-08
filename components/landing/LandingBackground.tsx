export default function LandingBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-appbg" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(147,178,248,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 45%, rgba(251,237,176,0.05) 0%, transparent 55%), radial-gradient(ellipse 65% 45% at 15% 75%, rgba(10,22,128,0.04) 0%, transparent 55%)",
        }}
      />
      <div className="absolute -left-32 top-[35%] h-[400px] w-[400px] rounded-full bg-secondary/[0.05] blur-[120px]" />
      <div className="absolute -right-24 top-[55%] h-[360px] w-[360px] rounded-full bg-accent-subtle/[0.06] blur-[100px]" />
      <div className="absolute bottom-[8%] left-[30%] h-[300px] w-[300px] rounded-full bg-brand/[0.03] blur-[110px]" />
    </div>
  );
}
