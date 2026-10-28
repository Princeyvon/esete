"use client";

import { useRouter } from "next/navigation";

import { Lock, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useOwnerAuth } from "@/data/auth-store";

export function LockButton() {
  const { logout } = useOwnerAuth();
  const router = useRouter();

  const handleLock = () => {
    logout();
    toast.info("Dashboard locked. Session terminated.");
    router.push("/");
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleLock}
      className="h-8 gap-1.5 px-2.5 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-950/40 text-xs font-semibold cursor-pointer"
      title="Lock owner session and exit"
    >
      <Lock className="size-3.5" />
      <span className="hidden md:inline">Lock Session</span>
    </Button>
  );
}
