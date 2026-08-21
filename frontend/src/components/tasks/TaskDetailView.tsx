"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
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
  ChevronLeft,
  ChevronRight, // Swapped ArrowRight for ChevronRight for the calendar
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
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // 1. Local state for optimistic updates
  const [localTask, setLocalTask] = useState<Task>(task);

  // 2. Calendar States
  // viewDate controls what month/year the user is currently looking at in the dropdown
  const [viewDate, setViewDate] = useState(() => {
    return task.dueDate ? new Date(task.dueDate) : new Date();
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setTimeout(() => setIsRightPanelOpen(true), 0);
    }
  }, []);

  // --- API FUNCTIONS ---

  const handleDeleteTask = async () => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${localTask.id}`);
      onClose(); // Automatically goes back to dashboard, which will re-fetch data!
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleUpdateTaskField = async (field: string, value: string) => {
    try {
      // Instantly update the UI without reloading the page
      setLocalTask((prev) => ({ ...prev, [field]: value }));

      // Silently update the database in the background
      await axios.patch(`http://localhost:3001/tasks/${localTask.id}`, {
        [field]: value,
      });
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  };

  // --- CALENDAR LOGIC ---

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    handleUpdateTaskField("dueDate", newDate.toISOString());
  };

  const renderCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    // Calculate calendar structure
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
    const currentDueDate = localTask.dueDate
      ? new Date(localTask.dueDate)
      : null;

    const days = [];

    // Render empty slots to align the first day correctly
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<span key={`empty-${i}`} className="w-6 h-6 mx-auto"></span>);
    }

    // Render the actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected =
        currentDueDate &&
        currentDueDate.getDate() === i &&
        currentDueDate.getMonth() === month &&
        currentDueDate.getFullYear() === year;

      days.push(
        <span
          key={`day-${i}`}
          onClick={() => handleDateSelect(i)}
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

          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 outline-none transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 rounded-xl shadow-lg border-gray-200 dark:border-gray-800"
            >
              <DropdownMenuItem
                onClick={handleDeleteTask}
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer font-medium"
              >
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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

      {/* Two Column Layout */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* LEFT COLUMN: Main Content */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6 lg:pb-2">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-bold text-foreground mb-1.5">
              {localTask.title}
            </h1>
            <p className="text-sm text-gray-500 mb-5">
              {localTask.description || "No description provided."}
            </p>

            {/* Metadata Rows */}
            <div className="flex flex-col gap-3 mb-5">
              <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] items-center gap-4 text-sm">
                <span className="font-medium text-foreground">Properties</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-foreground font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                    <span className="text-gray-400 text-xs">
                      {localTask.reporter?.charAt(0) || "U"}
                    </span>{" "}
                    {localTask.reporter || "Guest User"}
                  </div>
                  {localTask.dueDate && (
                    <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100 dark:bg-red-500/10 dark:border-red-900/30">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">
                        {new Date(localTask.dueDate).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "short" },
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {localTask.labels && localTask.labels.length > 0 && (
                <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] items-center gap-4 text-sm">
                  <span className="font-medium text-foreground">Labels</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {localTask.labels.map((label) => (
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
              )}

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
              <div className="font-medium text-foreground mb-3">Activity</div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 rounded-lg border border-gray-100 p-3 shadow-sm dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="https://github.com/shadcn.png" />
                      </Avatar>
                      <span className="text-xs font-medium text-foreground">
                        {localTask.reporter || "Guest User"}
                      </span>
                      <span className="text-xs text-gray-400">just now</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Smile className="h-4 w-4 cursor-pointer hover:text-foreground" />
                      <MoreHorizontal className="h-4 w-4 cursor-pointer hover:text-foreground" />
                    </div>
                  </div>
                  <p className="text-sm text-foreground sm:ml-8 mt-1 sm:mt-0">
                    Task created.
                  </p>
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

        {/* RIGHT COLUMN: Fully Dynamic Details Panel */}
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
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`flex w-fit items-center gap-1.5 font-medium text-xs cursor-pointer outline-none px-1.5 py-0.5 rounded -ml-1.5 transition-colors ${
                        localTask.status === "Completed"
                          ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10"
                          : localTask.status === "Doing"
                            ? "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                            : "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          localTask.status === "Completed"
                            ? "bg-green-500"
                            : localTask.status === "Doing"
                              ? "bg-blue-500"
                              : "bg-amber-500"
                        }`}
                      />{" "}
                      {localTask.status || "To Do"}{" "}
                      <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-48 p-2 rounded-xl shadow-lg border-gray-200"
                    >
                      <div className="px-2 pb-2 text-xs text-gray-400 font-medium">
                        Status
                      </div>
                      <DropdownMenuItem
                        onClick={() => handleUpdateTaskField("status", "To Do")}
                        className="text-xs cursor-pointer"
                      >
                        To Do
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUpdateTaskField("status", "Doing")}
                        className="text-xs text-blue-600 cursor-pointer"
                      >
                        Doing
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleUpdateTaskField("status", "Completed")
                        }
                        className="text-xs text-green-600 cursor-pointer"
                      >
                        Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleUpdateTaskField("status", "On Hold")
                        }
                        className="text-xs text-amber-600 cursor-pointer"
                      >
                        On Hold
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-[70px_1fr] items-center text-gray-500 relative">
                  <span>Priority</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`flex w-fit items-center gap-1.5 font-medium text-xs cursor-pointer outline-none px-1.5 py-0.5 rounded -ml-1.5 transition-colors ${
                        localTask.priority === "Urgent" ||
                        localTask.priority === "High"
                          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                          : localTask.priority === "Medium"
                            ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                            : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {localTask.priority || "None"}{" "}
                      <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-48 p-2 rounded-xl shadow-lg border-gray-200"
                    >
                      <div className="px-2 pb-2 text-xs text-gray-400 font-medium">
                        Priority
                      </div>
                      <DropdownMenuItem
                        onClick={() =>
                          handleUpdateTaskField("priority", "None")
                        }
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        No Priority
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleUpdateTaskField("priority", "Urgent")
                        }
                        className="text-xs text-red-500 font-medium cursor-pointer flex justify-between items-center bg-red-50 dark:bg-red-900/10"
                      >
                        Urgent{" "}
                        {localTask.priority === "Urgent" && (
                          <Check className="h-3 w-3" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleUpdateTaskField("priority", "High")
                        }
                        className="text-xs text-orange-500 cursor-pointer flex justify-between items-center"
                      >
                        High{" "}
                        {localTask.priority === "High" && (
                          <Check className="h-3 w-3" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleUpdateTaskField("priority", "Medium")
                        }
                        className="text-xs text-amber-500 cursor-pointer flex justify-between items-center"
                      >
                        Medium{" "}
                        {localTask.priority === "Medium" && (
                          <Check className="h-3 w-3" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUpdateTaskField("priority", "Low")}
                        className="text-xs text-gray-400 cursor-pointer flex justify-between items-center"
                      >
                        Low{" "}
                        {localTask.priority === "Low" && (
                          <Check className="h-3 w-3" />
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-[70px_1fr] items-center text-gray-500">
                  <span>Members</span>
                  <div className="flex w-fit items-center gap-1.5 text-xs font-medium text-foreground cursor-pointer hover:text-gray-600 transition-colors">
                    {localTask.assignee ? (
                      <>
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={
                              localTask.assignee.avatar ||
                              "https://github.com/shadcn.png"
                            }
                          />
                          <AvatarFallback className="text-[9px] bg-gray-100 text-gray-600">
                            {localTask.assignee.initials || "U"}
                          </AvatarFallback>
                        </Avatar>
                        {localTask.assignee.name}
                      </>
                    ) : (
                      <>
                        <Users className="h-3.5 w-3.5" /> Add members
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[70px_1fr] items-center text-gray-500">
                  <span>Dates</span>
                  <div className="flex items-center gap-1.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex w-fit whitespace-nowrap items-center gap-1.5 rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-foreground cursor-pointer hover:bg-gray-50 outline-none dark:border-gray-700 dark:hover:bg-gray-800">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />{" "}
                        {localTask.dueDate
                          ? new Date(localTask.dueDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )
                          : "Set Date"}
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="start"
                        className="w-[260px] p-3 rounded-xl shadow-lg border-gray-200 dark:border-gray-800"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <ChevronLeft
                            onClick={handlePrevMonth}
                            className="h-4 w-4 text-gray-500 cursor-pointer hover:text-foreground"
                          />
                          <span className="text-sm font-medium text-foreground">
                            {viewDate.toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <ChevronRight
                            onClick={handleNextMonth}
                            className="h-4 w-4 text-gray-500 cursor-pointer hover:text-foreground"
                          />
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
                  </div>
                </div>

                <div className="grid grid-cols-[70px_1fr] items-center text-gray-500">
                  <span>Labels</span>
                  <span className="text-foreground text-xs font-medium truncate">
                    {localTask.labels && localTask.labels.length > 0
                      ? localTask.labels.join(", ")
                      : "--"}
                  </span>
                </div>
                <div className="grid grid-cols-[70px_1fr] items-center text-gray-500">
                  <span>Teams</span>
                  <span className="text-foreground text-xs font-medium truncate">
                    {localTask.project || "--"}
                  </span>
                </div>
                <div className="grid grid-cols-[70px_1fr] items-center text-gray-500">
                  <span>Reporter</span>
                  <span className="text-foreground text-xs font-medium truncate">
                    {localTask.reporter || "Admin"}
                  </span>
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
                      changed priority to {localTask.priority || "Urgent"}
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
