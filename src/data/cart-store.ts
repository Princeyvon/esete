"use client";

import { useEffect, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  packageSize?: string;
  category?: string;
  unit?: string;
}

const STORAGE_KEY = "herbora_cart_v1";
const SYNC_EVENT = "herbora_cart_sync";

export function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: items }));
  } catch (err) {
    console.error("Failed to save cart to localStorage", err);
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setItems(getStoredCart());
    setIsLoaded(true);

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<CartItem[]>;
      if (customEvent.detail) {
        setItems(customEvent.detail);
      } else {
        setItems(getStoredCart());
      }
    };

    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const addToCart = (
    product: {
      id: string;
      name: string;
      price: number | null;
      imageUrl?: string;
      packageSize?: string;
      category?: string;
      unit?: string;
    },
    qty = 1,
  ) => {
    const unitPrice = product.price ?? 0;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + qty } : item));
      } else {
        next = [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: unitPrice,
            quantity: qty,
            imageUrl: product.imageUrl,
            packageSize: product.packageSize,
            category: product.category,
            unit: product.unit,
          },
        ];
      }
      saveStoredCart(next);
      return next;
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveStoredCart(next);
      return next;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, quantity } : item));
      saveStoredCart(next);
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    saveStoredCart([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return {
    items,
    isLoaded,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  };
}
