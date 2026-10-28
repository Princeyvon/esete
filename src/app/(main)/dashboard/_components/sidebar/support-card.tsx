import Link from "next/link";

import { LayoutGrid, PackagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SupportCard() {
  return (
    <Card
      size="sm"
      className="overflow-hidden shadow-none group-data-[collapsible=icon]:hidden rounded-2xl bg-[#124333] border border-[#18523F] text-sidebar-foreground"
    >
      <CardHeader className="min-w-0 p-3.5">
        <CardTitle className="truncate text-sm font-semibold text-white">Quick Actions</CardTitle>
        <CardDescription className="text-xs text-[#A8C5B8]">Manage your shop inventory.</CardDescription>
        <div className="flex flex-col gap-2 pt-2">
          <Button
            asChild
            size="sm"
            className="justify-start gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#0B3B2C] font-semibold rounded-xl h-8 text-xs shadow-xs"
          >
            <Link href="/dashboard/products">
              <PackagePlus className="size-3.5" />
              Add New Product
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="justify-start gap-2 border-[#1B5743] bg-transparent text-[#E2F1E8] hover:bg-[#18523F] hover:text-white rounded-xl h-8 text-xs"
          >
            <Link href="/dashboard/categories">
              <LayoutGrid className="size-3.5" />
              Add Category
            </Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
