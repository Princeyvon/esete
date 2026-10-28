"use client";

import { useMemo, useState } from "react";

import Image from "next/image";

import {
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coins,
  Copy,
  Download,
  Edit2,
  Eye,
  FileEdit,
  Filter,
  Images,
  LayoutGrid,
  List,
  Package,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAgroCategories } from "@/data/categories-store";
import { useCurrency } from "@/data/currency-store";
import {
  type AgroProduct,
  CATEGORIES as DEFAULT_CATEGORIES,
  type ProductCategory,
  type ProductStatus,
  type ProductStockStatus,
} from "@/data/products";

import { ProductsCardGrid } from "./products-card-grid";

interface ProductsTableProps {
  products: AgroProduct[];
  onAddClick: () => void;
  onViewClick?: (product: AgroProduct) => void;
  onEditClick: (product: AgroProduct) => void;
  onDeleteClick: (product: AgroProduct) => void;
  onToggleActive: (productId: string) => void;
  onRestockClick?: (product: AgroProduct) => void;
  onDuplicateClick?: (product: AgroProduct) => void;
  onImportClick?: () => void;
  onBulkToggleActive?: (ids: string[], active: boolean) => void;
  onBulkDelete?: (ids: string[]) => void;
  onBulkRestock?: (ids: string[], units: number) => void;
  onResetToDefault?: () => void;
  selectedStatusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  selectedStockFilter?: string;
  onStockFilterChange?: (stock: string) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [8, 12, 24, 48];

type SortField = "name" | "sku" | "price" | "stock" | "category";
type SortOrder = "asc" | "desc";

export function ProductsTable({
  products,
  onAddClick,
  onViewClick,
  onEditClick,
  onDeleteClick,
  onToggleActive,
  onRestockClick,
  onDuplicateClick,
  onImportClick,
  onBulkToggleActive,
  onBulkDelete,
  onBulkRestock,
  onResetToDefault,
  selectedStatusFilter = "all",
  onStatusFilterChange,
  selectedStockFilter = "all",
  onStockFilterChange,
}: ProductsTableProps) {
  const { categories } = useAgroCategories();
  const { currency, formatPrice } = useCurrency();

  // View Mode: 'table' or 'cards'
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Local Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedActive, setSelectedActive] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const availableCategories = useMemo(() => {
    return categories.length > 0 ? categories.map((c) => c.name) : DEFAULT_CATEGORIES;
  }, [categories]);

