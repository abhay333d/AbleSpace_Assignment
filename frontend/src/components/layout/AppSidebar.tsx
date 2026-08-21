"use client";

import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore, type ColorMode } from "@/store/useAppStore";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutGrid,
  FolderKanban,
  Settings,
  SunMoon,
  Palette,
  ChevronsUpDown,
  Check,
} from "lucide-react";

export function AppSidebar() {
  const { theme, setTheme } = useTheme();

  // ADDED: currentView and setCurrentView from the store!
  const { colorMode, setColorMode, currentView, setCurrentView } =
    useAppStore();

  const pathname = usePathname();
  const router = useRouter();

  // --- DYNAMIC USER STATE ---
  const [userName, setUserName] = useState("Guest");
  const [userInitials, setUserInitials] = useState("GU");
  const [userAvatar, setUserAvatar] = useState("https://github.com/shadcn.png");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("ableSpace_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) {
          setUserName(parsed.name);
          setUserInitials(parsed.name.substring(0, 2).toUpperCase());
        }
        if (parsed.avatar) {
          setUserAvatar(parsed.avatar);
        }
      }
    }
  }, []);
  // --------------------------

  const colors: { name: string; value: ColorMode; hex: string }[] = [
    { name: "Amber", value: "amber", hex: "bg-[#f59e0b]" },
    { name: "Blue", value: "blue", hex: "bg-[#3b82f6]" },
    { name: "Pink", value: "pink", hex: "bg-[#ec4899]" },
    { name: "Rose", value: "rose", hex: "bg-[#f43f5e]" },
    { name: "Emerald", value: "emerald", hex: "bg-[#10b981]" },
    { name: "Black", value: "black", hex: "bg-[#000000] dark:bg-white" },
  ];

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="w-full justify-between hover:bg-transparent"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-lg border border-border">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="rounded-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-foreground">
                    {userName}
                  </span>
                </div>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-gray-500" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* UPDATED: Tasks Button uses currentView state */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentView === "tasks"}
                  onClick={() => {
                    setCurrentView("tasks");
                    router.push("/dashboard");
                  }}
                  className={`gap-3 cursor-pointer ${currentView === "tasks" ? "" : "text-gray-500 hover:text-foreground"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span>Tasks</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* UPDATED: Projects Button uses currentView state */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentView === "projects"}
                  onClick={() => {
                    setCurrentView("projects");
                    router.push("/dashboard");
                  }}
                  className={`gap-3 cursor-pointer ${currentView === "projects" ? "" : "text-gray-500 hover:text-foreground"}`}
                >
                  <FolderKanban className="h-4 w-4" />
                  <span>Projects</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton className="gap-3 text-gray-500 hover:text-foreground cursor-pointer" />
                }
              >
                <SunMoon className="h-4 w-4" />
                <span>Change Theme</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="justify-between cursor-pointer"
                >
                  Light {theme === "light" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="justify-between cursor-pointer"
                >
                  Dark {theme === "dark" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton className="gap-3 text-gray-500 hover:text-foreground cursor-pointer" />
                }
              >
                <Palette className="h-4 w-4" />
                <span>Color Mode</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-40">
                {colors.map((c) => (
                  <DropdownMenuItem
                    key={c.value}
                    onClick={() => setColorMode(c.value)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-[4px] border border-black/10 dark:border-white/10 ${c.hex}`}
                      />
                      <span>{c.name}</span>
                    </div>
                    {colorMode === c.value && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push("/settings")}
              className="gap-3 text-gray-500 hover:text-foreground cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
