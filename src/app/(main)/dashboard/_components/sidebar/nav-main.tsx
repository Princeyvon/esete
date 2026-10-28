"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "cn";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavGroup } from "@/navigation/sidebar/sidebar-items";

interface NavMainProps {
  readonly items: readonly NavGroup[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-1">
      <div className="px-1 py-1">
        <Button
          asChild
          className="w-full justify-start gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#0B3B2C] font-semibold rounded-xl h-9 text-xs shadow-xs"
        >
          <Link href="/dashboard/products">
            <PlusCircle className="size-4" />
            <span>Add Product</span>
          </Link>
        </Button>
      </div>
      {items.map((group) => (
        <SidebarGroup key={group.id} className="p-0">
          <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-[#7E9F90] px-2 pt-2">
            {group.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {group.items.map((item) => {
                if (!item.url) {
                  return null;
                }
                const Icon = item.icon;
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "w-full rounded-xl px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-[#164E3D] text-white font-medium relative after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-5 after:w-1 after:rounded-l-full after:bg-emerald-400 shadow-xs"
                          : "text-[#A8C5B8] hover:bg-[#134636] hover:text-white",
                      )}
                    >
                      <Link href={item.url}>
                        {Icon ? (
                          <Icon className={cn("size-4 shrink-0", isActive ? "text-emerald-400" : "text-[#8BAFA0]")} />
                        ) : null}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </div>
  );
}