  // Filter products across all criteria
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search Query
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query)) ||
        (p.activeIngredient && p.activeIngredient.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query));

      // 2. Category Filter
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;

      // 3. Status Filter (published, draft, archived)
      const matchesStatus = selectedStatusFilter === "all" || p.status === selectedStatusFilter;

      // 4. Stock Filter (in_stock, low_stock, out_of_stock)
      let matchesStock = true;
      if (selectedStockFilter === "in_stock") {
        matchesStock = p.stockStatus === "in_stock" && p.stock > (p.minThreshold || 10);
      } else if (selectedStockFilter === "low_stock") {
        matchesStock = p.stockStatus === "low_stock" || (p.stock > 0 && p.stock <= (p.minThreshold || 10));
      } else if (selectedStockFilter === "out_of_stock") {
        matchesStock = p.stockStatus === "out_of_stock" || p.stock === 0;
      }

      // 5. Active Filter
      let matchesActive = true;
      if (selectedActive === "active") {
        matchesActive = p.active;
      } else if (selectedActive === "inactive") {
        matchesActive = !p.active;
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesStock && matchesActive;
    });
  }, [products, searchQuery, selectedCategory, selectedStatusFilter, selectedStockFilter, selectedActive]);

  // Sorted products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "sku") {
        comparison = a.sku.localeCompare(b.sku);
      } else if (sortField === "category") {
        comparison = a.category.localeCompare(b.category);
      } else if (sortField === "stock") {
        comparison = a.stock - b.stock;
      } else if (sortField === "price") {
        const pA = a.price ?? -1;
        const pB = b.price ?? -1;
        comparison = pA - pB;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
    return list;
  }, [filteredProducts, sortField, sortOrder]);

  // Adjust pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, safeCurrentPage, itemsPerPage]);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedStatusFilter !== "all" ||
    selectedStockFilter !== "all" ||
    selectedActive !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    onStatusFilterChange?.("all");
    onStockFilterChange?.("all");
    setSelectedActive("all");
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    onStatusFilterChange?.(val);
    setCurrentPage(1);
  };

  const handleStockChange = (val: string) => {
    onStockFilterChange?.(val);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleSortToggle = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Selection handlers
  const handleSelectAllOnPage = () => {
    const pageIds = paginatedProducts.map((p) => p.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleRowSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // CSV Export for filtered or selected products
  const handleExportCSV = () => {
    const targetProducts =
      selectedIds.length > 0 ? products.filter((p) => selectedIds.includes(p.id)) : filteredProducts;

    if (targetProducts.length === 0) {
      toast.error("No products available to export.");
      return;
    }

    const headers = [
      "SKU",
      "Product Name",
      "Category",
      "Brand",
      "Active Ingredient",
      "Package Size",
      "Unit",
      `Price (${currency})`,
      "Stock Balance",
      "Stock Status",
      "Catalog Status",
      "Active in Store",
    ];

    const rows = targetProducts.map((p) => [
      `"${p.sku}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${(p.brand || "Esete Agro").replace(/"/g, '""')}"`,
      `"${(p.activeIngredient || "").replace(/"/g, '""')}"`,
      `"${p.packageSize}"`,
      `"${p.unit}"`,
      `"${p.showPrice && p.price !== null ? formatPrice(p.price, true) : "Contact us for price"}"`,
      p.stock,
      `"${p.stockStatus}"`,
      `"${p.status}"`,
      p.active ? "Yes" : "No",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `esete-agro-catalog-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${targetProducts.length} products to CSV.`);
  };

  const isAllPageSelected = paginatedProducts.length > 0 && paginatedProducts.every((p) => selectedIds.includes(p.id));

  return (
    <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-4">
      {/* Table Header, View Switcher & Actions */}
      <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between px-2 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">Agro Product Catalog</CardTitle>
            <span className="rounded-full bg-[#E8F6ED] px-2.5 py-0.5 text-xs font-semibold text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
              {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
            </span>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Single-source inventory with multi-currency pricing ({currency}), formulation specs, and live availability.
          </CardDescription>
        </div>

        {/* View Switcher and Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* View Mode Toggle (Table vs Card Grid) */}
          <div className="flex items-center rounded-xl border border-border/70 bg-muted/40 p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-background text-foreground shadow-xs border border-border/50 ring-1 ring-black/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table View"
            >
              <List className="size-3.5" />
              <span>Table View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "cards"
                  ? "bg-background text-foreground shadow-xs border border-border/50 ring-1 ring-black/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="size-3.5" />
              <span>Card View</span>
            </button>
          </div>

          {/* Import Button */}
          {onImportClick && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onImportClick}
              className="h-9 gap-1.5 rounded-xl border-border/70 text-xs font-semibold px-3 hover:bg-muted cursor-pointer"
              title="Import CSV or JSON inventory"
            >
              <Upload className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Import</span>
            </Button>
          )}

          {/* Export CSV Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-1.5 rounded-xl border-border/60 text-xs font-semibold px-3 hover:bg-muted/60 cursor-pointer"
            title="Download CSV catalog"
          >
            <Download className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          {/* Add Product Button */}
          <Button
            size="sm"
            onClick={onAddClick}
            className="h-9 gap-1.5 rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white font-medium text-xs px-3.5 shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add Product</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-2 pb-2">
        {/* Filters & Search Toolbar */}
        <div className="flex flex-col gap-2.5 rounded-2xl bg-muted/20 p-3 border border-border/40">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products by name, SKU, active ingredient, brand..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-9 pl-9 pr-8 text-xs rounded-xl bg-background/80"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-9 min-w-[135px] text-xs rounded-xl bg-background border-border/70 font-medium">
                  <SelectValue placeholder="All Categories">
                    {selectedCategory === "all" ? "All Categories" : selectedCategory}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">
                    All Categories
                  </SelectItem>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={selectedStatusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-9 min-w-[120px] text-xs rounded-xl bg-background border-border/70 font-medium capitalize">
                  <SelectValue placeholder="All Status">
                    {selectedStatusFilter === "all"
                      ? "All Status"
                      : selectedStatusFilter === "published"
                        ? "Published"
                        : selectedStatusFilter === "draft"
                          ? "Draft"
                          : "Archived"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">
                    All Status
                  </SelectItem>
                  <SelectItem value="published" className="text-xs">
                    Published
                  </SelectItem>
                  <SelectItem value="draft" className="text-xs">
                    Draft
                  </SelectItem>
                  <SelectItem value="archived" className="text-xs">
                    Archived
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Stock Filter */}
              <Select value={selectedStockFilter} onValueChange={handleStockChange}>
                <SelectTrigger className="h-9 min-w-[130px] text-xs rounded-xl bg-background border-border/70 font-medium">
                  <SelectValue placeholder="All Stock Levels">
                    {selectedStockFilter === "all"
                      ? "All Stock Levels"
                      : selectedStockFilter === "in_stock"
                        ? "In Stock"
                        : selectedStockFilter === "low_stock"
                          ? "Low Stock"
                          : "Out of Stock"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">
                    All Stock Levels
                  </SelectItem>
                  <SelectItem value="in_stock" className="text-xs">
                    In Stock
                  </SelectItem>
                  <SelectItem value="low_stock" className="text-xs">
                    Low Stock
                  </SelectItem>
                  <SelectItem value="out_of_stock" className="text-xs">
                    Out of Stock
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Dropdown */}
              <Select
                value={`${sortField}-${sortOrder}`}
                onValueChange={(val) => {
                  const [field, order] = val.split("-") as [SortField, SortOrder];
                  setSortField(field);
                  setSortOrder(order);
                }}
              >
                <SelectTrigger className="h-9 min-w-[140px] text-xs rounded-xl bg-background border-border/70 font-medium">
                  <SelectValue placeholder="Sort Catalog">
                    {sortField === "name" && (sortOrder === "asc" ? "Name (A-Z)" : "Name (Z-A)")}
                    {sortField === "stock" && (sortOrder === "asc" ? "Stock: Low to High" : "Stock: High to Low")}
                    {sortField === "price" && (sortOrder === "asc" ? "Price: Low to High" : "Price: High to Low")}
                    {sortField === "sku" && "SKU Code"}
                    {sortField === "category" && "Category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="name-asc" className="text-xs">
                    Name (A-Z)
                  </SelectItem>
                  <SelectItem value="name-desc" className="text-xs">
                    Name (Z-A)
                  </SelectItem>
                  <SelectItem value="stock-asc" className="text-xs">
                    Stock: Low to High
                  </SelectItem>
                  <SelectItem value="stock-desc" className="text-xs">
                    Stock: High to Low
                  </SelectItem>
                  <SelectItem value="price-asc" className="text-xs">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-desc" className="text-xs">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="sku-asc" className="text-xs">
                    SKU Code
                  </SelectItem>
                  <SelectItem value="category-asc" className="text-xs">
                    Category
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-9 text-xs rounded-xl text-muted-foreground hover:text-foreground gap-1 border-dashed cursor-pointer"
                >
                  <X className="size-3" />
                  <span>Clear Filters</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Floating / Sticky Bulk Actions Bar when items are selected */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#0B3B2C] text-white shadow-md animate-in fade-in-50">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
                {selectedIds.length} {selectedIds.length === 1 ? "Product" : "Products"} Selected
              </span>
              <span className="text-xs text-white/80 hidden sm:inline">Apply bulk inventory modifications:</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {onBulkToggleActive && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      onBulkToggleActive(selectedIds, true);
                      setSelectedIds([]);
                    }}
                    className="h-7 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2.5 cursor-pointer"
                  >
                    <Check className="size-3 mr-1" />
                    Activate
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onBulkToggleActive(selectedIds, false);
                      setSelectedIds([]);
                    }}
                    className="h-7 text-xs rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer"
                  >
                    Hide
                  </Button>
                </>
              )}

              {onBulkRestock && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    onBulkRestock(selectedIds, 20);
                    setSelectedIds([]);
                  }}
                  className="h-7 text-xs rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer"
                >
                  <TrendingUp className="size-3 mr-1" />
                  +20 Stock
                </Button>
              )}

              <Button
                type="button"
                size="sm"
                onClick={handleExportCSV}
                className="h-7 text-xs rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer"
              >
                <Download className="size-3 mr-1" />
                Export
              </Button>

              {onBulkDelete && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
                      onBulkDelete(selectedIds);
                      setSelectedIds([]);
                    }
                  }}
                  className="h-7 text-xs rounded-xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
                >
                  <Trash2 className="size-3 mr-1" />
                  Delete
                </Button>
              )}

              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="p-1 rounded-lg text-white/70 hover:text-white cursor-pointer"
                title="Deselect all"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* Catalog Table or Card Grid */}
        {sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-8 text-center bg-muted/10">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-3">
              <Package className="size-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">No agro products found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
              {hasActiveFilters
                ? "No products match the selected search and filter criteria. Try adjusting your query."
                : "Your agricultural input catalog is currently empty. Add your first product or import a CSV spreadsheet."}
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {hasActiveFilters ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="rounded-xl text-xs cursor-pointer"
                >
                  Clear All Filters
                </Button>
              ) : (
                onResetToDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onResetToDefault}
                    className="rounded-xl text-xs gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="size-3" />
                    Load Sample Catalog
                  </Button>
                )
              )}
              <Button
                size="sm"
                onClick={onAddClick}
                className="rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white text-xs cursor-pointer"
              >
                <Plus className="size-3.5 mr-1" />
                Add Product
              </Button>
            </div>
          </div>
        ) : viewMode === "cards" ? (
          <ProductsCardGrid
            products={paginatedProducts}
            onViewClick={onViewClick}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            onToggleActive={onToggleActive}
            onRestockClick={onRestockClick}
            onDuplicateClick={onDuplicateClick}
          />
        ) : (
          <div className="rounded-xl border border-border/60 overflow-hidden bg-background">
            <Table>
              <TableHeader className="bg-[#EAF4ED]/50 dark:bg-muted/40">
                <TableRow>
                  {/* Select All Checkbox */}
                  <TableHead className="w-10 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isAllPageSelected}
                      onChange={handleSelectAllOnPage}
                      className="size-4 rounded border-border text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-[#0B3B2C]"
                      title="Select all on this page"
                    />
                  </TableHead>

                  {/* Product Info Header with Sort */}
                  <TableHead className="font-semibold text-xs py-3 w-[33%]">
                    <button
                      type="button"
                      onClick={() => handleSortToggle("name")}
                      className="flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer"
                    >
                      <span>Product Info</span>
                      {sortField === "name" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="size-3 text-emerald-600" />
                        ) : (
                          <ArrowDown className="size-3 text-emerald-600" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3 opacity-40" />
                      )}
                    </button>
                  </TableHead>

                  {/* Category Header */}
                  <TableHead className="font-semibold text-xs py-3">
                    <button
                      type="button"
                      onClick={() => handleSortToggle("category")}
                      className="flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer"
                    >
                      <span>Category</span>
                      {sortField === "category" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="size-3 text-emerald-600" />
                        ) : (
                          <ArrowDown className="size-3 text-emerald-600" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3 opacity-40" />
                      )}
                    </button>
                  </TableHead>

                  {/* Price Header */}
                  <TableHead className="font-semibold text-xs py-3">
                    <button
                      type="button"
                      onClick={() => handleSortToggle("price")}
                      className="flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer"
                    >
                      <span>Price ({currency})</span>
                      {sortField === "price" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="size-3 text-emerald-600" />
                        ) : (
                          <ArrowDown className="size-3 text-emerald-600" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3 opacity-40" />
                      )}
                    </button>
                  </TableHead>

                  {/* Stock Units Header */}
                  <TableHead className="font-semibold text-xs py-3">
                    <button
                      type="button"
                      onClick={() => handleSortToggle("stock")}
                      className="flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer"
                    >
                      <span>Stock Balance</span>
                      {sortField === "stock" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="size-3 text-emerald-600" />
                        ) : (
                          <ArrowDown className="size-3 text-emerald-600" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3 opacity-40" />
                      )}
                    </button>
                  </TableHead>

                  <TableHead className="font-semibold text-xs py-3">Status</TableHead>
                  <TableHead className="font-semibold text-xs py-3 text-center">Active</TableHead>
                  <TableHead className="font-semibold text-xs py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedProducts.map((product) => {
                  const productImages =
                    Array.isArray(product.images) && product.images.length > 0
                      ? product.images
                      : product.imageUrl
                        ? [product.imageUrl]
                        : [];
                  const primaryImage = productImages[0];

                  const isOutOfStock = product.stockStatus === "out_of_stock" || product.stock === 0;
                  const isLowStock = product.stockStatus === "low_stock";
                  const isSelected = selectedIds.includes(product.id);

                  return (
                    <TableRow
                      key={product.id}
                      className={`hover:bg-muted/20 transition-colors ${isSelected ? "bg-emerald-50/40 dark:bg-emerald-950/20" : ""}`}
                    >
                      {/* Checkbox Cell */}
                      <TableCell className="py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRowSelect(product.id)}
                          className="size-4 rounded border-border text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-[#0B3B2C]"
                        />
                      </TableCell>

                      {/* Product Info with Image Thumbnail & Clickable View */}
                      <TableCell className="py-3">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => onViewClick?.(product)}
                            className="relative size-12 shrink-0 rounded-xl overflow-hidden bg-muted/40 border border-border/50 cursor-pointer hover:opacity-90 transition-opacity"
                            title="Click to view details"
                          >
                            {primaryImage ? (
                              <Image
                                src={primaryImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                                unoptimized={primaryImage.startsWith("data:")}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package className="size-5 text-muted-foreground/60" />
                              </div>
                            )}
                            {productImages.length > 1 && (
                              <span className="absolute bottom-0.5 right-0.5 rounded-sm bg-black/70 px-1 text-[9px] font-bold text-white">
                                {productImages.length}
                              </span>
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onViewClick?.(product)}
                                className="font-semibold text-xs text-foreground leading-snug line-clamp-1 text-left cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                              >
                                {product.name}
                              </button>
                              {product.featured && <Star className="size-3 text-amber-500 fill-amber-500 shrink-0" />}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                              <span className="font-mono text-[10px] bg-muted px-1.5 py-0.2 rounded font-semibold text-foreground/80">
                                {product.sku}
                              </span>
                              <span>•</span>
                              <span>{product.packageSize}</span>
                              {product.brand && (
                                <>
                                  <span>•</span>
                                  <span className="truncate max-w-[100px]">{product.brand}</span>
                                </>
                              )}
                            </div>
                            {product.activeIngredient && (
                              <p className="text-[10px] text-muted-foreground/80 truncate mt-0.5 italic">
                                {product.activeIngredient}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="py-3">
                        <Badge variant="outline" className="text-[11px] font-semibold border-border/70">
                          {product.category}
                        </Badge>
                      </TableCell>

                      {/* Price in Active Currency */}
                      <TableCell className="py-3 font-semibold text-xs">
                        <span className="text-emerald-900 dark:text-emerald-300">
                          {formatPrice(product.price, product.showPrice)}
                        </span>
                      </TableCell>

                      {/* Stock Units & Quick Restock Action */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-xs text-foreground">
                              {product.stock} {product.unit}
                            </span>
                            {isOutOfStock ? (
                              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                                Out of Stock
                              </span>
                            ) : isLowStock ? (
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                Low Stock (&le;{product.minThreshold || 10})
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-[#0B8A5A] dark:text-emerald-400">
                                Available
                              </span>
                            )}
                          </div>
                          {onRestockClick && (
                            <button
                              type="button"
                              onClick={() => onRestockClick(product)}
                              className="size-6 rounded-md bg-muted/60 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center justify-center transition-colors cursor-pointer"
                              title={`Quick Restock ${product.name}`}
                            >
                              <TrendingUp className="size-3" />
                            </button>
                          )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                            product.status === "published"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : product.status === "draft"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                          }`}
                        >
                          {product.status === "published" && <CheckCircle2 className="size-2.5" />}
                          {product.status === "draft" && <FileEdit className="size-2.5" />}
                          {product.status === "archived" && <Archive className="size-2.5" />}
                          {product.status}
                        </span>
                      </TableCell>

                      {/* Active in Store Toggle */}
                      <TableCell className="py-3 text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={product.active}
                            onCheckedChange={() => onToggleActive(product.id)}
                            aria-label={`Toggle active for ${product.name}`}
                            className="data-[state=checked]:bg-[#0B3B2C] data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700 cursor-pointer [&>span]:data-[state=checked]:translate-x-[14px] [&>span]:data-[state=unchecked]:translate-x-0.5 transition-colors"
                          />
                        </div>
                      </TableCell>

                      {/* Action buttons: View, Duplicate, Edit, Delete */}
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onViewClick && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => onViewClick(product)}
                              className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border-border/60 cursor-pointer"
                              title="View Product Specs"
                            >
                              <Eye className="size-3.5" />
                            </Button>
                          )}
                          {onDuplicateClick && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => onDuplicateClick(product)}
                              className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border-border/60 cursor-pointer"
                              title="Duplicate / Clone SKU"
                            >
                              <Copy className="size-3.5" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => onEditClick(product)}
                            className="size-7 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-emerald-600/30 cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => onDeleteClick(product)}
                            className="size-7 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination & Summary Bar */}
        {sortedProducts.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>
                Showing {Math.min((safeCurrentPage - 1) * itemsPerPage + 1, sortedProducts.length)} to{" "}
                {Math.min(safeCurrentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} items
              </span>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span>Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-border/60 bg-background px-1.5 py-0.5 text-xs text-foreground cursor-pointer"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 self-center sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage <= 1}
                className="h-8 rounded-xl px-2.5 text-xs cursor-pointer"
              >
                <ChevronLeft className="size-3.5 mr-1" />
                Previous
              </Button>

              <span className="text-xs font-medium px-2 text-foreground">
                Page {safeCurrentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage >= totalPages}
                className="h-8 rounded-xl px-2.5 text-xs cursor-pointer"
              >
                Next
                <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
