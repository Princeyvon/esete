"use client";

import { useEffect, useState } from "react";

import { type AgroProduct, INITIAL_PRODUCTS } from "./products";

const STORAGE_KEY = "esete_agro_products_catalog_v1";
const SYNC_EVENT = "esete_agro_products_sync";

export function getStoredProducts(): AgroProduct[] {
  if (typeof window === "undefined") {
    return INITIAL_PRODUCTS;
  }
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (!item) return INITIAL_PRODUCTS;
    const parsed = JSON.parse(item);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error("Failed to load products from localStorage", err);
  }
  return INITIAL_PRODUCTS;
}

export function saveStoredProducts(products: AgroProduct[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: products }));
  } catch (err) {
    console.error("Failed to save products to localStorage", err);
  }
}

export function useAgroProducts() {
  const [products, setProducts] = useState<AgroProduct[]>(INITIAL_PRODUCTS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial load from storage on client mount
    setProducts(getStoredProducts());
    setIsLoaded(true);

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<AgroProduct[]>;
      if (customEvent.detail) {
        setProducts(customEvent.detail);
      } else {
        setProducts(getStoredProducts());
      }
    };

    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const addProduct = (newProduct: Omit<AgroProduct, "id">): AgroProduct => {
    const id = `prod-${Date.now()}`;
    const product: AgroProduct = { ...newProduct, id };
    setProducts((prev) => {
      const updated = [product, ...prev];
      saveStoredProducts(updated);
      return updated;
    });
    return product;
  };

  const updateProduct = (updatedProduct: AgroProduct) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      saveStoredProducts(updated);
      return updated;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      saveStoredProducts(updated);
      return updated;
    });
  };

  const toggleActive = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === productId ? { ...p, active: !p.active } : p));
      saveStoredProducts(updated);
      return updated;
    });
  };

  const adjustStock = (productId: string, newStock: number) => {
    const validStock = Math.max(0, newStock);
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== productId) return p;
        let stockStatus: AgroProduct["stockStatus"] = "in_stock";
        if (validStock === 0) stockStatus = "out_of_stock";
        else if (validStock <= (p.minThreshold || 10)) stockStatus = "low_stock";
        return {
          ...p,
          stock: validStock,
          stockStatus,
        };
      });
      saveStoredProducts(updated);
      return updated;
    });
  };

  const duplicateProduct = (productId: string): AgroProduct | null => {
    const original = products.find((p) => p.id === productId);
    if (!original) return null;
    const cloned: AgroProduct = {
      ...original,
      id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: `${original.name} (Copy)`,
      sku: `${original.sku}-CP`,
    };
    setProducts((prev) => {
      const updated = [cloned, ...prev];
      saveStoredProducts(updated);
      return updated;
    });
    return cloned;
  };

  const bulkToggleActive = (ids: string[], active: boolean) => {
    const idSet = new Set(ids);
    setProducts((prev) => {
      const updated = prev.map((p) => (idSet.has(p.id) ? { ...p, active } : p));
      saveStoredProducts(updated);
      return updated;
    });
  };

  const bulkDelete = (ids: string[]) => {
    const idSet = new Set(ids);
    setProducts((prev) => {
      const updated = prev.filter((p) => !idSet.has(p.id));
      saveStoredProducts(updated);
      return updated;
    });
  };

  const bulkRestock = (ids: string[], addedUnits: number) => {
    const idSet = new Set(ids);
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (!idSet.has(p.id)) return p;
        const newStock = Math.max(0, p.stock + addedUnits);
        let stockStatus: AgroProduct["stockStatus"] = "in_stock";
        if (newStock === 0) stockStatus = "out_of_stock";
        else if (newStock <= (p.minThreshold || 10)) stockStatus = "low_stock";
        return { ...p, stock: newStock, stockStatus };
      });
      saveStoredProducts(updated);
      return updated;
    });
  };

  const importProducts = (newItems: (Omit<AgroProduct, "id"> | AgroProduct)[]) => {
    const itemsToAdd: AgroProduct[] = newItems.map((item, index) => {
      const id = "id" in item && item.id ? item.id : `prod-${Date.now()}-${index}`;
      return { ...item, id } as AgroProduct;
    });
    setProducts((prev) => {
      const updated = [...itemsToAdd, ...prev];
      saveStoredProducts(updated);
      return updated;
    });
  };

  const resetToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    saveStoredProducts(INITIAL_PRODUCTS);
  };

  return {
    products,
    isLoaded,
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
  };
}
