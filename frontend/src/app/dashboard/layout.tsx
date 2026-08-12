"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <AppSidebar />
        <main className="flex h-full flex-1 flex-col overflow-hidden">
          {/* Mobile Sidebar Trigger - Now completely hidden on desktop (lg:hidden) */}
          <header className="flex h-14 flex-shrink-0 items-center border-b border-border px-4 lg:hidden">
            <SidebarTrigger />
          </header>

          {/* Page Content Rendered Here - Swapped to flex-1 to fill the space perfectly */}
          <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
