"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { CheckCircle2, Eye, EyeOff, KeyRound, Lock, ShieldAlert, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOwnerAuth } from "@/data/auth-store";

interface OwnerAccessDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OwnerAccessDialog({ isOpen, onOpenChange }: OwnerAccessDialogProps) {
  const { login } = useOwnerAuth();
  const router = useRouter();

  const [pinOrPass, setPinOrPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Keyboard shortcut listener: Ctrl + Shift + L or Cmd + Shift + L opens access dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "L" || e.key === "l")) {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    setTimeout(() => {
      const ok = login(pinOrPass, true);
      setLoading(false);

      if (ok) {
        toast.success("Owner authenticated. Redirecting to management dashboard...");
        onOpenChange(false);
        router.push("/dashboard/default");
      } else {
        setError(true);
        toast.error("Invalid owner PIN or password.");
      }
    }, 200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden rounded-3xl bg-white border border-stone-200">
        <div className="bg-[#143422] p-5 text-center text-white">
          <div className="size-11 rounded-2xl bg-[#1C462E] text-emerald-300 flex items-center justify-center mx-auto mb-2 border border-emerald-700/50">
            <Lock className="size-5 text-emerald-400" />
          </div>
          <DialogTitle className="font-serif text-lg font-bold text-white">Esete Agro Management</DialogTitle>
          <DialogDescription className="text-[11px] text-emerald-200/80 mt-0.5">
            Restricted to shop owner and authorized personnel.
          </DialogDescription>
        </div>

        <form onSubmit={handleUnlock} className="p-5 space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="disguised-owner-pin" className="text-xs font-semibold text-stone-700">
              Security PIN or Password
            </Label>
            <div className="relative">
              <Input
                id="disguised-owner-pin"
                type={showPass ? "text" : "password"}
                autoFocus
                value={pinOrPass}
                onChange={(e) => {
                  setPinOrPass(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter 4-digit PIN (9398)"
                className={`h-10 pr-9 text-xs rounded-xl ${
                  error ? "border-rose-500 bg-rose-50/50" : "border-stone-300 focus-visible:ring-emerald-700"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {showPass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </button>
            </div>

            {error && (
              <p className="text-[10px] text-rose-600 font-medium">
                Incorrect credentials. Use default PIN 9398 or password Esete@2026.
              </p>
            )}
          </div>

          <div className="rounded-xl bg-stone-50 border border-stone-200/80 p-2 text-stone-500 text-[10px] flex items-center justify-between">
            <span>
              Owner PIN: <strong>9398</strong>
            </span>
            <span>
              Shortcut: <kbd className="font-mono bg-white px-1 py-0.2 rounded border">Ctrl+Shift+L</kbd>
            </span>
          </div>

          <DialogFooter className="pt-2 flex flex-col gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-full bg-[#143422] hover:bg-[#0E2619] text-white font-semibold text-xs cursor-pointer"
            >
              {loading ? "Verifying..." : "Unlock & Open Dashboard"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full text-xs text-stone-500 rounded-full h-8"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
