"use client";

import { useState } from "react";
import { Task, Status } from "@/types/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  SignalHigh,
  SignalMedium,
  SignalLow,
} from "lucide-react";

// The interface telling TypeScript what props to expect
interface ListViewProps {
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
    labels: [],
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
    labels: [],
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
    labels: [],
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
    labels: [],
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
    labels: [],
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
    labels: [],
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
    labels: [],
  },
];

const statuses: Status[] = ["To Do", "Doing", "Completed", "On Hold"];

const PriorityIcon = ({ priority }: { priority: Task["priority"] }) => {
  switch (priority) {
    case "Urgent":
    case "High":
      return (
        <div className="flex items-center gap-1 text-red-500">
          <SignalHigh className="h-4 w-4" /> <span>High</span>
        </div>
      );
    case "Medium":
      return (
        <div className="flex items-center gap-1 text-amber-500">
          <SignalMedium className="h-4 w-4" /> <span>Medium</span>
        </div>
      );
    case "Low":
      return (
        <div className="flex items-center gap-1 text-gray-400">
          <SignalLow className="h-4 w-4" /> <span>Low</span>
        </div>
      );
    default:
      return <span className="text-gray-400">None</span>;
  }
};

// Pass the props into the component signature here
export function ListView({
  visibleFields,
  onTaskClick,
  filterPriority,
}: ListViewProps) {
  const [tasks] = useState<Task[]>(initialTasks);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (status: string) => {
    setCollapsedSections((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  return (
    <div className="flex flex-col gap-6 w-full min-w-[800px] pb-8">
      {statuses.map((status) => {
        const sectionTasks = tasks
          .filter((t) => t.status === status)
          .filter(
            (t) => filterPriority === "All" || t.priority === filterPriority,
          );
        const isCollapsed = collapsedSections[status];

        if (sectionTasks.length === 0) return null;

        return (
          <div key={status} className="flex flex-col">
            {/* Group Header */}
            <div
              className="flex items-center gap-2 mb-3 cursor-pointer select-none text-foreground hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => toggleSection(status)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <h2 className="font-semibold">{status}</h2>
              <span className="text-xs text-gray-400 font-normal">
                {sectionTasks.length}
              </span>
            </div>

            {/* Data Table */}
            {!isCollapsed && (
              <div className="w-full rounded-lg border border-border bg-white dark:bg-background overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-500 border-b border-border">
                    <tr>
                      <th className="font-medium px-4 py-3 w-[30%]">Task</th>
                      {visibleFields.priority && (
                        <th className="font-medium px-4 py-3">Priority</th>
                      )}
                      {visibleFields.members && (
                        <th className="font-medium px-4 py-3">Members</th>
                      )}
                      {visibleFields.dueDate && (
                        <th className="font-medium px-4 py-3">Due Date</th>
                      )}
                      {visibleFields.labels && (
                        <th className="font-medium px-4 py-3">Labels</th>
                      )}
                      {visibleFields.status && (
                        <th className="font-medium px-4 py-3">Status</th>
                      )}
                      {visibleFields.reporter && (
                        <th className="font-medium px-4 py-3">Reporter</th>
                      )}
                      <th className="font-medium px-4 py-3 w-[10%]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sectionTasks.map((task) => (
                      <tr
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className="hover:bg-gray-50/30 dark:hover:bg-gray-800/20 transition-colors group cursor-pointer"
                      >
                        <td className="px-4 py-3 text-foreground font-medium">
                          {task.title}
                        </td>
                        {visibleFields.priority && (
                          <td className="px-4 py-3">
                            <PriorityIcon priority={task.priority} />
                          </td>
                        )}
                        {visibleFields.members && (
                          <td className="px-4 py-3">
                            <Avatar className="h-6 w-6 border border-border">
                              <AvatarImage src={task.assignee.avatar} />
                              <AvatarFallback className="text-[10px] bg-gray-100 text-gray-600">
                                {task.assignee.initials}
                              </AvatarFallback>
                            </Avatar>
                          </td>
                        )}
                        {visibleFields.dueDate && (
                          <td className="px-4 py-3 text-gray-500">
                            {task.dueDate}
                          </td>
                        )}
                        {visibleFields.labels && (
                          <td className="px-4 py-3">
                            {task.labels.length > 0 ? (
                              <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                {task.labels[0]}{" "}
                                {task.labels.length > 1 &&
                                  `+${task.labels.length - 1}`}
                              </span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                        )}
                        {visibleFields.status && (
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-[11px] text-gray-600 dark:border-gray-700 dark:text-gray-300">
                              {task.status}
                            </span>
                          </td>
                        )}
                        {visibleFields.reporter && (
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            Admin
                          </td>
                        )}
                        <td className="px-4 py-3 text-gray-400">
                          <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Add Task Row */}
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-3 text-gray-400 hover:text-foreground cursor-pointer transition-colors border-t border-dashed border-border"
                      >
                        + Add Task
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
