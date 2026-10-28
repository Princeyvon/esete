import type { MetadataRoute } from "next";

const PUBLIC_ROUTES = [
  "/",
  "/dashboard/default",
  "/dashboard/products",
  "/dashboard/categories",
  "/dashboard/profile",
  "/dashboard/settings",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: route,
  }));
}
