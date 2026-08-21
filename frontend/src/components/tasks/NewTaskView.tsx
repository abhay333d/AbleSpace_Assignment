"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  Eye,
  Share2,
  MoreHorizontal,
  PanelRightClose,
  Tag,
  Plus,
  Trash2,
  Calendar,
  ChevronDown,
  CheckCircle2,
  Circle,
  Check, // <-- Added Check icon
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";

// <-- ADDED: Dropdown imports for the right panel
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NewTaskView() {
  const router = useRouter();

  // Sidebar State
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Auto-open the right panel ONLY on desktop devices on initial load
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setTimeout(() => setIsRightPanelOpen(true), 0);
    }
  }, []);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // FIXED: Added updater functions for the right panel dropdowns
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Medium");
  const [project, setProject] = useState("TODO TASK MANAGEMENT");

  // Dynamic current date
  const [dueDate, setDueDate] = useState(() => {
    return new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  });

  // Array States
  const [labels, setLabels] = useState<string[]>(["t1", "t2"]);
  const [newLabel, setNewLabel] = useState("");

  const [resources, setResources] = useState<{ name: string; link: string }[]>([
    { name: "google link", link: "https://google.com" },
  ]);
  const [newResourceName, setNewResourceName] = useState("");
  const [newResourceLink, setNewResourceLink] = useState("");

  const [subtasks, setSubtasks] = useState<
    { title: string; isCompleted: boolean }[]
  >([
    { title: "sub1", isCompleted: false },
    { title: "sub 2", isCompleted: false },
  ]);
  const [newSubtask, setNewSubtask] = useState("");

  // Set a generic default first to prevent hydration errors
  const [reporter, setReporter] = useState("Guest User");

  // Load User Data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("ableSpace_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.name) {
          setReporter(parsedUser.name);
        }
      }
    }
  }, []);

  // Read the URL parameter to set the default Status
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const statusFromUrl = urlParams.get("status");

      if (statusFromUrl) {
        setStatus(statusFromUrl);
      }
    }
  }, []);

  const handleCreateTask = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
        {
          title,
          description,
          status,
          priority,
          project,
          labels,
          resources,
          subtasks,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          reporter: reporter,
        },
      );

      if (response.status === 201 || response.status === 200) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-background overflow-hidden">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5 sm:px-5 shrink-0">
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <span className="hidden sm:inline">Tasks</span>
          <span className="hidden sm:inline">&gt;</span>
          <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-none">
            New Task
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
            <Lock className="h-4 w-4" />
          </button>
          <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
            <Eye className="h-4 w-4" />
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

      <div className="relative flex flex-1 overflow-hidden">
        {/* Left Column: Form */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <button
            onClick={() => router.back()}
            className="flex w-fit items-center gap-2 text-sm text-gray-500 hover:text-foreground mb-6 sm:mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Tasks
          </button>

          <div className="max-w-3xl">
            <input
              type="text"
              placeholder="Task Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl sm:text-4xl font-bold text-foreground mb-4 bg-transparent outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700"
            />
            <textarea
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm text-gray-600 dark:text-gray-300 mb-8 bg-transparent outline-none resize-none min-h-[60px]"
            />

            {/* Properties */}
            <div className="flex flex-col sm:grid sm:grid-cols-[100px_1fr] sm:items-center gap-2 sm:gap-4 text-sm mb-6">
              <span className="text-gray-500">Properties</span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 border border-border rounded px-2 py-1">
                  <Avatar className="h-4 w-4">
                    <AvatarFallback className="text-[8px] bg-black text-white">
                      {reporter.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">{reporter}</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/30 rounded px-2 py-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{dueDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-pink-500 bg-pink-50 dark:bg-pink-500/10 border border-pink-100 dark:border-pink-900/30 rounded px-2 py-1">
                  <span className="text-xs font-medium">{project}</span>
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="flex flex-col sm:grid sm:grid-cols-[100px_1fr] sm:items-center gap-2 sm:gap-4 text-sm mb-6">
              <span className="text-gray-500">Labels</span>
              <div className="flex flex-wrap items-center gap-2">
                {labels.map((label, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <Tag className="h-3 w-3 -rotate-90 text-gray-400" /> {label}
                    <button
                      onClick={() =>
                        setLabels(labels.filter((_, i) => i !== idx))
                      }
                      className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <div className="flex items-center border border-dashed border-gray-300 dark:border-gray-700 rounded px-2 py-1">
                  <input
                    type="text"
                    placeholder="Add label..."
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newLabel) {
                        setLabels([...labels, newLabel]);
                        setNewLabel("");
                      }
                    }}
                    className="bg-transparent text-xs outline-none w-24 sm:w-20"
                  />
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="flex flex-col sm:grid sm:grid-cols-[100px_1fr] sm:items-start gap-2 sm:gap-4 text-sm mb-8">
              <span className="text-gray-500 mt-2">Resources</span>
              <div className="flex flex-col gap-2 w-full">
                {resources.map((res, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-md border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-2 text-sm"
                  >
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 truncate">
                      📄{" "}
                      <a
                        href={res.link}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline truncate"
                      >
                        {res.name}
                      </a>
                    </div>
                    <button
                      onClick={() =>
                        setResources(resources.filter((_, i) => i !== idx))
                      }
                    >
                      <Trash2 className="h-4 w-4 shrink-0 text-gray-400 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                ))}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newResourceName}
                    onChange={(e) => setNewResourceName(e.target.value)}
                    className="w-full sm:w-1/3 rounded-md border border-border px-3 py-1.5 text-sm outline-none focus:border-primary bg-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Paste a link..."
                    value={newResourceLink}
                    onChange={(e) => setNewResourceLink(e.target.value)}
                    className="w-full sm:flex-1 rounded-md border border-border px-3 py-1.5 text-sm outline-none focus:border-primary bg-transparent"
                  />
                  <button
                    onClick={() => {
                      if (newResourceName && newResourceLink) {
                        setResources([
                          ...resources,
                          { name: newResourceName, link: newResourceLink },
                        ]);
                        setNewResourceName("");
                        setNewResourceLink("");
                      }
                    }}
                    className="flex w-full sm:w-auto items-center justify-center gap-1 rounded-md bg-black px-4 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Subtasks */}
            <div className="mb-10 border-t border-border pt-6">
              <div className="flex items-center gap-2 text-foreground font-medium mb-4">
                <ChevronDown className="h-4 w-4" /> Subtasks{" "}
                <span className="text-gray-400 text-xs font-normal">
                  0/{subtasks.length} done
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {subtasks.map((sub, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between group rounded-md border border-transparent hover:border-gray-100 dark:hover:border-gray-800 p-2 transition-colors"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() =>
                        setSubtasks(
                          subtasks.map((s, i) =>
                            i === idx
                              ? { ...s, isCompleted: !s.isCompleted }
                              : s,
                          ),
                        )
                      }
                    >
                      {sub.isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-300 shrink-0" />
                      )}
                      <span
                        className={`text-sm break-all ${sub.isCompleted ? "text-gray-400 line-through" : "text-foreground"}`}
                      >
                        {sub.title}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setSubtasks(subtasks.filter((_, i) => i !== idx))
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Add a subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newSubtask) {
                        setSubtasks([
                          ...subtasks,
                          { title: newSubtask, isCompleted: false },
                        ]);
                        setNewSubtask("");
                      }
                    }}
                    className="w-full rounded-md border border-dashed border-gray-300 dark:border-gray-700 px-3 py-2 text-sm outline-none focus:border-primary bg-transparent transition-colors"
                  />
                  <button
                    onClick={() => {
                      if (newSubtask) {
                        setSubtasks([
                          ...subtasks,
                          { title: newSubtask, isCompleted: false },
                        ]);
                        setNewSubtask("");
                      }
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details Panel */}
        {isRightPanelOpen && (
          <div className="absolute inset-0 z-20 w-full overflow-y-auto bg-white p-5 dark:bg-background lg:relative lg:w-[320px] lg:shrink-0 lg:border-l lg:border-border lg:bg-gray-50/30">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-background mb-4">
              <div className="flex items-center justify-between mb-6 text-foreground font-medium">
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4" /> Details
                </div>
              </div>

              <div className="flex flex-col gap-4 text-sm">
                {/* STATUS DROPDOWN */}
                <div className="grid grid-cols-[80px_1fr] items-center text-gray-500">
                  <span>Status</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`flex w-fit items-center gap-1.5 font-medium text-xs cursor-pointer outline-none px-1.5 py-0.5 rounded -ml-1.5 transition-colors ${
                        status === "Completed"
                          ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10"
                          : status === "Doing"
                            ? "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                            : "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          status === "Completed"
                            ? "bg-green-500"
                            : status === "Doing"
                              ? "bg-blue-500"
                              : "bg-amber-500"
                        }`}
                      />{" "}
                      {status} <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-48 p-2 rounded-xl shadow-lg border-gray-200 dark:border-gray-800"
                    >
                      <div className="px-2 pb-2 text-xs text-gray-400 font-medium">
                        Status
                      </div>
                      <DropdownMenuItem
                        onClick={() => setStatus("To Do")}
                        className="text-xs cursor-pointer flex justify-between items-center"
                      >
                        To Do{" "}
                        {status === "To Do" && <Check className="h-3 w-3" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatus("Doing")}
                        className="text-xs text-blue-600 cursor-pointer flex justify-between items-center"
                      >
                        Doing{" "}
                        {status === "Doing" && <Check className="h-3 w-3" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatus("Completed")}
                        className="text-xs text-green-600 cursor-pointer flex justify-between items-center"
                      >
                        Completed{" "}
                        {status === "Completed" && (
                          <Check className="h-3 w-3" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatus("On Hold")}
                        className="text-xs text-amber-600 cursor-pointer flex justify-between items-center"
                      >
                        On Hold{" "}
                        {status === "On Hold" && <Check className="h-3 w-3" />}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* PROJECT DROPDOWN */}
                <div className="grid grid-cols-[80px_1fr] items-center text-gray-500">
                  <span>Project</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-fit items-center gap-1.5 text-pink-600 font-medium text-xs cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-colors px-1.5 py-0.5 rounded -ml-1.5 outline-none">
                      <span className="h-2 w-2 rounded-full bg-pink-500" />{" "}
                      {project} <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-56 p-2 rounded-xl shadow-lg border-gray-200 dark:border-gray-800"
                    >
                      <div className="px-2 pb-2 text-xs text-gray-400 font-medium">
                        Project
                      </div>
                      <DropdownMenuItem
                        onClick={() => setProject("TODO TASK MANAGEMENT")}
                        className="text-xs cursor-pointer flex justify-between items-center"
                      >
                        TODO TASK MANAGEMENT{" "}
                        {project === "TODO TASK MANAGEMENT" && (
                          <Check className="h-3 w-3" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setProject("MARKETING CAMPAIGN")}
                        className="text-xs cursor-pointer flex justify-between items-center"
                      >
                        MARKETING CAMPAIGN{" "}
                        {project === "MARKETING CAMPAIGN" && (
                          <Check className="h-3 w-3" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setProject("WEBSITE REDESIGN")}
                        className="text-xs cursor-pointer flex justify-between items-center"
                      >
                        WEBSITE REDESIGN{" "}
                        {project === "WEBSITE REDESIGN" && (
                          <Check className="h-3 w-3" />
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* PRIORITY DROPDOWN */}
                <div className="grid grid-cols-[80px_1fr] items-center text-gray-500">
                  <span>Priority</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`flex w-fit items-center gap-1.5 font-medium text-xs cursor-pointer outline-none px-1.5 py-0.5 rounded -ml-1.5 transition-colors ${
                        priority === "Urgent" || priority === "High"
                          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                          : priority === "Medium"
                            ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                            : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {priority} <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-48 p-2 rounded-xl shadow-lg border-gray-200 dark:border-gray-800"
                    >
                      <div className="px-2 pb-2 text-xs text-gray-400 font-medium">
                        Priority
                      </div>
                      <DropdownMenuItem
                        onClick={() => setPriority("None")}
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        No Priority
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPriority("Urgent")}
                        className="text-xs text-red-500 font-medium cursor-pointer flex justify-between items-center bg-red-50 dark:bg-red-900/10"
                      >
                        Urgent{" "}
                        {priority === "Urgent" && <Check className="h-3 w-3" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPriority("High")}
                        className="text-xs text-orange-500 cursor-pointer flex justify-between items-center"
                      >
                        High{" "}
                        {priority === "High" && <Check className="h-3 w-3" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPriority("Medium")}
                        className="text-xs text-amber-500 cursor-pointer flex justify-between items-center"
                      >
                        Medium{" "}
                        {priority === "Medium" && <Check className="h-3 w-3" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPriority("Low")}
                        className="text-xs text-gray-400 cursor-pointer flex justify-between items-center"
                      >
                        Low{" "}
                        {priority === "Low" && <Check className="h-3 w-3" />}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-[80px_1fr] items-center text-gray-500">
                  <span>Members</span>
                  <div className="flex items-center gap-1.5 text-foreground font-medium text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-fit p-1 rounded -ml-1">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[9px] bg-black text-white">
                        {reporter.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>{" "}
                    {reporter}
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] items-center text-gray-500">
                  <span>Dates</span>
                  <span className="flex items-center gap-1.5 border border-border rounded px-2 py-1 text-xs cursor-pointer w-fit text-foreground transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Calendar className="h-3 w-3 text-gray-400" /> {dueDate}
                  </span>
                </div>
                <div className="grid grid-cols-[80px_1fr] items-center text-gray-500">
                  <span>Reporter</span>
                  <span className="text-foreground text-xs font-medium">
                    {reporter}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateTask}
              disabled={!title}
              className="mt-4 w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
            >
              Create Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
