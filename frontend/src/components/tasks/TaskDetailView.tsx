"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Lock,
  Eye,
  Share2,
  MoreHorizontal,
  PanelRightClose,
  Plus,
  Settings,
  Paperclip,
  Send,
  Smile,
  Tag,
  Calendar,
  ChevronDown,
  Check,
  Users,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskDetailViewProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetailView({ task, onClose }: TaskDetailViewProps) {
  // Start CLOSED by default to ensure mobile is completely clean
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number>(10);

  // Auto-open the right panel ONLY on desktop devices on initial load
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setTimeout(() => setIsRightPanelOpen(true), 0);
    }
  }, []);

  const renderCalendarDays = () => {
    const days = [];
    days.push(
      <span
        key="prev-30"
        className="text-gray-300 flex items-center justify-center w-6 h-6 mx-auto"
      >
        30
      </span>,
    );

    for (let i = 1; i <= 31; i++) {
      const isSelected = selectedDate === i;
      days.push(
        <span
          key={`day-${i}`}
          onClick={() => setSelectedDate(i)}
          className={`rounded-full flex items-center justify-center w-6 h-6 mx-auto cursor-pointer transition-colors ${
            isSelected
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "hover:bg-gray-100 text-foreground dark:hover:bg-gray-800"
          }`}
        >
          {i}
        </span>,
      );
    }

    for (let i = 1; i <= 3; i++) {
      days.push(
        <span
          key={`next-${i}`}
          className="text-gray-300 flex items-center justify-center w-6 h-6 mx-auto"
        >
          {i}
        </span>,
      );
    }
    return days;
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-background overflow-hidden">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between border-b border-border px-5 py-2.5 shrink-0">
        <div
          className="flex items-center gap-2 text-gray-500 hover:text-foreground cursor-pointer transition-colors"
          onClick={onClose}
        >
          <PanelRightClose className="h-5 w-5 rotate-180" />
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
            <Lock className="h-4 w-4" />
          </button>
          <button className="hidden sm:flex h-8 items-center gap-1.5 rounded-md border border-gray-200 px-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-gray-800 dark:hover:bg-blue-900/20">
            <Eye className="h-4 w-4" />1
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
            <MoreHorizontal className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className={`flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors dark:border-gray-800 ${
              isRightPanelOpen
                ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                : "bg-white text-gray-500 hover:bg-gray-50 dark:bg-transparent dark:hover:bg-gray-800"
            }`}
          >
            <PanelRightClose
              className={`h-4 w-4 transition-transform ${isRightPanelOpen ? "" : "rotate-180"}`}
            />
          </button>
        </div>
      </div>

      {/* Two Column Layout - 'relative' for absolute positioning on mobile */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* LEFT COLUMN: Main Content */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6 lg:pb-2">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-bold text-foreground mb-1.5">
              {task.title}
            </h1>
            <p className="text-sm text-gray-500 mb-5">
              Create clear and detailed API documentation to guide developers in
              using the inventory and sales metrics features effectively.
            </p>

            {/* Metadata Rows */}
            <div className="flex flex-col gap-3 mb-5">
              <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] items-center gap-4 text-sm">
                <span className="font-medium text-foreground">Properties</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-foreground font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                    <span className="text-gray-400 text-xs">A</span> Designer
                  </div>
                  <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100 dark:bg-red-500/10 dark:border-red-900/30">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">31 Jul</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] items-center gap-4 text-sm">
                <span className="font-medium text-foreground">Labels</span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    "Research",
                    "Design",
                    "Development",
                    "Testing",
                    "Deployment",
                  ].map((label) => (
                    <span
                      key={label}
                      className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
                    >
                      <Tag className="h-3 w-3 -rotate-90 text-gray-400" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] items-center gap-4 text-sm">
                <span className="font-medium text-foreground">Resources</span>
                <span className="text-gray-400 text-xs cursor-pointer hover:text-foreground">
                  @ Add document or link...
                </span>
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="mb-5">
              <div className="flex items-center gap-2 font-medium text-foreground mb-3">
                <ChevronDown className="h-4 w-4" />
                Subtasks
              </div>
              <div className="rounded-lg border border-border overflow-x-auto">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead className="bg-white dark:bg-background border-b border-border">
                    <tr className="text-gray-500 font-medium">
                      <th className="px-4 py-2 font-medium">Task</th>
                      <th className="px-4 py-2 font-medium">Priority</th>
                      <th className="px-4 py-2 font-medium">Members</th>
                      <th className="px-4 py-2 font-medium">Due Date</th>
                      <th className="px-4 py-2 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <td className="px-4 py-2 font-medium">Subtask 1</td>
                      <td className="px-4 py-2 text-red-500 text-xs font-medium">
                        High
                      </td>
                      <td className="px-4 py-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="https://github.com/shadcn.png" />
                        </Avatar>
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">
                        12 Sep 2026
                      </td>
                      <td className="px-4 py-2 text-right text-gray-400">
                        <MoreHorizontal className="h-4 w-4 ml-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <td className="px-4 py-2 font-medium">Subtask 2</td>
                      <td className="px-4 py-2 text-gray-400 text-xs font-medium">
                        Low
                      </td>
                      <td className="px-4 py-2 text-xs font-medium text-gray-600">
                        CN
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">
                        15 Sep 2026
                      </td>
                      <td className="px-4 py-2 text-right text-gray-400">
                        <MoreHorizontal className="h-4 w-4 ml-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <td className="px-4 py-2 font-medium text-gray-500">
                        + Add Subtasks
                      </td>
                      <td colSpan={4}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comments / Activity Section */}
            <div>
              <div className="font-medium text-foreground mb-3">Subtasks</div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 rounded-lg border border-gray-100 p-3 shadow-sm dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="https://github.com/shadcn.png" />
                      </Avatar>
                      <span className="text-xs font-medium text-foreground">
                        Ankit Dutta
                      </span>
                      <span className="text-xs text-gray-400">just now</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Smile className="h-4 w-4 cursor-pointer hover:text-foreground" />
                      <MoreHorizontal className="h-4 w-4 cursor-pointer hover:text-foreground" />
                    </div>
                  </div>
                  <p className="text-sm text-foreground sm:ml-8 mt-1 sm:mt-0">
                    dsds
                  </p>

                  <div className="sm:ml-8 mt-1 flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-gray-800 dark:bg-gray-900">
                    <input
                      type="text"
                      placeholder="Leave a reply..."
                      className="bg-transparent text-xs outline-none w-full placeholder:text-gray-400"
                    />
                    <div className="flex items-center gap-2 text-gray-400">
                      <Paperclip className="h-3.5 w-3.5 cursor-pointer hover:text-foreground" />
                      <Send className="h-3.5 w-3.5 cursor-pointer hover:text-foreground" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800 mb-4">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
                  />
                  <div className="flex items-center gap-3 text-gray-400">
                    <Paperclip className="h-4 w-4 cursor-pointer hover:text-foreground" />
                    <Send className="h-4 w-4 cursor-pointer hover:text-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Updated to be absolute on mobile, relative on desktop */}
        {isRightPanelOpen && (
          <div className="absolute inset-0 z-20 w-full overflow-y-auto bg-white p-5 dark:bg-background lg:relative lg:w-[320px] lg:shrink-0 lg:border-l lg:border-border lg:bg-gray-50/30">
            {/* Details Card */}
            <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-background">
              <div className="flex items-center justify-between mb-4 text-foreground font-medium">
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4" />
                  Details
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Plus className="h-4 w-4 cursor-pointer hover:text-foreground" />
                  <Settings className="h-4 w-4 cursor-pointer hover:text-foreground" />
                </div>
              </div>

              <div className="flex flex-col gap-3 text-sm">
                <div className="grid grid-cols-[70px_1fr] items-center text-gray-500">
                  <span>Status</span>
                  <span className="flex items-center gap-1.5 text-amber-600 font-medium text-xs">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />{" "}
                    Backlog
                  </span>
                </div>

                <div className="grid grid-cols-[70px_1fr] items-center text-gray-500 relative">
                  <span>Priority</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-fit items-center gap-1.5 text-red-500 font-medium text-xs cursor-pointer outline-none hover:bg-red-50 px-1.5 py-0.5 rounded -ml-1.5 transition-colors dark:hover:bg-red-900/10">
                      <div className="flex flex-col gap-[2px]">
                        <div className="w-2.5 h-[2px] bg-red-500 rounded-full" />
                        <div className="w-1.5 h-[2px] bg-red-500 rounded-full" />
                        <div className="w-2 h-[2px] bg-red-500 rounded-full" />
                      </div>
                      High <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-48 p-2 rounded-xl shadow-lg border-gray-200"
                    >
                      <div className="px-2 pb-2 text-xs text-gray-400 font-medium">
                        Priority
                      </div>
                      <DropdownMenuItem className="text-xs text-gray-600 cursor-pointer">
                        No Priority
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs text-red-500 font-medium cursor-pointer flex justify-between items-center bg-red-50 dark:bg-red-900/10">
                        Urgent <Check className="h-3 w-3" />
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs text-orange-500 cursor-pointer">
                        High
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs text-amber-500 cursor-pointer">
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs text-gray-400 cursor-pointer">
                        Low
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-[70px_1fr] items-center text-gray-500">
                  <span>Members</span>
                  <div className="flex w-fit items-center gap-1.5 text-xs font-medium text-foreground cursor-pointer hover:text-gray-600 transition-colors">
                    <Users className="h-3.5 w-3.5" />
                    Add members
                  </div>
                </div>

                <div className="grid grid-cols-[70px_1fr] items-center text-gray-500">
                  <span>Dates</span>
                  <div className="flex items-center gap-1.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex w-fit whitespace-nowrap items-center gap-1.5 rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-foreground cursor-pointer hover:bg-gray-50 outline-none dark:border-gray-700 dark:hover:bg-gray-800">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />{" "}
                        Jan {selectedDate}
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="start"
                        className="w-[260px] p-3 rounded-xl shadow-lg border-gray-200 dark:border-gray-800"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <ChevronLeft className="h-4 w-4 text-gray-500 cursor-pointer hover:text-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            January 2026
                          </span>
                          <ArrowRight className="h-4 w-4 text-gray-500 cursor-pointer hover:text-foreground" />
                        </div>

                        <div className="grid grid-cols-7 text-center text-[11px] font-medium text-gray-400 mb-2">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>

                        <div className="grid grid-cols-7 text-center text-xs text-foreground gap-y-2">
                          {renderCalendarDays()}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <ArrowRight className="h-3 w-3 shrink-0 text-gray-400" />

                    <div className="flex w-fit whitespace-nowrap items-center gap-1.5 rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-400 cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                      <Calendar className="h-3.5 w-3.5 shrink-0" /> End
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[70px_1fr] items-center text-gray-500">
                  <span>Labels</span>
                  <span>--</span>
                </div>
                <div className="grid grid-cols-[70px_1fr] items-center text-gray-500">
                  <span>Teams</span>
                  <span>--</span>
                </div>
                <div className="grid grid-cols-[70px_1fr] items-center text-gray-500">
                  <span>Reporter</span>
                  <span>--</span>
                </div>
              </div>
            </div>

            {/* Updates Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-background">
              <div className="flex items-center gap-2 mb-4 text-foreground font-medium">
                <ChevronDown className="h-4 w-4" />
                Updates
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-red-100 text-red-500 text-[10px]">
                      You
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-foreground">
                      You
                    </span>
                    <span className="text-[11px] text-gray-500">
                      changed priority from No priority to Ur...
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="https://github.com/shadcn.png" />
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-foreground">
                      You
                    </span>
                    <span className="text-[11px] text-gray-500">
                      posted an update · Aug 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
