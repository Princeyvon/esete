import type { Metadata } from "next";

import { ProductsManagementView } from "./_components/products-management-view";

export const metadata: Metadata = {
  title: "Products Management | Esete Agro",
  description:
    "Complete agro-input catalog and inventory management for Esete Agro shop in Merkato, Addis Ababa. Filter by category, status, and stock with prices in ETB.",
  alternates: {
    canonical: "/dashboard/products",
  },
};

export default function ProductsPage() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <ProductsManagementView />
    </div>
  );
}
