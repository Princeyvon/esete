"use client";

import Link from "next/link";

import { Search, Sparkles } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { rootUser } from "@/data/users";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SupportCard } from "./support-card";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sidebarVariant, sidebarCollapsible, isSynced } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.values.sidebar_variant,
      sidebarCollapsible: s.values.sidebar_collapsible,
      isSynced: s.isSynced,
    })),
  );

  const variant = isSynced ? sidebarVariant : props.variant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader className="gap-3 pt-3 px-3">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/default" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-400 text-[#0B3B2C] shadow-xs">
              <Sparkles className="size-4.5 fill-[#0B3B2C]" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">{APP_CONFIG.name}</span>
          </Link>
          <SidebarTrigger className="text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent size-7 rounded-lg" />
        </div>

        {/* Search input in sidebar - Vizora style */}
        <div className="pt-1 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between rounded-xl bg-[#134636] px-3 py-2 text-xs text-sidebar-foreground/70 border border-[#185542]/50">
            <div className="flex items-center gap-2">
              <Search className="size-3.5 text-sidebar-foreground/60" />
              <span className="text-[#A8C5B8]">Search</span>
            </div>
            <kbd className="rounded bg-[#0B3B2C] px-1.5 py-0.5 font-mono text-[10px] text-[#A8C5B8] border border-[#185542]">
              ⌘ F
            </kbd>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <NavMain items={sidebarItems} />
      </SidebarContent>

      <SidebarFooter className="p-3 gap-2.5">
        <SupportCard />
        <NavUser user={rootUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
