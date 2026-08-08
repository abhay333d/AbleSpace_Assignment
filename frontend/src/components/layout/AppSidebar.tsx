"use client";

import { useTheme } from "next-themes";
import { useAppStore } from "@/store/useAppStore";
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

type ColorMode = "amber" | "blue" | "pink" | "rose" | "emerald" | "black";

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { colorMode, setColorMode } = useAppStore();

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
      {/* Top: User Profile Profile */}
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="w-full justify-between hover:bg-transparent"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Dexter"
                  />
                  <AvatarFallback className="rounded-lg">DX</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-foreground">Dexter</span>
                </div>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-gray-500" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Middle: Workspace Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive className="gap-3 cursor-pointer">
                  <LayoutGrid className="h-4 w-4" />
                  <span>Tasks</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="gap-3 text-gray-500 hover:text-foreground cursor-pointer">
                  <FolderKanban className="h-4 w-4" />
                  <span>Projects</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom: Settings & Themes */}
      <SidebarFooter className="p-4">
        <SidebarMenu>
          {/* Change Theme Dropdown */}
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
                  className="justify-between"
                >
                  Light {theme === "light" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="justify-between"
                >
                  Dark {theme === "dark" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          {/* Color Mode Dropdown */}
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
                    className="flex items-center justify-between"
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
            <SidebarMenuButton className="gap-3 text-gray-500 hover:text-foreground cursor-pointer">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
