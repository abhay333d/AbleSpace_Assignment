"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Columns3,
  Filter,
  Plus,
  Check,
  AlignJustify,
  LayoutGrid,
  Circle,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Users,
  Calendar,
  Tag,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { ListView } from "@/components/tasks/ListView";
import { TaskDetailView } from "@/components/tasks/TaskDetailView";
import { ProjectListView } from "@/components/projects/ProjectListView";
import { Task } from "@/types/task";

type ViewMode = "board" | "list";

// Extracted Content Component to handle URL Params inside Suspense
function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "tasks";

  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterPriority, setFilterPriority] = useState("All");

  // We maintain separate states so toggling fields in one tab doesn't break the other
  const [taskFields, setTaskFields] = useState({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
    reporter: true,
  });

  const [projectFields, setProjectFields] = useState({
    priority: true,
    lead: true,
    dueDate: true,
  });

  // Dynamically select which field list is currently active
  const activeFields = tab === "projects" ? projectFields : taskFields;

  const toggleField = (field: string) => {
    if (tab === "projects") {
      setProjectFields((prev) => ({
        ...prev,
        [field as keyof typeof projectFields]:
          !prev[field as keyof typeof projectFields],
      }));
    } else {
      setTaskFields((prev) => ({
        ...prev,
        [field as keyof typeof taskFields]:
          !prev[field as keyof typeof taskFields],
      }));
    }
  };

  if (selectedTask && tab === "tasks") {
    return (
      <TaskDetailView
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Dynamic Top Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:px-6 shrink-0">
        <h1 className="text-lg font-semibold text-foreground capitalize">
          {tab}
        </h1>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden items-center sm:flex">
            <Search className="absolute left-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-48 rounded-md border border-border bg-transparent pl-9 pr-4 text-sm text-foreground placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary md:w-64"
            />
            <div className="absolute right-2.5 flex items-center justify-center rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800">
              ⌘F
            </div>
          </div>

          {/* Fields Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-medium text-foreground transition-colors hover:bg-gray-50 focus:outline-none dark:bg-transparent dark:hover:bg-gray-800">
              <Columns3 className="h-4 w-4 text-gray-500" />
              <span className="hidden sm:inline-block">Fields</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 p-2 rounded-xl shadow-lg border-gray-200 dark:border-gray-800"
            >
              {tab === "tasks" && (
                <div className="mb-2 flex rounded-md bg-gray-100/80 p-1 dark:bg-gray-800/80">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded py-1.5 text-xs font-medium transition-all ${viewMode === "list" ? "bg-white shadow-sm text-foreground dark:bg-gray-700" : "text-gray-500 hover:text-foreground"}`}
                  >
                    <AlignJustify className="h-3.5 w-3.5" />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode("board")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded py-1.5 text-xs font-medium transition-all ${viewMode === "board" ? "bg-white shadow-sm text-foreground dark:bg-gray-700" : "text-gray-500 hover:text-foreground"}`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    Board
                  </button>
                </div>
              )}

              {Object.entries(activeFields).map(([field, isVisible]) => (
                <div
                  key={field}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleField(field);
                  }}
                  className="flex items-center justify-between text-[13px] font-medium text-gray-700 cursor-pointer px-2 py-2 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-sm transition-colors"
                >
                  <span className="capitalize">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </span>

                  <div
                    className={`h-[18px] w-[18px] rounded-[5px] flex items-center justify-center transition-colors ${
                      isVisible
                        ? "bg-[#111111] text-white dark:bg-white dark:text-black"
                        : "bg-gray-200/60 dark:bg-gray-800"
                    }`}
                  >
                    {isVisible && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border transition-colors focus:outline-none ${filterPriority !== "All" ? "border-primary bg-primary/10 text-primary dark:bg-primary/20" : "border-border bg-white text-gray-500 hover:bg-gray-50 hover:text-foreground dark:bg-transparent dark:hover:bg-gray-800"}`}
            >
              <Filter className="h-4 w-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 p-2 rounded-xl shadow-lg border-gray-200 dark:border-gray-800"
            >
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-2 rounded-md px-2 py-2 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer data-[state=open]:bg-gray-50 dark:data-[state=open]:bg-gray-800">
                  <Circle className="h-4 w-4 text-gray-500" /> Status
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-40 rounded-xl shadow-lg ml-1 p-2 border-gray-200 dark:border-gray-800">
                    <DropdownMenuItem className="text-[13px] cursor-pointer">
                      To Do
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px] cursor-pointer">
                      Doing
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px] cursor-pointer">
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-2 rounded-md px-2 py-2 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer data-[state=open]:bg-gray-50 dark:data-[state=open]:bg-gray-800">
                  <SignalHigh className="h-4 w-4 text-gray-500" /> Priority
                </DropdownMenuSubTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-48 rounded-xl shadow-lg ml-1 p-2 border-gray-200 dark:border-gray-800">
                    <div className="px-2 pb-2 pt-1 text-xs font-medium text-gray-400">
                      Priority
                    </div>

                    <DropdownMenuItem
                      onClick={() => setFilterPriority("All")}
                      className="flex items-center justify-between px-2 py-2 text-[13px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-foreground font-medium"
                    >
                      <div className="flex items-center gap-2">
                        All Priorities
                      </div>
                      {filterPriority === "All" && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setFilterPriority("None")}
                      className="flex items-center justify-between px-2 py-2 text-[13px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300"
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <span className="text-gray-400 font-bold mb-1.5 ml-1 leading-none text-lg">
                          .
                        </span>{" "}
                        No Priority
                      </div>
                      {filterPriority === "None" && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setFilterPriority("Urgent")}
                      className="flex items-center justify-between px-2 py-2 text-[13px] cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md text-red-500 font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <SignalHigh className="h-4 w-4" /> Urgent
                      </div>
                      {filterPriority === "Urgent" && (
                        <Check className="h-4 w-4 text-foreground" />
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setFilterPriority("High")}
                      className="flex items-center justify-between px-2 py-2 text-[13px] cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-md text-orange-500 font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <SignalHigh className="h-4 w-4" /> High
                      </div>
                      {filterPriority === "High" && (
                        <Check className="h-4 w-4 text-foreground" />
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setFilterPriority("Medium")}
                      className="flex items-center justify-between px-2 py-2 text-[13px] cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-md text-amber-500 font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <SignalMedium className="h-4 w-4" /> Medium
                      </div>
                      {filterPriority === "Medium" && (
                        <Check className="h-4 w-4 text-foreground" />
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setFilterPriority("Low")}
                      className="flex items-center justify-between px-2 py-2 text-[13px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-gray-400 font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <SignalLow className="h-4 w-4" /> Low
                      </div>
                      {filterPriority === "Low" && (
                        <Check className="h-4 w-4 text-foreground" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              {[
                { label: "Members", icon: Users },
                { label: "Due Date", icon: Calendar },
                { label: "Teams", icon: Users },
                { label: "Labels", icon: Tag },
                { label: "Reporter", icon: User },
              ].map((item) => (
                <DropdownMenuSub key={item.label}>
                  <DropdownMenuSubTrigger className="flex items-center gap-2 rounded-md px-2 py-2 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer data-[state=open]:bg-gray-50 dark:data-[state=open]:bg-gray-800">
                    <item.icon className="h-4 w-4 text-gray-500" /> {item.label}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="w-40 rounded-xl shadow-lg ml-1 p-2 border-gray-200 dark:border-gray-800">
                      <div className="px-2 pb-1 pt-1 text-xs font-medium text-gray-400">
                        {item.label}
                      </div>
                      <DropdownMenuItem className="text-[13px] cursor-pointer text-gray-400 italic">
                        No options
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ADDED ONCLICK HANDLER FOR ROUTING */}
          <button
            onClick={() => {
              if (tab === "projects") {
                // If you add a route for /projects/new later, uncomment this:
                // router.push("/projects/new");
              } else {
                router.push("/tasks/new");
              }
            }}
            className="flex h-9 cursor-pointer items-center gap-2 rounded-md bg-black px-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none dark:bg-white dark:text-black dark:hover:bg-gray-200 sm:px-4"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline-block">
              {tab === "projects" ? "Add Project" : "Add Task"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-background">
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {tab === "projects" ? (
            <ProjectListView
              visibleFields={projectFields}
              filterPriority={filterPriority}
            />
          ) : viewMode === "board" ? (
            <KanbanBoard
              visibleFields={taskFields}
              onTaskClick={setSelectedTask}
              filterPriority={filterPriority}
            />
          ) : (
            <ListView
              visibleFields={taskFields}
              onTaskClick={setSelectedTask}
              filterPriority={filterPriority}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-gray-500">
          Loading Dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
