"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Task, Status } from "@/types/task";
import {
  MoreHorizontal,
  Plus,
  Calendar,
  Tag,
  GripVertical,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

// NEW: Import the Dropdown components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KanbanBoardProps {
  onTaskClick: (task: Task) => void;
  filterPriority: string;
  searchQuery?: string; // Tracks the search bar input
  visibleFields: {
    priority: boolean;
    members: boolean;
    dueDate: boolean;
    labels: boolean;
    status: boolean;
    reporter: boolean;
  };
}

const initialColumns: { title: string; id: Status }[] = [
  { title: "To Do", id: "To Do" },
  { title: "Doing", id: "Doing" },
  { title: "Completed", id: "Completed" },
  { title: "On Hold", id: "On Hold" },
];

export function KanbanBoard({
  visibleFields,
  onTaskClick,
  filterPriority,
  searchQuery = "",
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [orderedColumns, setOrderedColumns] = useState(initialColumns);
  const [isMounted, setIsMounted] = useState(false);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 0);

    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3001/tasks");
        const data = response.data;

        if (Array.isArray(data)) {
          const formattedTasks = data.map((t: any) => ({
            ...t,
            id: String(t._id || t.id || Math.random()),
          }));
          setTasks(formattedTasks);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Failed to fetch tasks via Axios:", error);
        setTasks([]);
      }
    };

    fetchTasks();
  }, []);

  // Native DOM event listener to handle horizontal scrolling safely
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const column = target.closest(".task-list-container");

      if (column && column.scrollHeight > column.clientHeight) {
        return;
      }

      if (e.deltaY !== 0) {
        e.preventDefault();
        board.scrollLeft += e.deltaY;
      }
    };

    board.addEventListener("wheel", handleWheel, { passive: false });
    return () => board.removeEventListener("wheel", handleWheel);
  }, [isMounted]);

  // NEW: Delete Task Function directly from the card
  const handleDeleteTask = async (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation(); // Prevents the card's onTaskClick from firing!
    try {
      await axios.delete(`http://localhost:3001/tasks/${taskId}`);
      // Instantly remove the task from the board without reloading the page
      setTasks((prev) => prev.filter((t) => String(t.id) !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "COLUMN") {
      const newColumns = Array.from(orderedColumns);
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);
      setOrderedColumns(newColumns);
      return;
    }

    if (type === "TASK") {
      const taskIndex = tasks.findIndex((t) => t.id === draggableId);
      if (taskIndex === -1) return;

      const newTasks = Array.from(tasks);
      const [movedTask] = newTasks.splice(taskIndex, 1);
      movedTask.status = destination.droppableId as Status;

      const destinationColumnTasks = newTasks.filter(
        (t) => t.status === destination.droppableId,
      );

      if (destination.index === 0) {
        const firstTaskInColIndex = newTasks.findIndex(
          (t) => t.id === destinationColumnTasks[0]?.id,
        );
        newTasks.splice(
          firstTaskInColIndex !== -1 ? firstTaskInColIndex : newTasks.length,
          0,
          movedTask,
        );
      } else {
        const taskBeforeNewPosition =
          destinationColumnTasks[destination.index - 1];
        const insertIndex = newTasks.findIndex(
          (t) => t.id === taskBeforeNewPosition?.id,
        );
        newTasks.splice(insertIndex + 1, 0, movedTask);
      }
      setTasks(newTasks);

      axios
        .patch(`http://localhost:3001/tasks/${draggableId}`, {
          status: destination.droppableId,
        })
        .catch((error) => {
          console.error("Failed to update task status in DB:", error);
        });
    }
  };

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="COLUMN">
        {(provided) => (
          <div
            ref={(el) => {
              provided.innerRef(el);
              boardRef.current = el;
            }}
            {...provided.droppableProps}
            className="flex h-full w-full items-start gap-6 overflow-x-auto overflow-y-hidden pb-6 pt-2 px-1 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {orderedColumns.map((col, index) => {
              // Filtering logic applied here
              const columnTasks = (tasks || [])
                .filter((t) => t.status === col.id)
                .filter(
                  (t) =>
                    filterPriority === "All" || t.priority === filterPriority,
                )
                .filter(
                  (t) =>
                    !searchQuery ||
                    t.title.toLowerCase().includes(searchQuery.toLowerCase()),
                );

              return (
                <Draggable key={col.id} draggableId={col.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex w-[320px] max-h-full flex-shrink-0 flex-col rounded-xl bg-[#F4F5F8] border border-gray-200 p-3 dark:bg-gray-900 dark:border-gray-800 ${
                        snapshot.isDragging
                          ? "shadow-2xl ring-2 ring-primary/55 opacity-90"
                          : ""
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between px-1">
                        <div
                          className="flex flex-1 items-center gap-2 cursor-grab active:cursor-grabbing"
                          {...provided.dragHandleProps}
                        >
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <h3 className="text-sm font-semibold text-foreground">
                            {col.title}
                          </h3>
                          <span className="text-xs font-medium text-gray-500">
                            {columnTasks.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <button
                            onClick={() =>
                              router.push(`/tasks/new?status=${col.id}`)
                            }
                            className="mt-1 flex items-center gap-2 rounded-lg p-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-200/50 hover:text-foreground dark:hover:bg-gray-800"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Task</span>
                          </button>
                          <button className="rounded p-1 hover:bg-gray-200 hover:text-foreground dark:hover:bg-gray-800">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <Droppable droppableId={col.id} type="TASK">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`task-list-container flex flex-1 flex-col gap-3 overflow-y-auto min-h-[100px] max-h-[calc(100vh-16rem)] rounded-lg p-1 transition-colors [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                              snapshot.isDraggingOver
                                ? "bg-gray-200/50 dark:bg-gray-800/50"
                                : ""
                            }`}
                          >
                            {columnTasks.map((task, taskIndex) => (
                              <Draggable
                                key={String(task.id)}
                                draggableId={String(task.id)}
                                index={taskIndex}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    onClick={() => onTaskClick(task)}
                                    className={`group relative flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs transition-shadow cursor-pointer hover:shadow-md dark:border-gray-700 dark:bg-background ${
                                      snapshot.isDragging
                                        ? "shadow-xl ring-1 ring-primary/40"
                                        : ""
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <span className="text-sm font-medium text-foreground leading-snug">
                                        {task.title}
                                      </span>

                                      {/* UPDATED: Dynamic Dropdown Menu for Deletion */}
                                      <DropdownMenu>
                                        <DropdownMenuTrigger
                                          onClick={(e) => e.stopPropagation()} // Vital! Keeps the task detail panel from opening
                                          className="text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground outline-none"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          align="end"
                                          className="w-32 rounded-xl shadow-lg border-gray-200 dark:border-gray-800"
                                        >
                                          <DropdownMenuItem
                                            onClick={(e) =>
                                              handleDeleteTask(
                                                e,
                                                String(task.id),
                                              )
                                            }
                                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer font-medium text-[13px]"
                                          >
                                            Delete Task
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>

                                    {(visibleFields.members ||
                                      visibleFields.dueDate) && (
                                      <div className="flex items-center justify-between text-xs">
                                        {visibleFields.members ? (
                                          <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                              <AvatarImage
                                                src={
                                                  task.assignee?.avatar ||
                                                  "https://github.com/shadcn.png"
                                                }
                                              />
                                              <AvatarFallback className="text-[10px]">
                                                {task.assignee?.initials ||
                                                  task.reporter?.charAt(0) ||
                                                  "U"}
                                              </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                              {task.assignee?.name ||
                                                task.reporter ||
                                                "Unassigned"}
                                            </span>
                                          </div>
                                        ) : (
                                          <div />
                                        )}

                                        {visibleFields.dueDate &&
                                          task.dueDate && (
                                            <div className="flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-1 text-[11px] font-medium text-red-500 dark:bg-red-500/10 dark:text-red-400">
                                              <Calendar className="h-3 w-3" />
                                              <span>
                                                {new Date(
                                                  task.dueDate,
                                                ).toLocaleDateString("en-GB", {
                                                  day: "numeric",
                                                  month: "short",
                                                })}
                                              </span>
                                            </div>
                                          )}
                                      </div>
                                    )}

                                    {visibleFields.labels &&
                                      task.labels?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                          {task.labels.map((label, idx) => (
                                            <span
                                              key={idx}
                                              className="inline-flex items-center gap-1 rounded-md border border-gray-100 bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                            >
                                              <Tag className="h-3 w-3 -rotate-90 text-gray-400" />
                                              {label}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}

                            {/* UPDATED: Dynamic Bottom Add Task routing logic */}
                            <button
                              onClick={() =>
                                router.push(`/tasks/new?status=${col.id}`)
                              }
                              className="mt-1 flex items-center gap-2 rounded-lg p-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-200/50 hover:text-foreground dark:hover:bg-gray-800"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Add Task</span>
                            </button>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
