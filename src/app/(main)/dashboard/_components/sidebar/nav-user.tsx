"use client";

import Link from "next/link";

import { EllipsisVertical, LayoutDashboard, LogOut, Package, Settings, User } from "lucide-react";

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
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useUserProfile } from "@/data/user-store";
import { getInitials } from "@/lib/utils";

export function NavUser({
  user: initialUser,
}: {
  readonly user?: {
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { profile } = useUserProfile();

  const currentUser = {
    name: profile.name ?? initialUser?.name ?? "Yvon Prince",
    email: profile.email ?? initialUser?.email ?? "princeyvon30@gmail.com",
    avatar: profile.avatar ?? initialUser?.avatar ?? "",
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="rounded-2xl bg-[#124333] border border-[#18523F]/60 text-white hover:bg-[#164E3D] hover:text-white transition-colors p-2.5 h-auto data-[state=open]:bg-[#164E3D]"
            >
              <Avatar className="h-9 w-9 rounded-xl border border-emerald-500/30">
                <AvatarImage src={currentUser.avatar || undefined} alt={currentUser.name} />
                <AvatarFallback className="rounded-xl bg-[#0B3B2C] text-emerald-400 font-semibold text-xs">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-xs leading-tight ml-1">
                <span className="truncate font-semibold text-white">{currentUser.name}</span>
                <span className="truncate text-[#94B5A5] text-[11px]">{currentUser.email}</span>
              </div>
              <EllipsisVertical className="ml-auto size-4 text-[#94B5A5]" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl bg-[#0B3B2C] text-[#E2F1E8] border-[#18523F] p-1.5 shadow-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuLabel className="p-2 font-normal">
              <div className="flex items-center gap-2.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg border border-emerald-500/30">
                  <AvatarImage src={currentUser.avatar || undefined} alt={currentUser.name} />
                  <AvatarFallback className="rounded-lg bg-[#124333] text-emerald-400 text-xs">
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-xs leading-tight">
                  <span className="truncate font-semibold text-white">{currentUser.name}</span>
                  <span className="truncate text-[#94B5A5] text-[11px]">{currentUser.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#18523F]" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                asChild
                className="rounded-xl hover:bg-[#164E3D] hover:text-white focus:bg-[#164E3D] focus:text-white text-xs cursor-pointer"
              >
                <Link href="/dashboard/profile">
                  <User className="size-4 text-emerald-400" />
                  <span>Profile & Security</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-xl hover:bg-[#164E3D] hover:text-white focus:bg-[#164E3D] focus:text-white text-xs cursor-pointer"
              >
                <Link href="/dashboard/default">
                  <LayoutDashboard className="size-4 text-emerald-400" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-xl hover:bg-[#164E3D] hover:text-white focus:bg-[#164E3D] focus:text-white text-xs cursor-pointer"
              >
                <Link href="/dashboard/products">
                  <Package className="size-4 text-emerald-400" />
                  <span>Products</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-xl hover:bg-[#164E3D] hover:text-white focus:bg-[#164E3D] focus:text-white text-xs cursor-pointer"
              >
                <Link href="/dashboard/settings">
                  <Settings className="size-4 text-emerald-400" />
                  <span>Shop Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
