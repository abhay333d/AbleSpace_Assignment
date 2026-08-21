"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Plus,
} from "lucide-react";

interface ProjectListViewProps {
  visibleFields: {
    priority: boolean;
    lead: boolean;
    dueDate: boolean;
  };
  filterPriority: string; // <-- Added Prop
  searchQuery?: string;
}

type Project = {
  id: string;
  title: string;
  priority: "Urgent" | "High" | "Medium" | "Low" | "None";
  lead: { name: string; initials: string; avatar?: string } | null;
  dueDate: string;
};

const initialProjects: Project[] = [
  {
    id: "1",
    title: "Design Homepage",
    priority: "High",
    lead: {
      name: "Ankit Dutta",
      initials: "AD",
      avatar: "https://github.com/shadcn.png",
    },
    dueDate: "12 Sep 2026",
  },
  {
    id: "2",
    title: "Develop Login Feature",
    priority: "Low",
    lead: { name: "CN", initials: "CN" },
    dueDate: "15 Sep 2026",
  },
  {
    id: "3",
    title: "Test Payment Gateway",
    priority: "Medium",
    lead: null,
    dueDate: "18 Sep 2026",
  },
];

const PriorityIcon = ({ priority }: { priority: Project["priority"] }) => {
  switch (priority) {
    case "Urgent":
    case "High":
      return (
        <div className="flex items-center gap-1.5 text-red-500 font-medium text-xs">
          <SignalHigh className="h-3.5 w-3.5" /> <span>High</span>
        </div>
      );
    case "Medium":
      return (
        <div className="flex items-center gap-1.5 text-amber-500 font-medium text-xs">
          <SignalMedium className="h-3.5 w-3.5" /> <span>Medium</span>
        </div>
      );
    case "Low":
      return (
        <div className="flex items-center gap-1.5 text-gray-400 font-medium text-xs">
          <SignalLow className="h-3.5 w-3.5" /> <span>Low</span>
        </div>
      );
    default:
      return <span className="text-gray-400 text-xs">None</span>;
  }
};

export function ProjectListView({
  visibleFields,
  filterPriority,
  searchQuery = "",
}: ProjectListViewProps) {
  const [projects] = useState<Project[]>(initialProjects);

  // <-- Apply Filter Logic Here
  const filteredProjects = projects.filter((project) => {
    const matchesPriority =
      filterPriority === "All" || project.priority === filterPriority;
    const matchesSearch =
      !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPriority && matchesSearch;
  });

  return (
    <div className="w-full rounded-lg border border-border bg-white dark:bg-background overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-500 border-b border-border">
          <tr>
            <th className="font-medium px-4 py-3 w-[40%]">Projects</th>
            {visibleFields.priority && (
              <th className="font-medium px-4 py-3">Priority</th>
            )}
            {visibleFields.lead && (
              <th className="font-medium px-4 py-3">Lead</th>
            )}
            {visibleFields.dueDate && (
              <th className="font-medium px-4 py-3">Due Date</th>
            )}
            <th className="font-medium px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {/* Map over filteredProjects instead of projects */}
          {filteredProjects.map((project) => (
            <tr
              key={project.id}
              className="hover:bg-gray-50/30 dark:hover:bg-gray-800/20 transition-colors group cursor-pointer"
            >
              <td className="px-4 py-3 text-foreground font-medium">
                {project.title}
              </td>
              {visibleFields.priority && (
                <td className="px-4 py-3">
                  <PriorityIcon priority={project.priority} />
                </td>
              )}
              {visibleFields.lead && (
                <td className="px-4 py-3">
                  {project.lead ? (
                    <Avatar className="h-6 w-6 border border-border">
                      <AvatarImage src={project.lead.avatar} />
                      <AvatarFallback className="text-[10px] bg-gray-100 text-gray-600 font-medium dark:bg-gray-800 dark:text-gray-300">
                        {project.lead.initials}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 hover:text-foreground transition-colors">
                      <Plus className="h-3.5 w-3.5" />
                    </div>
                  )}
                </td>
              )}
              {visibleFields.dueDate && (
                <td className="px-4 py-3 text-gray-500 text-sm">
                  {project.dueDate}
                </td>
              )}
              <td className="px-4 py-3 text-right text-gray-400">
                <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  <MoreHorizontal className="h-4 w-4 ml-auto" />
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td
              colSpan={5}
              className="px-4 py-3 font-medium text-gray-500 hover:text-foreground cursor-pointer transition-colors border-t border-dashed border-border"
            >
              <div className="flex items-center gap-1.5">
                <Plus className="h-4 w-4" /> Add Projects
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
