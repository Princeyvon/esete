"use client";

import { useMemo, useState } from "react";

import { Edit2, Eye, EyeOff, FolderTree, LayoutGrid, Plus, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { type CategoryItem, useAgroCategories } from "@/data/categories-store";
import { useAgroProducts } from "@/data/products-store";

export default function CategoriesPage() {
  const { products } = useAgroProducts();
  const { categories, addCategory, updateCategory, toggleCategoryVisibility, deleteCategory, resetToDefault } =
    useAgroCategories();

  // Dialog State for Add / Edit Category
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [error, setError] = useState("");

  // Quick Add state on page
  const [quickName, setQuickName] = useState("");
  const [quickDesc, setQuickDesc] = useState("");

  // Compute live product counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormName("");
    setFormDescription("");
    setError("");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormDescription(cat.description);
    setError("");
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setError("Category name is required.");
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, formName, formDescription);
      toast.success(`Category renamed to "${formName.trim()}".`);
    } else {
      addCategory(formName, formDescription);
      toast.success(`Added new category "${formName.trim()}".`);
    }

    setIsDialogOpen(false);
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) {
      toast.error("Please enter a category name.");
      return;
    }
    addCategory(quickName, quickDesc);
    toast.success(`Added category "${quickName.trim()}".`);
    setQuickName("");
    setQuickDesc("");
  };

  const handleToggleVisibility = (cat: CategoryItem) => {
    toggleCategoryVisibility(cat.id);
    toast.info(`"${cat.name}" is now ${!cat.visible ? "Visible" : "Hidden"} in store catalog.`);
  };

  const handleDelete = (cat: CategoryItem) => {
    const count = categoryCounts[cat.name] || 0;
    if (count > 0) {
      toast.warning(`Notice: ${count} products currently belong to "${cat.name}". Category removed from navigation.`);
    }
    deleteCategory(cat.id);
    toast.success(`Category "${cat.name}" deleted.`);
  };

  return (
    <div className="@container/main flex flex-col gap-5 md:gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-foreground">Categories</h1>
            <span className="rounded-full bg-[#E8F6ED] px-2.5 py-0.5 text-xs font-semibold text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
              {categories.length} Categories
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            Organize catalog classifications, toggle visibility in Merkato shop, and monitor live SKU counts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Prominent Add Category Button */}
          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="h-9 gap-1.5 rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white font-medium text-xs px-4 shadow-sm"
          >
            <Plus className="size-4" />
            <span>Add Category</span>
          </Button>
        </div>
      </div>

      {/* Quick Add Banner Card */}
      <Card className="rounded-2xl bg-gradient-to-r from-[#EAF4ED] to-[#F1F8F4] dark:from-emerald-950/20 dark:to-background border border-emerald-500/20 shadow-2xs p-3 sm:p-4">
        <form onSubmit={handleQuickAdd} className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex-1 space-y-1">
            <Label htmlFor="quick-cat-name" className="text-xs font-semibold text-[#0B3B2C] dark:text-emerald-300">
              Quick Add Category
            </Label>
            <Input
              id="quick-cat-name"
              placeholder="e.g. Soil Conditioners, Micronutrients, Safety Boots"
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              className="h-9 text-xs rounded-xl bg-background/90"
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="quick-cat-desc" className="text-xs font-semibold text-muted-foreground">
              Description (optional)
            </Label>
            <Input
              id="quick-cat-desc"
              placeholder="Brief summary of items in this classification"
              value={quickDesc}
              onChange={(e) => setQuickDesc(e.target.value)}
              className="h-9 text-xs rounded-xl bg-background/90"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="h-9 rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white font-semibold text-xs px-4 gap-1.5 shrink-0"
          >
            <Plus className="size-3.5" />
            <span>Add to Catalog</span>
          </Button>
        </form>
      </Card>

      {/* Categories Card & Table */}
      <Card className="rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs p-2 sm:p-4">
        <CardHeader className="flex flex-row items-center justify-between pb-3 px-2 pt-2">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">Catalog Categories</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Live link with product catalog — {products.length} total agro-input SKUs categorized.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenAdd}
            className="h-8 gap-1.5 rounded-xl border-border/60 text-xs font-semibold"
          >
            <Plus className="size-3.5 text-emerald-600" />
            <span>Add Category</span>
          </Button>
        </CardHeader>

        <CardContent className="px-2 pb-2">
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-2xl border-dashed">
              <FolderTree className="size-8 text-muted-foreground/50 mb-2" />
              <p className="font-semibold text-sm">No categories in catalog</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Add your first agricultural classification to organize your inventory.
              </p>
              <Button onClick={handleOpenAdd} size="sm" className="bg-[#0B3B2C] text-white rounded-xl">
                <Plus className="size-3.5 mr-1.5" />
                Add Category
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <Table>
                <TableHeader className="bg-[#EAF4ED]/50 dark:bg-muted/40">
                  <TableRow>
                    <TableHead className="font-semibold text-xs py-3">Category Name</TableHead>
                    <TableHead className="font-semibold text-xs py-3">Description</TableHead>
                    <TableHead className="font-semibold text-xs py-3 text-center">Products</TableHead>
                    <TableHead className="font-semibold text-xs py-3 text-center">Visibility</TableHead>
                    <TableHead className="font-semibold text-xs py-3 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) => {
                    const count = categoryCounts[cat.name] || 0;
                    return (
                      <TableRow key={cat.id} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="py-3 font-semibold text-xs text-foreground">
                          <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-lg bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                              <LayoutGrid className="size-3.5" />
                            </span>
                            <span>{cat.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground max-w-xs truncate">
                          {cat.description}
                        </TableCell>
                        <TableCell className="py-3 text-center">
                          <Badge
                            variant="secondary"
                            className="bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold px-2"
                          >
                            {count} SKUs
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(cat)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                              cat.visible
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                            }`}
                          >
                            {cat.visible ? (
                              <>
                                <Eye className="size-3" />
                                <span>Visible</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="size-3" />
                                <span>Hidden</span>
                              </>
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(cat)}
                              className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
                              title="Edit / Rename Category"
                            >
                              <Edit2 className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(cat)}
                              className="size-7 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                              title="Delete Category"
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

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
            <span>Categories automatically sync with product catalog and creation forms.</span>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                resetToDefault();
                toast.success("Restored standard agro categories.");
              }}
              className="text-xs text-muted-foreground hover:text-foreground gap-1 p-0 h-auto"
            >
              <RotateCcw className="size-3" />
              <span>Restore Defaults</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl p-5">
          <form onSubmit={handleSave} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground">
                {editingCategory ? "Rename / Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Categories appear in the product catalog filters and the shop inventory breakdown.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-1">
              <div className="space-y-1">
                <Label htmlFor="cat-name" className="text-xs font-semibold">
                  Category Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="cat-name"
                  placeholder="e.g. Biopesticides & Biologicals"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (error) setError("");
                  }}
                  className={`h-9 text-xs rounded-xl ${error ? "border-rose-500" : ""}`}
                />
                {error && <p className="text-[11px] text-rose-500">{error}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="cat-description" className="text-xs font-semibold">
                  Description
                </Label>
                <Textarea
                  id="cat-description"
                  placeholder="Enter a description for this category..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="text-xs rounded-xl resize-none h-20"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className="h-8 rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white text-xs font-semibold px-4"
              >
                {editingCategory ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
