"use client";

import { AlertTriangle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { AgroProduct } from "@/data/products";

interface DeleteConfirmDialogProps {
  product: AgroProduct | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (product: AgroProduct) => void;
}

export function DeleteConfirmDialog({ product, isOpen, onOpenChange, onConfirm }: DeleteConfirmDialogProps) {
  if (!product) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl max-w-md bg-card border-border/80">
        <AlertDialogHeader className="gap-2">
          <div className="flex size-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="size-5" />
          </div>
          <AlertDialogTitle className="text-lg font-bold text-foreground">Delete Product?</AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-foreground">&quot;{product.name}&quot;</span> ({product.sku})? This
            product will be removed from the catalog and inventory records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 gap-2 sm:gap-2">
          <AlertDialogCancel className="rounded-xl text-xs h-9">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(product)}
            className="rounded-xl text-xs h-9 bg-rose-600 hover:bg-rose-700 text-white font-medium"
          >
            Delete Product
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
