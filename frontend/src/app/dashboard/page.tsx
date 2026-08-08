"use client";

import { Search, Columns3, Filter, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col min-w-0">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:px-6">
        <h1 className="text-lg font-semibold text-foreground">Tasks</h1>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Input (Hidden on very small screens for better UX) */}
          <div className="relative hidden items-center sm:flex">
            <Search className="absolute left-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-48 rounded-md border border-border bg-transparent pl-9 pr-4 text-sm text-foreground placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary md:w-64"
            />
            {/* Optional Keyboard Shortcut Hint from Figma */}
            <div className="absolute right-2.5 flex items-center justify-center rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800">
              ⌘F
            </div>
          </div>

          {/* Fields Dropdown Button */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-medium text-foreground transition-colors hover:bg-gray-50 focus:outline-none dark:bg-transparent dark:hover:bg-gray-800" />
              }
            >
              <Columns3 className="h-4 w-4 text-gray-500" />
              <span className="hidden sm:inline-block">Fields</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <div className="mb-2 flex rounded-md bg-gray-100 p-1 dark:bg-gray-800">
                <button className="flex-1 rounded bg-white py-1 text-xs font-medium shadow-sm dark:bg-gray-700">
                  Board
                </button>
                <button className="flex-1 py-1 text-xs font-medium text-gray-500 hover:text-foreground">
                  List
                </button>
              </div>
              <DropdownMenuItem className="text-xs">Priority</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">Members</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">Due Date</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Button */}
          <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-foreground focus:outline-none dark:bg-transparent dark:hover:bg-gray-800">
            <Filter className="h-4 w-4" />
          </button>

          {/* Add Task Button */}
          <button className="flex h-9 cursor-pointer items-center gap-2 rounded-md bg-black px-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none dark:bg-white dark:text-black dark:hover:bg-gray-200 sm:px-4">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline-block">Add Task</span>
          </button>
        </div>
      </div>

      {/* Main Board Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-white p-4 dark:bg-background lg:p-6 min-h-0 min-w-0">
        <KanbanBoard />
      </div>
    </div>
  );
}
