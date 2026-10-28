"use client";

import { useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  AlertCircle,
  Archive,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coins,
  Copy,
  Edit2,
  Eye,
  FileEdit,
  LayoutGrid,
  List,
  Package,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { DeleteConfirmDialog } from "@/app/(main)/dashboard/products/_components/delete-confirm-dialog";
import { ProductDetailsDialog } from "@/app/(main)/dashboard/products/_components/product-details-dialog";
import { ProductFormDialog } from "@/app/(main)/dashboard/products/_components/product-form-dialog";
import { ProductsCardGrid } from "@/app/(main)/dashboard/products/_components/products-card-grid";
import { QuickRestockDialog } from "@/app/(main)/dashboard/products/_components/quick-restock-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAgroCategories } from "@/data/categories-store";
import { useCurrency } from "@/data/currency-store";

import { type AgroProduct, CATEGORIES as DEFAULT_CATEGORIES } from "./products-data";

interface ProductListTableProps {
  products: AgroProduct[];
  onToggleActive: (productId: string) => void;
  onAddProduct: (newProduct: Omit<AgroProduct, "id">) => void;
  onUpdateProduct?: (updatedProduct: AgroProduct) => void;
  onDeleteProduct?: (product: AgroProduct) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const ITEMS_PER_PAGE = 8;

export function ProductListTable({
  products,
  onToggleActive,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onRefresh,
  isRefreshing = false,
}: ProductListTableProps) {
  const { categories } = useAgroCategories();
  const { currency, formatPrice } = useCurrency();

  // View Mode: 'table' or 'cards'
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog States
  const [isAddOrEditOpen, setIsAddOrEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AgroProduct | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<AgroProduct | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<AgroProduct | null>(null);

  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [restockingProduct, setRestockingProduct] = useState<AgroProduct | null>(null);

  const availableCategories = categories.length > 0 ? categories.map((c) => c.name) : DEFAULT_CATEGORIES;

  const handleOpenRestock = (product: AgroProduct) => {
    setRestockingProduct(product);
    setIsRestockOpen(true);
  };

  const handleRestock = (productId: string, newTotalStock: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !onUpdateProduct) return;
    let stockStatus: AgroProduct["stockStatus"] = "in_stock";
    if (newTotalStock === 0) stockStatus = "out_of_stock";
    else if (newTotalStock <= (product.minThreshold || 10)) stockStatus = "low_stock";
    onUpdateProduct({ ...product, stock: newTotalStock, stockStatus });
  };

  const handleDuplicate = (product: AgroProduct) => {
    const clone: Omit<AgroProduct, "id"> = {
      ...product,
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-CP`,
    };
    onAddProduct(clone);
    toast.success(`Duplicated "${product.name}".`);
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search matches
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query)) ||
        (product.activeIngredient && product.activeIngredient.toLowerCase().includes(query));

      // Category filter
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

      // Status filter
      let matchesStatus = true;
      if (selectedStatus === "published") {
        matchesStatus = product.status === "published";
      } else if (selectedStatus === "draft") {
        matchesStatus = product.status === "draft";
      } else if (selectedStatus === "archived") {
        matchesStatus = product.status === "archived";
      } else if (selectedStatus === "in_stock") {
        matchesStatus = product.stockStatus === "in_stock";
      } else if (selectedStatus === "low_stock") {
        matchesStatus = product.stockStatus === "low_stock";
      } else if (selectedStatus === "out_of_stock") {
        matchesStatus = product.stockStatus === "out_of_stock";
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage]);

  // Dialog open handlers
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsAddOrEditOpen(true);
  };

  const handleOpenEdit = (product: AgroProduct) => {
    setEditingProduct(product);
    setIsAddOrEditOpen(true);
  };

  const handleOpenView = (product: AgroProduct) => {
    setViewingProduct(product);
    setIsDetailsOpen(true);
  };

  const handleOpenDelete = (product: AgroProduct) => {
    setDeletingProduct(product);
    setIsDeleteOpen(true);
  };

  const handleSaveProduct = (productData: Omit<AgroProduct, "id">, existingId?: string) => {
    if (existingId) {
      if (onUpdateProduct) {
        onUpdateProduct({ ...productData, id: existingId });
      }
    } else {
      onAddProduct(productData);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setCurrentPage(1);
    onRefresh();
  };

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || selectedStatus !== "all";

  // Synced viewing product for modal
  const currentViewingProduct = useMemo(() => {
    if (!viewingProduct) return null;
    return products.find((p) => p.id === viewingProduct.id) || viewingProduct;
  }, [products, viewingProduct]);

  return (
    <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-4">
      <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between px-2 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">Product List</CardTitle>
            <span className="rounded-full bg-[#E8F6ED] px-2.5 py-0.5 text-xs font-semibold text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
              {filteredProducts.length} of {products.length} Products
            </span>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Manage store catalog, prices in {currency}, live stock levels, and active status
          </CardDescription>
        </div>

        {/* Action Controls & View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Table vs Card View Toggle */}
          <div className="flex items-center rounded-xl border border-border/70 bg-muted/40 p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-background text-foreground shadow-xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table View"
            >
              <List className="size-3.5" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "cards"
                  ? "bg-background text-foreground shadow-xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="size-3.5" />
              <span>Cards</span>
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            disabled={isRefreshing}
            className="h-8 gap-1.5 text-xs rounded-xl border border-border/60 hover:bg-[#E8F6ED] hover:text-[#0B8A5A] cursor-pointer"
            title="Reset table filters"
          >
            <RotateCcw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleOpenAdd}
            className="h-8 gap-1.5 text-xs bg-[#0B3B2C] hover:bg-[#134636] text-white rounded-xl shadow-xs cursor-pointer font-medium"
          >
            <Plus className="size-3.5" />
            <span>Add Product</span>
          </Button>

          <Link href="/dashboard/products">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs rounded-xl border-emerald-600/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer font-semibold"
              title="Go to full Products Catalog Management"
            >
              <span>Full Catalog</span>
              <ArrowUpRight className="size-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-2 pb-2">
        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-2.5 rounded-2xl bg-muted/20 p-3 border border-border/40">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search products by name, SKU, active ingredient, brand..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-7 h-9 text-xs rounded-xl bg-background"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Clear search"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns with explicit labels */}
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={selectedCategory}
                onValueChange={(val) => {
                  setSelectedCategory(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[145px] sm:w-[160px] h-9 text-xs rounded-xl bg-background border-border/70 font-medium">
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

              <Select
                value={selectedStatus}
                onValueChange={(val) => {
                  setSelectedStatus(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[130px] sm:w-[145px] h-9 text-xs rounded-xl bg-background border-border/70 font-medium">
                  <SelectValue placeholder="All Statuses">
                    {selectedStatus === "all"
                      ? "All Statuses"
                      : selectedStatus === "published"
                        ? "Published"
                        : selectedStatus === "draft"
                          ? "Draft"
                          : selectedStatus === "archived"
                            ? "Archived"
                            : selectedStatus === "in_stock"
                              ? "In Stock"
                              : selectedStatus === "low_stock"
                                ? "Low Stock"
                                : "Out of Stock"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">
                    All Statuses
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

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-9 text-xs rounded-xl text-muted-foreground hover:text-foreground gap-1 border-dashed"
                >
                  <X className="size-3" />
                  <span>Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* View Mode: Card Grid vs Table */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-2xl border-dashed bg-muted/10">
            <Package className="size-9 text-muted-foreground/50 mb-2" />
            <h4 className="font-semibold text-xs text-foreground">No matching products found</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5 mb-3">
              Try adjusting your search query or reset active filters.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs rounded-xl"
            >
              Reset Filters
            </Button>
          </div>
        ) : viewMode === "cards" ? (
          <ProductsCardGrid
            products={paginatedProducts}
            onViewClick={handleOpenView}
            onEditClick={handleOpenEdit}
            onDeleteClick={handleOpenDelete}
            onToggleActive={onToggleActive}
            onRestockClick={handleOpenRestock}
            onDuplicateClick={handleDuplicate}
          />
        ) : (
          <div className="rounded-xl border border-border/60 overflow-hidden bg-background">
            <Table>
              <TableHeader className="bg-[#EAF4ED]/50 dark:bg-muted/40">
                <TableRow>
                  <TableHead className="font-semibold text-xs py-3 w-[35%]">Product Info</TableHead>
                  <TableHead className="font-semibold text-xs py-3">Category</TableHead>
                  <TableHead className="font-semibold text-xs py-3">Price ({currency})</TableHead>
                  <TableHead className="font-semibold text-xs py-3">Stock Units</TableHead>
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

                  return (
                    <TableRow key={product.id} className="hover:bg-muted/20 transition-colors">
                      {/* Product Info with Thumbnail */}
                      <TableCell className="py-2.5">
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleOpenView(product)}
                            className="relative size-11 shrink-0 rounded-xl overflow-hidden bg-muted/40 border border-border/50 cursor-pointer hover:opacity-90 transition-opacity"
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
                                <Package className="size-4 text-muted-foreground/60" />
                              </div>
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenView(product)}
                                className="font-semibold text-xs text-foreground leading-snug line-clamp-1 text-left cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                              >
                                {product.name}
                              </button>
                              {product.featured && <Star className="size-3 text-amber-500 fill-amber-500 shrink-0" />}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                              <span className="font-mono bg-muted px-1.5 py-0.2 rounded font-semibold text-foreground/80">
                                {product.sku}
                              </span>
                              <span>•</span>
                              <span>{product.packageSize}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="py-2.5">
                        <Badge variant="outline" className="text-[11px] font-semibold border-border/70">
                          {product.category}
                        </Badge>
                      </TableCell>

                      {/* Price in Active Currency */}
                      <TableCell className="py-2.5 font-semibold text-xs">
                        <span className="text-emerald-900 dark:text-emerald-300">
                          {formatPrice(product.price, product.showPrice)}
                        </span>
                      </TableCell>

                      {/* Stock Units & Status */}
                      <TableCell className="py-2.5">
                        <div className="flex items-center justify-between gap-1.5">
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
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenRestock(product)}
                            className="size-6 rounded-md text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40 cursor-pointer shrink-0"
                            title="Quick Restock"
                          >
                            <TrendingUp className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-2.5">
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
                      <TableCell className="py-2.5 text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={product.active}
                            onCheckedChange={() => onToggleActive(product.id)}
                            aria-label={`Toggle active for ${product.name}`}
                            className="data-[state=checked]:bg-[#0B3B2C] data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700 cursor-pointer [&>span]:data-[state=checked]:translate-x-[14px] [&>span]:data-[state=unchecked]:translate-x-0.5 transition-colors"
                          />
                        </div>
                      </TableCell>

                      {/* Action Buttons: View, Edit, Duplicate, Delete */}
                      <TableCell className="py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenView(product)}
                            className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border-border/60 cursor-pointer"
                            title="View Product Specs"
                          >
                            <Eye className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleDuplicate(product)}
                            className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border-border/60 cursor-pointer"
                            title="Clone SKU / Duplicate Product"
                          >
                            <Copy className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenEdit(product)}
                            className="size-7 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-emerald-600/30 cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          {onDeleteProduct && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleOpenDelete(product)}
                              className="size-7 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground pt-1">
          <div>
            Showing {Math.min((safeCurrentPage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)} to{" "}
            {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} entries
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 p-0"
              aria-label="Previous Page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="px-2 font-medium text-foreground">
              {safeCurrentPage} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 p-0"
              aria-label="Next Page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* View Details Dialog */}
      <ProductDetailsDialog
        product={currentViewingProduct}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEditClick={handleOpenEdit}
        onToggleActive={onToggleActive}
        onRestockClick={handleOpenRestock}
        onDuplicateClick={handleDuplicate}
        onDeleteClick={handleOpenDelete}
      />

      {/* Add / Edit Dialog */}
      <ProductFormDialog
        isOpen={isAddOrEditOpen}
        onOpenChange={setIsAddOrEditOpen}
        productToEdit={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        product={deletingProduct}
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={(prod) => {
          if (onDeleteProduct) {
            onDeleteProduct(prod);
          }
          setIsDeleteOpen(false);
          setDeletingProduct(null);
        }}
      />

      {/* Quick Restock Dialog */}
      <QuickRestockDialog
        product={restockingProduct}
        isOpen={isRestockOpen}
        onOpenChange={setIsRestockOpen}
        onRestock={handleRestock}
      />
    </Card>
  );
}
