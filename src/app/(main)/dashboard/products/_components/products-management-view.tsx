"use client";

import { useMemo, useState } from "react";

import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Copy,
  FileEdit,
  Package,
  Plus,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type AgroProduct, computeDashboardMetrics } from "@/data/products";
import { useAgroProducts } from "@/data/products-store";

import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { ImportProductsDialog } from "./import-products-dialog";
import { ProductDetailsDialog } from "./product-details-dialog";
import { ProductFormDialog } from "./product-form-dialog";
import { ProductsTable } from "./products-table";
import { QuickRestockDialog } from "./quick-restock-dialog";

export function ProductsManagementView() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleActive,
    adjustStock,
    duplicateProduct,
    bulkToggleActive,
    bulkDelete,
    bulkRestock,
    importProducts,
    resetToDefault,
  } = useAgroProducts();

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AgroProduct | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<AgroProduct | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<AgroProduct | null>(null);

  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [restockingProduct, setRestockingProduct] = useState<AgroProduct | null>(null);

  const [isImportOpen, setIsImportOpen] = useState(false);

  // Live synced version of viewingProduct to stay reactive when toggled or edited
  const currentViewingProduct = useMemo(() => {
    if (!viewingProduct) return null;
    return products.find((p) => p.id === viewingProduct.id) || viewingProduct;
  }, [products, viewingProduct]);

  // Filter preset states controlled by clicking top stat cards or table filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

  // Compute metrics from current products list
  const metrics = useMemo(() => computeDashboardMetrics(products), [products]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: AgroProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleOpenView = (product: AgroProduct) => {
    setViewingProduct(product);
    setIsDetailsOpen(true);
  };

  const handleOpenDelete = (product: AgroProduct) => {
    setDeletingProduct(product);
    setIsDeleteOpen(true);
  };

  const handleOpenRestock = (product: AgroProduct) => {
    setRestockingProduct(product);
    setIsRestockOpen(true);
  };

  const handleRestock = (productId: string, newTotalStock: number) => {
    adjustStock(productId, newTotalStock);
  };

  const handleDuplicate = (product: AgroProduct) => {
    const cloned = duplicateProduct(product.id);
    if (cloned) {
      toast.success(`Duplicated "${product.name}" as SKU: ${cloned.sku}.`);
    }
  };

  const handleSaveProduct = (productData: Omit<AgroProduct, "id">, existingId?: string) => {
    if (existingId) {
      updateProduct({ ...productData, id: existingId });
      toast.success(`Updated "${productData.name}" successfully.`);
    } else {
      const created = addProduct(productData);
      toast.success(`Created "${created.name}" and added to inventory.`);
    }
  };

  const handleConfirmDelete = (product: AgroProduct) => {
    deleteProduct(product.id);
    setIsDeleteOpen(false);
    setDeletingProduct(null);
    toast.success(`Deleted "${product.name}" from inventory.`);
  };

  const handleToggleActive = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    toggleActive(productId);
    if (product) {
      toast.success(`"${product.name}" is now ${!product.active ? "Active in Store" : "Hidden from Store"}`);
    }
  };

  const handleBulkToggleActive = (ids: string[], active: boolean) => {
    bulkToggleActive(ids, active);
    toast.success(`${active ? "Activated" : "Hidden"} ${ids.length} products in store.`);
  };

  const handleBulkDelete = (ids: string[]) => {
    bulkDelete(ids);
    toast.success(`Deleted ${ids.length} products from inventory.`);
  };

  const handleBulkRestock = (ids: string[], units: number) => {
    bulkRestock(ids, units);
    toast.success(`Added +${units} units to ${ids.length} products.`);
  };

  const handleImport = (importedList: Omit<AgroProduct, "id">[]) => {
    importProducts(importedList);
  };

  // Stat card filter toggle handlers
  const handleStatFilter = (type: "all" | "published" | "draft" | "low_stock" | "out_of_stock") => {
    if (type === "all") {
      setStatusFilter("all");
      setStockFilter("all");
      toast.info("Showing all catalog products.");
    } else if (type === "published") {
      setStatusFilter(statusFilter === "published" ? "all" : "published");
      setStockFilter("all");
    } else if (type === "draft") {
      setStatusFilter(statusFilter === "draft" ? "all" : "draft");
      setStockFilter("all");
    } else if (type === "low_stock") {
      setStockFilter(stockFilter === "low_stock" ? "all" : "low_stock");
      setStatusFilter("all");
    } else if (type === "out_of_stock") {
      setStockFilter(stockFilter === "out_of_stock" ? "all" : "out_of_stock");
      setStatusFilter("all");
    }
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-foreground">Products Management</h1>
            <span className="rounded-full bg-[#E8F6ED] px-2.5 py-0.5 text-xs font-semibold text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
              Live Catalog
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            Complete inventory workflow: formulation specs, multi-currency ETB/RWF pricing, multi-image upload, and
            warehouse restock.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsImportOpen(true)}
            className="h-9 gap-1.5 rounded-xl border-border/70 text-xs font-semibold px-3 hover:bg-muted cursor-pointer"
          >
            <Upload className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Import Catalog</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="h-9 gap-1.5 rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white font-medium text-xs px-3.5 shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add New Product</span>
          </Button>
        </div>
      </div>

      {/* Interactive Quick Stat Filter Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {/* Total Products */}
        <button
          type="button"
          onClick={() => handleStatFilter("all")}
          className="text-left cursor-pointer transition-all"
        >
          <Card
            className={`rounded-2xl bg-card border p-3 shadow-xs hover:border-emerald-500/50 transition-all ${
              statusFilter === "all" && stockFilter === "all"
                ? "border-emerald-600 ring-2 ring-emerald-500/20"
                : "border-border/50"
            }`}
          >
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase">Total Items</p>
                <p className="text-xl font-bold text-foreground mt-0.5">{metrics.totalProducts}</p>
              </div>
              <div className="flex size-8 items-center justify-center rounded-xl bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                <Boxes className="size-4" />
              </div>
            </CardContent>
          </Card>
        </button>

        {/* Published */}
        <button
          type="button"
          onClick={() => handleStatFilter("published")}
          className="text-left cursor-pointer transition-all"
        >
          <Card
            className={`rounded-2xl bg-card border p-3 shadow-xs hover:border-emerald-500/50 transition-all ${
              statusFilter === "published" ? "border-emerald-600 ring-2 ring-emerald-500/20" : "border-border/50"
            }`}
          >
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase">Published</p>
                <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">
                  {metrics.publishedProducts}
                </p>
              </div>
              <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="size-4" />
              </div>
            </CardContent>
          </Card>
        </button>

        {/* Drafts */}
        <button
          type="button"
          onClick={() => handleStatFilter("draft")}
          className="text-left cursor-pointer transition-all"
        >
          <Card
            className={`rounded-2xl bg-card border p-3 shadow-xs hover:border-amber-500/50 transition-all ${
              statusFilter === "draft" ? "border-amber-600 ring-2 ring-amber-500/20" : "border-border/50"
            }`}
          >
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase">Drafts</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{metrics.draftProducts}</p>
              </div>
              <div className="flex size-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <FileEdit className="size-4" />
              </div>
            </CardContent>
          </Card>
        </button>

        {/* Low Stock */}
        <button
          type="button"
          onClick={() => handleStatFilter("low_stock")}
          className="text-left cursor-pointer transition-all"
        >
          <Card
            className={`rounded-2xl bg-card border p-3 shadow-xs hover:border-amber-500/50 transition-all ${
              stockFilter === "low_stock" ? "border-amber-600 ring-2 ring-amber-500/20" : "border-border/50"
            }`}
          >
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase">Low Stock</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {metrics.lowStockProducts}
                </p>
              </div>
              <div className="flex size-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <AlertTriangle className="size-4" />
              </div>
            </CardContent>
          </Card>
        </button>

        {/* Out of Stock */}
        <button
          type="button"
          onClick={() => handleStatFilter("out_of_stock")}
          className="text-left cursor-pointer transition-all col-span-2 sm:col-span-1"
        >
          <Card
            className={`rounded-2xl bg-card border p-3 shadow-xs hover:border-rose-500/50 transition-all ${
              stockFilter === "out_of_stock" ? "border-rose-600 ring-2 ring-rose-500/20" : "border-border/50"
            }`}
          >
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase">Out of Stock</p>
                <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                  {metrics.outOfStockProducts}
                </p>
              </div>
              <div className="flex size-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                <AlertTriangle className="size-4" />
              </div>
            </CardContent>
          </Card>
        </button>
      </div>

      {/* Main Products Table & Card Grid with Toolbar */}
      <ProductsTable
        products={products}
        onAddClick={handleOpenAdd}
        onViewClick={handleOpenView}
        onEditClick={handleOpenEdit}
        onDeleteClick={handleOpenDelete}
        onToggleActive={handleToggleActive}
        onRestockClick={handleOpenRestock}
        onDuplicateClick={handleDuplicate}
        onImportClick={() => setIsImportOpen(true)}
        onBulkToggleActive={handleBulkToggleActive}
        onBulkDelete={handleBulkDelete}
        onBulkRestock={handleBulkRestock}
        onResetToDefault={resetToDefault}
        selectedStatusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        selectedStockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
      />

      {/* View Details Dialog */}
      <ProductDetailsDialog
        product={currentViewingProduct}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEditClick={handleOpenEdit}
        onToggleActive={handleToggleActive}
        onRestockClick={handleOpenRestock}
        onDuplicateClick={handleDuplicate}
        onDeleteClick={handleOpenDelete}
      />

      {/* Add / Edit Dialog */}
      <ProductFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        productToEdit={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        product={deletingProduct}
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
      />

      {/* Quick Restock Dialog */}
      <QuickRestockDialog
        product={restockingProduct}
        isOpen={isRestockOpen}
        onOpenChange={setIsRestockOpen}
        onRestock={handleRestock}
      />

      {/* Import Products Dialog */}
      <ImportProductsDialog isOpen={isImportOpen} onOpenChange={setIsImportOpen} onImport={handleImport} />
    </div>
  );
}
