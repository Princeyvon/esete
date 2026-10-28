"use client";

import Link from "next/link";

import { Settings, ShieldCheck, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserProfile } from "@/data/user-store";
import { getInitials } from "@/lib/utils";

export function AccountSwitcher({
  users: _users,
}: {
  readonly users?: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
    readonly role: string;
  }>;
}) {
  const { profile } = useUserProfile();

  const user = {
    name: profile.name || "Yvon Prince",
    email: profile.email || "princeyvon30@gmail.com",
    avatar: profile.avatar || "",
    role: profile.role || "Shop Owner & Lead Agronomist",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl p-1 text-left hover:bg-accent/50 transition-colors cursor-pointer outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="User account menu"
        >
          <Avatar className="size-8 rounded-lg border border-emerald-500/30">
            <AvatarImage src={user.avatar || undefined} alt={user.name} />
            <AvatarFallback className="bg-[#0B3B2C] text-emerald-300 text-xs font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-64 space-y-1 rounded-2xl p-2 shadow-lg border-border/60"
        side="bottom"
        align="end"
        sideOffset={6}
      >
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex items-center gap-3 text-left">
            <Avatar className="size-10 rounded-xl border border-emerald-500/30">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback className="bg-[#0B3B2C] text-emerald-300 text-xs font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-left text-xs leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-bold text-sm text-foreground">{user.name}</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-3.5" />
                </span>
              </div>
              <span className="truncate text-muted-foreground text-[11px]">{user.email}</span>
              <span className="truncate text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                {user.role}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs">
            <Link href="/dashboard/profile" className="flex items-center gap-2 p-2">
              <User className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Profile & Account Security</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs">
            <Link href="/dashboard/settings" className="flex items-center gap-2 p-2">
              <Settings className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Shop Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
