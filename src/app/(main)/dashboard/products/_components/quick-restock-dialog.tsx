"use client";

import { useEffect, useState } from "react";

import { Boxes, Check, Plus, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AgroProduct } from "@/data/products";

interface QuickRestockDialogProps {
  product: AgroProduct | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRestock: (productId: string, newTotalStock: number) => void;
}

const PRESET_ADDITIONS = [5, 10, 20, 50, 100];

export function QuickRestockDialog({ product, isOpen, onOpenChange, onRestock }: QuickRestockDialogProps) {
  const [addedAmount, setAddedAmount] = useState("10");

  useEffect(() => {
    if (isOpen) {
      setAddedAmount("10");
    }
  }, [isOpen]);

  if (!product) return null;

  const currentStock = product.stock;
  const parsedAddition = parseInt(addedAmount, 10) || 0;
  const newStockTotal = Math.max(0, currentStock + parsedAddition);

  const handleApplyRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAddition === 0) {
      toast.info("No stock change applied.");
      onOpenChange(false);
      return;
    }
    onRestock(product.id, newStockTotal);
    toast.success(
      `Restocked ${parsedAddition} ${product.unit} for "${product.name}". New balance: ${newStockTotal} ${product.unit}.`,
    );
    onOpenChange(false);
  };

  const isLowStock = newStockTotal > 0 && newStockTotal <= (product.minThreshold || 10);
  const isOutOfStock = newStockTotal === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl md:rounded-3xl p-5 md:p-6">
        <form onSubmit={handleApplyRestock} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                <Boxes className="size-4" />
              </span>
              <DialogTitle className="text-lg font-bold text-foreground">Quick Restock SKU</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Adjust warehouse balance for <strong>{product.name}</strong> ({product.sku}).
            </DialogDescription>
          </DialogHeader>

          {/* Current Stock vs New Stock Preview */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-muted/20 border border-border/50">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold">Current Stock</p>
              <p className="text-xl font-bold text-foreground mt-0.5">
                {currentStock} <span className="text-xs font-normal text-muted-foreground">{product.unit}</span>
              </p>
            </div>
            <div className="border-l border-border/40 pl-3">
              <p className="text-[11px] text-muted-foreground uppercase font-semibold">New Total</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
                  {newStockTotal} <span className="text-xs font-normal text-muted-foreground">{product.unit}</span>
                </p>
                {parsedAddition > 0 && (
                  <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    +{parsedAddition}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Quick Add Increments</Label>
            <div className="grid grid-cols-5 gap-1.5">
              {PRESET_ADDITIONS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAddedAmount(amt.toString())}
                  className={`rounded-xl border py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    parsedAddition === amt
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 ring-1 ring-emerald-500"
                      : "border-border/60 hover:bg-muted/40 text-foreground"
                  }`}
                >
                  +{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Addition Input */}
          <div className="space-y-1">
            <Label htmlFor="added-stock" className="text-xs font-semibold">
              Or Enter Exact Units to Add
            </Label>
            <div className="relative">
              <Input
                id="added-stock"
                type="number"
                min="1"
                placeholder="e.g. 25"
                value={addedAmount}
                onChange={(e) => setAddedAmount(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                {product.unit}
              </span>
            </div>
          </div>

          {/* Status Projection */}
          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-background border border-border/50">
            <span className="text-muted-foreground">Projected Availability:</span>
            {isOutOfStock ? (
              <span className="font-bold text-rose-600 dark:text-rose-400">Out of Stock</span>
            ) : isLowStock ? (
              <span className="font-bold text-amber-600 dark:text-amber-400">Low Stock Warning</span>
            ) : (
              <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Check className="size-3.5" />
                In Stock & Available
              </span>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white text-xs font-semibold px-4 gap-1.5 shadow-xs cursor-pointer"
            >
              <TrendingUp className="size-3.5" />
              <span>Confirm Restock</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
