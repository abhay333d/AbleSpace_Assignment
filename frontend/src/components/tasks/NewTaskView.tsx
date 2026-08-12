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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NewTaskView() {
  const router = useRouter();

  // Sidebar State
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Auto-open the right panel ONLY on desktop devices on initial load
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsRightPanelOpen(true);
    }
  }, []);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Medium");
  const [project, setProject] = useState("TODO TASK MANAGEMENT");
  const [dueDate, setDueDate] = useState("13 Aug 2026");

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

  const handleCreateTask = async () => {
    try {
      const response = await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
          project,
          labels,
          resources,
          subtasks,
          dueDate: new Date(dueDate),
          reporter: "Dexter",
        }),
      });

      if (response.ok) {
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

      {/* Relative wrapper for absolute mobile sidebar */}
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
                      A
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">Admin</span>
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

        {/* Right Column: Details Panel (Absolute on Mobile, Relative on Desktop) */}
        {isRightPanelOpen && (
          <div className="absolute inset-0 z-20 w-full overflow-y-auto bg-white p-5 dark:bg-background lg:relative lg:w-[320px] lg:shrink-0 lg:border-l lg:border-border lg:bg-gray-50/30">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-background mb-4">
              <div className="flex items-center justify-between mb-6 text-foreground font-medium">
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4" /> Details
                </div>
              </div>

              <div className="flex flex-col gap-4 text-sm">
                <div className="grid grid-cols-[80px_1fr] items-center text-gray-500">
                  <span>Status</span>
                  <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-fit p-1 rounded -ml-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />{" "}
                    {status}
                  </span>
                </div>
                <div className="grid grid-cols-[80px_1fr] items-center text-gray-500">
                  <span>Project</span>
                  <span className="flex items-center gap-1.5 text-pink-600 font-medium text-xs cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-colors w-fit p-1 rounded -ml-1">
                    <span className="h-2 w-2 rounded-full bg-pink-500" />{" "}
                    {project}
                  </span>
                </div>
                <div className="grid grid-cols-[80px_1fr] items-center text-gray-500">
                  <span>Priority</span>
                  <span className="flex items-center gap-1.5 text-amber-500 font-medium text-xs cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors w-fit p-1 rounded -ml-1">
                    <span className="h-3 w-3" /> {priority}
                  </span>
                </div>
                <div className="grid grid-cols-[80px_1fr] items-center text-gray-500">
                  <span>Members</span>
                  <div className="flex items-center gap-1.5 text-foreground font-medium text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-fit p-1 rounded -ml-1">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[9px] bg-black text-white">
                        A
                      </AvatarFallback>
                    </Avatar>{" "}
                    Admin
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
                    Uzair Qureshi
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
