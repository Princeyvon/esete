import type { Metadata } from "next";

import { EseteDashboardView } from "./_components/esete-dashboard-view";

export const metadata: Metadata = {
  title: "Esete Agro Dashboard | Inventory & Catalog Overview",
  description:
    "Live dashboard for Esete Agro shop in Merkato, Addis Ababa. Stock overview, product status breakdown, and catalog management in ETB.",
  alternates: {
    canonical: "/dashboard/default",
  },
};

export default function DefaultDashboardPage() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <EseteDashboardView />
    </div>
  );
}
