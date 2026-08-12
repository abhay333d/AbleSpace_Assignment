"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAppStore, type ColorMode } from "@/store/useAppStore";
import {
  ArrowLeft,
  Search,
  User,
  SunMoon,
  Palette,
  Pencil,
  Check,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SettingsPage() {
  const router = useRouter();
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
    <div className="flex flex-col md:flex-row h-screen w-full bg-white dark:bg-background overflow-hidden">
      {/* Mobile Top Nav (Hidden on Desktop) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-gray-50/30 dark:bg-sidebar shrink-0">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-foreground dark:text-gray-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to app
        </button>

        <div className="flex items-center gap-2">
          {/* Mobile Theme Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-white text-gray-500 hover:text-foreground dark:bg-transparent dark:hover:bg-gray-800">
              <SunMoon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
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

          {/* Mobile Color Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-white text-gray-500 hover:text-foreground dark:bg-transparent dark:hover:bg-gray-800">
              <Palette className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
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
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-[260px] shrink-0 border-r border-border bg-gray-50/30 dark:bg-sidebar p-4 flex-col justify-between">
        <div className="flex flex-col gap-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-foreground dark:text-gray-300 dark:hover:text-white transition-colors w-fit pt-2 px-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to app
          </button>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="h-9 w-full rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>

          <nav className="flex flex-col gap-1">
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors bg-gray-100 text-foreground dark:bg-gray-800">
              <User className="h-4 w-4" /> Profile
            </button>
          </nav>
        </div>

        {/* Desktop Sidebar Footer (Theme & Color Dropdowns) */}
        <div className="flex flex-col gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-foreground dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none">
              <SunMoon className="h-4 w-4" />
              <span>Change Theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="end"
              className="w-40 rounded-xl"
            >
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

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-foreground dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none">
              <Palette className="h-4 w-4" />
              <span>Color Mode</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="end"
              className="w-40 rounded-xl"
            >
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
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-background">
        <div className="mx-auto max-w-3xl w-full p-6 md:p-10 lg:py-16">
          <h1 className="text-2xl font-semibold text-foreground mb-8">
            Profile
          </h1>

          {/* Profile Card */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-background shadow-sm mb-10">
            <div className="flex flex-col">
              {/* Profile Picture */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-foreground">
                  Profile picture
                </span>
                <Avatar className="h-9 w-9 ring-1 ring-border">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>DX</AvatarFallback>
                </Avatar>
              </div>

              {/* Email */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 gap-3">
                <span className="text-sm font-medium text-foreground min-w-[120px]">
                  Email
                </span>
                <div className="w-full sm:w-2/3 max-w-[320px] flex items-center justify-between gap-3 text-sm font-medium text-foreground">
                  dexter@gmail.com
                  <Pencil className="h-3.5 w-3.5 text-gray-400 cursor-pointer hover:text-foreground shrink-0" />
                </div>
              </div>

              {/* Full Name */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 gap-3">
                <span className="text-sm font-medium text-foreground min-w-[120px]">
                  Full name
                </span>
                <input
                  type="text"
                  defaultValue="Dexter"
                  className="w-full sm:w-2/3 max-w-[320px] rounded-md border-none bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm font-medium text-foreground outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              {/* Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 gap-3">
                <div className="flex flex-col gap-1 min-w-[120px]">
                  <span className="text-sm font-medium text-foreground">
                    Title
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Your job title or role
                  </span>
                </div>
                <input
                  type="text"
                  defaultValue="Designer"
                  className="w-full sm:w-2/3 max-w-[320px] rounded-md border-none bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm font-medium text-foreground outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              {/* Username */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 gap-3">
                <div className="flex flex-col gap-1 min-w-[120px]">
                  <span className="text-sm font-medium text-foreground">
                    Username
                  </span>
                  <span className="text-[11px] text-gray-500">
                    One word, like a nickname or first name
                  </span>
                </div>
                <input
                  type="text"
                  defaultValue="Dexuser"
                  className="w-full sm:w-2/3 max-w-[320px] rounded-md border-none bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm font-medium text-foreground outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Workspace Access */}
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Workspace access
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-background shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Remove yourself from the workspace
            </span>
            <button className="rounded-md bg-red-50 dark:bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors shrink-0">
              Leave Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
