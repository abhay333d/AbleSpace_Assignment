"use client";

import { useState, useEffect, useRef } from "react";
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

// The interface telling TypeScript what props to expect
interface KanbanBoardProps {
  onTaskClick: (task: Task) => void;
  filterPriority: string;
  visibleFields: {
    priority: boolean;
    members: boolean;
    dueDate: boolean;
    labels: boolean;
    status: boolean;
    reporter: boolean;
  };
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Write API Documentation",
    status: "To Do",
    priority: "High",
    assignee: {
      name: "Admin",
      initials: "AD",
      avatar: "https://github.com/shadcn.png",
    },
    dueDate: "29 Jul",
    labels: ["Deployment", "Deployment"],
  },
  {
    id: "2",
    title: "Implement Search Function",
    status: "To Do",
    priority: "Low",
    assignee: {
      name: "Admin",
      initials: "AD",
      avatar: "https://github.com/shadcn.png",
    },
    dueDate: "29 Jul",
    labels: ["Deployment", "Deployment"],
  },
  {
    id: "3",
    title: "Deploy to Production",
    status: "To Do",
    priority: "Medium",
    assignee: {
      name: "Admin",
      initials: "AD",
      avatar: "https://github.com/shadcn.png",
    },
    dueDate: "29 Jul",
    labels: ["Deployment", "Deployment"],
  },
  {
    id: "4",
    title: "Code Review Completed",
    status: "Doing",
    priority: "High",
    assignee: {
      name: "Admin",
      initials: "AD",
      avatar: "https://github.com/shadcn.png",
    },
    dueDate: "29 Jul",
    labels: ["Deployment", "Deployment"],
  },
  {
    id: "5",
    title: "Design Mockups Finalized",
    status: "Doing",
    priority: "Medium",
    assignee: {
      name: "Admin",
      initials: "AD",
      avatar: "https://github.com/shadcn.png",
    },
    dueDate: "29 Jul",
    labels: ["Deployment", "Deployment"],
  },
  {
    id: "6",
    title: "Feature Testing Passed",
    status: "Completed",
    priority: "Urgent",
    assignee: {
      name: "QA Team",
      initials: "QA",
      avatar: "https://github.com/shadcn.png",
    },
    dueDate: "30 Jul",
    labels: ["Testing", "Passed"],
  },
  {
    id: "7",
    title: "UI Design Updated",
    status: "Completed",
    priority: "High",
    assignee: {
      name: "Designer",
      initials: "DS",
      avatar: "https://github.com/shadcn.png",
    },
    dueDate: "31 Jul",
    labels: ["Design", "Updated"],
  },
  {
    id: "8",
    title: "Security Audit Scheduled",
    status: "Completed",
    priority: "Low",
    assignee: { name: "Security", initials: "SC" },
    dueDate: "01 Aug",
    labels: ["Audit", "Scheduled"],
  },
];

const initialColumns: { title: string; id: Status }[] = [
  { title: "To Do", id: "To Do" },
  { title: "Doing", id: "Doing" },
  { title: "Completed", id: "Completed" },
  { title: "On Hold", id: "On Hold" },
];

// Pass the props into the component signature here
export function KanbanBoard({
  visibleFields,
  onTaskClick,
  filterPriority,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [orderedColumns, setOrderedColumns] = useState(initialColumns);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest(".task-list-container")) return;

    if (containerRef.current && e.deltaY !== 0) {
      containerRef.current.scrollLeft += e.deltaY;
      e.preventDefault();
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
              containerRef.current = el;
            }}
            {...provided.droppableProps}
            onWheel={handleWheel}
            className="flex h-full w-full items-start gap-6 overflow-x-auto overflow-y-hidden pb-6 pt-2 px-1 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {orderedColumns.map((col, index) => {
              const columnTasks = tasks
                .filter((t) => t.status === col.id)
                .filter(
                  (t) =>
                    filterPriority === "All" || t.priority === filterPriority,
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
                          <button className="rounded p-1 hover:bg-gray-200 hover:text-foreground dark:hover:bg-gray-800">
                            <Plus className="h-4 w-4" />
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
                                key={task.id}
                                draggableId={task.id}
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
                                      <button className="text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </button>
                                    </div>

                                    {/* Conditionally Rendered Elements Based on visibleFields */}
                                    {(visibleFields.members ||
                                      visibleFields.dueDate) && (
                                      <div className="flex items-center justify-between text-xs">
                                        {visibleFields.members ? (
                                          <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                              <AvatarImage
                                                src={task.assignee.avatar}
                                              />
                                              <AvatarFallback className="text-[10px]">
                                                {task.assignee.initials}
                                              </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                              {task.assignee.name}
                                            </span>
                                          </div>
                                        ) : (
                                          <div />
                                        )}

                                        {visibleFields.dueDate && (
                                          <div className="flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-1 text-[11px] font-medium text-red-500 dark:bg-red-500/10 dark:text-red-400">
                                            <Calendar className="h-3 w-3" />
                                            <span>{task.dueDate}</span>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {visibleFields.labels &&
                                      task.labels.length > 0 && (
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

                            <button className="mt-1 flex items-center gap-2 rounded-lg p-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-200/50 hover:text-foreground dark:hover:bg-gray-800">
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
