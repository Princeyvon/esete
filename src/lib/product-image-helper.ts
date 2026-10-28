import type { AgroProduct } from "@/data/products";

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  Herbicides: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80",
  Insecticides: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80",
  Fungicides: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&auto=format&fit=crop&q=80",
  Fertilizers: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&auto=format&fit=crop&q=80",
  "Sprayers & PPE": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
  Seeds: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80",
};

export function getProductDisplayImage(product: AgroProduct): string {
  if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
    return product.images[0];
  }
  if (product.imageUrl && product.imageUrl.trim().length > 0) {
    return product.imageUrl;
  }
  return (
    CATEGORY_FALLBACK_IMAGES[product.category] ??
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80"
  );
}

export function getProductAllImages(product: AgroProduct): string[] {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }
  if (product.imageUrl && product.imageUrl.trim().length > 0) {
    return [product.imageUrl];
  }
  return [getProductDisplayImage(product)];
}
