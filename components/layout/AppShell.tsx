import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-appbg">
      <Sidebar />

      <div className="ui-shell-offset min-w-0">
        <Header />
        <main className="ui-shell-pad mx-auto w-full min-w-0 max-w-[1600px] pb-20 pt-4">
          {children}
        </main>
      </div>
    </div>
  );
}
