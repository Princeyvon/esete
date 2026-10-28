import { LayoutDashboard, LayoutGrid, type LucideIcon, Package, Settings, ShoppingBag, User } from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainCollapsibleItem extends NavItemBase {
  subItems: NavSubItem[];
  url?: never;
}

export type NavMainItem = NavMainLinkItem | NavMainCollapsibleItem;

export interface NavGroup {
  id: number;
  label: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Esete Agro",
    items: [
      {
        id: "storefront",
        title: "Live Storefront",
        url: "/",
        icon: ShoppingBag,
      },
      {
        id: "dashboard",
        title: "Dashboard",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        id: "products",
        title: "Products",
        url: "/dashboard/products",
        icon: Package,
      },
      {
        id: "categories",
        title: "Categories",
        url: "/dashboard/categories",
        icon: LayoutGrid,
      },
      {
        id: "profile",
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
      },
      {
        id: "settings",
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
