"use client";

import { type ReactNode, useState } from "react";

import Link from "next/link";

import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Leaf, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOwnerAuth } from "@/data/auth-store";

interface OwnerAuthGuardProps {
  children: ReactNode;
}

export function OwnerAuthGuard({ children }: OwnerAuthGuardProps) {
  const { isAuthenticated, isLoaded, login } = useOwnerAuth();
  const [pinOrPassword, setPinOrPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasError(false);

    setTimeout(() => {
      const success = login(pinOrPassword, rememberDevice);
      setIsSubmitting(false);

      if (success) {
        toast.success("Owner access granted. Welcome to Esete Agro Dashboard!");
      } else {
        setHasError(true);
        toast.error("Invalid owner PIN or password. Please try again.");
      }
    }, 250);
  };

  // While checking local storage authentication
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FAF8F5]">
        <div className="flex flex-col items-center gap-3 text-stone-600">
          <div className="size-10 rounded-xl bg-[#143422] text-emerald-300 flex items-center justify-center animate-pulse">
            <Leaf className="size-5" />
          </div>
          <span className="text-xs font-semibold">Verifying secure owner session...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, render the lock screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F4EE] px-4 py-8">
        <Card className="w-full max-w-md rounded-3xl border border-stone-200/90 bg-white shadow-xl overflow-hidden">
          {/* Top Banner */}
          <div className="bg-[#143422] px-6 py-6 text-white text-center flex flex-col items-center">
            <div className="size-12 rounded-2xl bg-[#1C462E] text-emerald-300 flex items-center justify-center mb-3 shadow-inner border border-emerald-700/50">
              <Lock className="size-6 text-emerald-400" />
            </div>
            <CardTitle className="font-serif text-2xl font-bold tracking-tight text-white">Esete Agro</CardTitle>
            <p className="text-xs text-emerald-200/90 mt-1 uppercase tracking-widest font-bold">
              Owner Management Portal
            </p>
          </div>

          <CardHeader className="px-6 pt-5 pb-2 text-center">
            <h3 className="text-sm font-bold text-stone-800">Private Dashboard Protected</h3>
            <CardDescription className="text-xs text-stone-500 mt-0.5">
              Enter your shop owner PIN or master password to access inventory and catalog controls.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="px-6 py-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="owner-passcode" className="text-xs font-semibold text-stone-700">
                  Owner Passcode or PIN
                </Label>
                <div className="relative">
                  <Input
                    id="owner-passcode"
                    type={showPassword ? "text" : "password"}
                    value={pinOrPassword}
                    onChange={(e) => {
                      setPinOrPassword(e.target.value);
                      if (hasError) setHasError(false);
                    }}
                    placeholder="Enter 4-digit PIN (9398) or password"
                    autoFocus
                    required
                    className={`h-11 pr-10 text-sm rounded-xl transition-colors ${
                      hasError
                        ? "border-rose-500 bg-rose-50/50 focus-visible:ring-rose-500"
                        : "border-stone-300 focus-visible:ring-emerald-700"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                {hasError && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium pt-1">
                    <ShieldAlert className="size-3.5 shrink-0" />
                    Incorrect passcode. Default PIN is 9398 (phone ending) or Esete@2026.
                  </p>
                )}
              </div>

              {/* Remember device checkbox */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Keep dashboard unlocked on this device</span>
                </label>
              </div>

              {/* Helper Credential Hint Box */}
              <div className="rounded-xl bg-stone-50 border border-stone-200/80 p-3 text-stone-600 text-[11px] space-y-1">
                <div className="font-semibold text-stone-800 flex items-center gap-1">
                  <KeyRound className="size-3 text-emerald-700" />
                  Owner Quick Access Credentials:
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] bg-white px-2 py-1 rounded border border-stone-200">
                  <span>
                    Quick PIN: <strong>9398</strong>
                  </span>
                  <span>
                    Password: <strong>Esete@2026</strong>
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="px-6 pb-6 pt-2 flex flex-col gap-2.5">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-full bg-[#143422] hover:bg-[#0E2619] text-white font-semibold text-xs shadow-md cursor-pointer"
              >
                {isSubmitting ? "Verifying..." : "Unlock Dashboard"}
              </Button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors pt-1"
              >
                <ArrowLeft className="size-3" />
                <span>Return to Public Storefront</span>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  // Authenticated: Render the full dashboard
  return <>{children}</>;
}
