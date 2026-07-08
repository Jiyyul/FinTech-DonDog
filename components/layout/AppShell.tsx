"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { SearchProvider } from "@/components/layout/SearchProvider";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/";

  return (
    <SearchProvider>
      <div
        className={`min-h-screen overflow-x-hidden ${isDashboard ? "bg-dashbg" : "bg-appbg"}`}
      >
        <Sidebar />

        <div className="ui-shell-offset min-w-0">
          <Header />
          <main className="ui-shell-pad mx-auto w-full min-w-0 max-w-[1600px] pb-20 pt-4">
            {children}
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
