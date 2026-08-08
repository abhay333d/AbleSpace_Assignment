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

  // Protect the route: redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null; // Prevent hydration flash

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <AppSidebar />
        <main className="flex flex-1 flex-col min-w-0">
          {/* Mobile Sidebar Trigger */}
          <header className="flex h-14 items-center border-b border-border px-4 lg:px-6">
            <SidebarTrigger className="mr-4 lg:hidden" />
          </header>

          {/* Main Content Rendered Here */}
          <div className="flex-1 overflow-hidden">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
