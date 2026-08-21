"use client";

import { useRouter } from "next/navigation";
import { UserCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const handleGuestLogin = () => {
    // 1. Save a simple guest session in the browser
    localStorage.setItem(
      "ableSpace_user",
      JSON.stringify({
        name: "Guest User",
        role: "guest",
        avatar: "https://github.com/shadcn.png",
      }),
    );

    // 2. Redirect to the dashboard
    router.push("/"); // Change this to "/dashboard" if your dashboard isn't on the root route
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AbleSpace
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Task Management Assessment
          </p>
        </div>

        <button
          onClick={handleGuestLogin}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-black px-4 py-3 font-semibold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <UserCircle className="h-5 w-5" />
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
