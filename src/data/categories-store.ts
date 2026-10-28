"use client";

import { useEffect, useState } from "react";

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  visible: boolean;
}

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Herbicides",
    description: "Selective and non-selective weed control solutions for teff, maize, wheat, and horticultural plots.",
    visible: true,
  },
  {
    id: "cat-2",
    name: "Insecticides",
    description: "Broad-spectrum and systemic insect protection for armyworms, aphids, stalk borers, and whiteflies.",
    visible: true,
  },
  {
    id: "cat-3",
    name: "Fungicides",
    description: "Preventative and curative treatments against rust, blight, powdery mildew, and damping-off.",
    visible: true,
  },
  {
    id: "cat-4",
    name: "Fertilizers",
    description:
      "Water-soluble, granular, and foliar crop nutrition to boost vigor, root establishment, and harvest yield.",
    visible: true,
  },
  {
    id: "cat-5",
    name: "Sprayers & PPE",
    description:
      "Manual knapsack sprayers, motorized equipment, nozzles, respirators, protective gloves, and safety gear.",
    visible: true,
  },
  {
    id: "cat-6",
    name: "Seeds",
    description:
      "Certified hybrid and open-pollinated seeds for vegetables, cereals, and pulses with high germination rates.",
    visible: true,
  },
];

const STORAGE_KEY = "esete_agro_categories_catalog_v1";
const SYNC_EVENT = "esete_agro_categories_sync";

export function getStoredCategories(): CategoryItem[] {
  if (typeof window === "undefined") {
    return INITIAL_CATEGORIES;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_CATEGORIES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error("Failed to load categories from localStorage", err);
  }
  return INITIAL_CATEGORIES;
}

export function saveStoredCategories(categories: CategoryItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: categories }));
  } catch (err) {
    console.error("Failed to save categories to localStorage", err);
  }
}

export function useAgroCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCategories(getStoredCategories());
    setIsLoaded(true);

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<CategoryItem[]>;
      if (customEvent.detail) {
        setCategories(customEvent.detail);
      } else {
        setCategories(getStoredCategories());
      }
    };

    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const addCategory = (name: string, description: string): CategoryItem => {
    const id = `cat-${Date.now()}`;
    const newCategory: CategoryItem = {
      id,
      name: name.trim(),
      description: description.trim() || "Agro-input catalog category.",
      visible: true,
    };
    const updated = [...categories, newCategory];
    setCategories(updated);
    saveStoredCategories(updated);
    return newCategory;
  };

  const updateCategory = (id: string, name: string, description: string) => {
    const updated = categories.map((c) =>
      c.id === id ? { ...c, name: name.trim(), description: description.trim() } : c,
    );
    setCategories(updated);
    saveStoredCategories(updated);
  };

  const toggleCategoryVisibility = (id: string) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c));
    setCategories(updated);
    saveStoredCategories(updated);
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    saveStoredCategories(updated);
  };

  const resetToDefault = () => {
    setCategories(INITIAL_CATEGORIES);
    saveStoredCategories(INITIAL_CATEGORIES);
  };

  return {
    categories,
    isLoaded,
    addCategory,
    updateCategory,
    toggleCategoryVisibility,
    deleteCategory,
    resetToDefault,
  };
}
