"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Image from "next/image";

import {
  Check,
  CheckCircle2,
  Coins,
  Copy,
  Edit2,
  Image as ImageIcon,
  Layers,
  Loader2,
  Package,
  Plus,
  RotateCcw,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAgroCategories } from "@/data/categories-store";
import { useCurrency } from "@/data/currency-store";
import {
  type AgroProduct,
  CATEGORIES as DEFAULT_CATEGORIES,
  type ProductCategory,
  type ProductStatus,
  type ProductStockStatus,
} from "@/data/products";

interface ProductFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productToEdit: AgroProduct | null;
  onSave: (productData: Omit<AgroProduct, "id">, existingId?: string) => void;
}

const MAX_IMAGES = 6;

// Preset Agro Stock Images categorized for quick assignment
const PRESET_AGRO_IMAGES = [
  // Herbicides
  {
    name: "Selective Herbicide Jug (2,4-D)",
    category: "Herbicides",
    url: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Non-Selective Weedkiller",
    category: "Herbicides",
    url: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Crop Foliar Weed Spray",
    category: "Herbicides",
    url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80",
  },
  // Insecticides
  {
    name: "Broad-Spectrum Insecticide",
    category: "Insecticides",
    url: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Aphid & Borer Protection Spray",
    category: "Insecticides",
    url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80",
  },
  // Fungicides
  {
    name: "Rust & Blight Foliar Protectant",
    category: "Fungicides",
    url: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Systemic Copper Fungicide",
    category: "Fungicides",
    url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80",
  },
  // Fertilizers
  {
    name: "NPK Granular Fertilizer (50kg)",
    category: "Fertilizers",
    url: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Urea 46% Nitrogen Bag",
    category: "Fertilizers",
    url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Liquid Foliar Micronutrient",
    category: "Fertilizers",
    url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
  },
  // Seeds
  {
    name: "Certified Hybrid Seed Bag",
    category: "Seeds & Planting",
    url: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "High-Yield Cereal & Pulse Variety",
    category: "Seeds & Planting",
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
  },
  // Sprayers & Equipment
  {
    name: "16L Manual Knapsack Sprayer",
    category: "Sprayers & Equipment",
    url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "High-Pressure Spray Lance",
    category: "Sprayers & Equipment",
    url: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80",
  },
];

/**
 * Resizes and compresses an uploaded image file before storing as data URL
 * to avoid exceeding browser localStorage quotas and maintain smooth rendering.
 */
function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX_DIM = 960;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ProductFormDialog({ isOpen, onOpenChange, productToEdit, onSave }: ProductFormDialogProps) {
  const isEditing = Boolean(productToEdit);
  const { categories, addCategory } = useAgroCategories();
  const { currency, rate } = useCurrency();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active categories list
  const availableCategories = useMemo(() => {
    return categories.length > 0 ? categories.map((c) => c.name) : DEFAULT_CATEGORIES;
  }, [categories]);

  // Form State
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState<string>("Herbicides");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [brand, setBrand] = useState("");
  const [activeIngredient, setActiveIngredient] = useState("");
  const [packageSize, setPackageSize] = useState("");
  const [unit, setUnit] = useState("Liters");
  const [stock, setStock] = useState("20");
  const [minThreshold, setMinThreshold] = useState("10");
  const [price, setPrice] = useState("1500");
  const [showPrice, setShowPrice] = useState(true);
  const [status, setStatus] = useState<ProductStatus>("published");
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");

  // Product Images State (up to 6 images)
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [presetCategoryFilter, setPresetCategoryFilter] = useState<string>("All");
  const [showPresetsLibrary, setShowPresetsLibrary] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset or populate form ONLY when dialog opens or productToEdit changes
  useEffect(() => {
    if (!isOpen) return;

    if (productToEdit) {
      setName(productToEdit.name);
      setSku(productToEdit.sku);
      setCategory(productToEdit.category);
      setIsCustomCategory(Boolean(productToEdit.category && !availableCategories.includes(productToEdit.category)));
      setBrand(productToEdit.brand || "");
      setActiveIngredient(productToEdit.activeIngredient || "");
      setPackageSize(productToEdit.packageSize || "");
      setUnit(productToEdit.unit || "Liters");
      setStock(productToEdit.stock.toString());
      setMinThreshold((productToEdit.minThreshold || 10).toString());
      setPrice(productToEdit.price !== null && productToEdit.price !== undefined ? productToEdit.price.toString() : "");
      setShowPrice(productToEdit.showPrice ?? productToEdit.price !== null);
      setStatus(productToEdit.status);
      setActive(productToEdit.active);
      setFeatured(productToEdit.featured || false);
      setShortDescription(productToEdit.shortDescription || productToEdit.description || "");
      setFullDescription(productToEdit.fullDescription || productToEdit.description || "");

      // Handle images array & legacy imageUrl
      const loadedImages: string[] = [];
      if (Array.isArray(productToEdit.images) && productToEdit.images.length > 0) {
        loadedImages.push(...productToEdit.images);
      } else if (productToEdit.imageUrl) {
        loadedImages.push(productToEdit.imageUrl);
      }
      setImages(loadedImages.slice(0, MAX_IMAGES));
    } else {
      // Default initial state for adding a new product
      setName("");
      setSku(`AGR-${Math.floor(100 + Math.random() * 900)}`);
      setCategory(availableCategories[0] || "Herbicides");
      setIsCustomCategory(false);
      setBrand("Esete Agro");
      setActiveIngredient("");
      setPackageSize("1L Bottle");
      setUnit("Liters");
      setStock("25");
      setMinThreshold("10");
      setPrice("1850");
      setShowPrice(true);
      setStatus("published");
      setActive(true);
      setFeatured(false);
      setShortDescription("");
      setFullDescription("");
      setImages([]);
    }
    setImageUrlInput("");
    setErrors({});
    setIsDraggingOver(false);
    setShowPresetsLibrary(false);
  }, [isOpen, productToEdit, availableCategories]);

  // Process and append files safely
  const processAndAddFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      if (images.length >= MAX_IMAGES) {
        toast.error(`Maximum of ${MAX_IMAGES} images reached. Remove an image to add more.`);
        return;
      }

      setIsProcessingImage(true);
      const remainingSlots = MAX_IMAGES - images.length;
      const filesToProcess = fileArray.slice(0, remainingSlots);

      try {
        const processedImages: string[] = [];
        for (const file of filesToProcess) {
          if (!file.type.startsWith("image/")) {
            toast.error(`"${file.name}" is not a recognized image format.`);
            continue;
          }
          const compressed = await compressImageFile(file);
          processedImages.push(compressed);
        }

        if (processedImages.length > 0) {
          setImages((prev) => [...prev, ...processedImages].slice(0, MAX_IMAGES));
          setErrors((prev) => ({ ...prev, images: "" }));
          toast.success(`Added ${processedImages.length} image${processedImages.length === 1 ? "" : "s"}.`);
        }
      } catch (err) {
        console.error("Image processing error", err);
        toast.error("Failed to read image file. Please try another image.");
      } finally {
        setIsProcessingImage(false);
      }
    },
    [images.length],
  );

  // Handle local image file upload preview
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      void processAndAddFiles(e.target.files);
      e.target.value = "";
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      void processAndAddFiles(e.dataTransfer.files);
    }
  };

  // Clipboard paste support (Ctrl+V / Cmd+V)
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) imageFiles.push(file);
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault();
      void processAndAddFiles(imageFiles);
    }
  };

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    if (images.length >= MAX_IMAGES) {
      toast.error(`Maximum of ${MAX_IMAGES} images reached.`);
      return;
    }
    setImages((prev) => [...prev, url]);
    setImageUrlInput("");
    setErrors((prev) => ({ ...prev, images: "" }));
    toast.success("Image URL added to catalog photos.");
  };

  const handleAddPresetImage = (url: string, name: string) => {
    if (images.length >= MAX_IMAGES) {
      toast.error(`Maximum of ${MAX_IMAGES} images reached.`);
      return;
    }
    setImages((prev) => [...prev, url]);
    setErrors((prev) => ({ ...prev, images: "" }));
    toast.success(`Added sample photo: "${name}"`);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
    toast.info("Selected photo set as Primary Catalog Display.");
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Product name is required.";
    }

    if (!category) {
      newErrors.category = "Category is required.";
    }

    if (price.trim() !== "") {
      const num = Number(price);
      if (Number.isNaN(num) || num < 0) {
        newErrors.price = "Price must be a valid positive number or left empty.";
      }
    }

    const stockNum = parseInt(stock, 10);
    if (stock.trim() === "" || Number.isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = "Quantity must be a positive integer or 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please correct highlighted fields before saving.");
      return;
    }

    const parsedStock = parseInt(stock, 10) || 0;
    const parsedMin = parseInt(minThreshold, 10) || 10;
    const parsedPrice = price.trim() === "" ? null : parseFloat(price);

    let stockStatus: ProductStockStatus = "in_stock";
    if (parsedStock === 0) {
      stockStatus = "out_of_stock";
    } else if (parsedStock <= parsedMin) {
      stockStatus = "low_stock";
    }

    const finalCategory = category.trim();
    if (finalCategory && !availableCategories.includes(finalCategory)) {
      addCategory(finalCategory, `Catalog category for ${finalCategory}`);
    }

    const productPayload: Omit<AgroProduct, "id"> = {
      name: name.trim(),
      sku: sku.trim() || `AGR-${Date.now().toString().slice(-4)}`,
      category: (finalCategory || "Herbicides") as ProductCategory,
      brand: brand.trim() || "Esete Agro",
      activeIngredient: activeIngredient.trim(),
      packageSize: packageSize.trim() || "1 Unit",
      unit: unit.trim() || "Units",
      stock: parsedStock,
      minThreshold: parsedMin,
      stockStatus,
      status,
      active,
      featured,
      showPrice,
      price: parsedPrice,
      shortDescription: shortDescription.trim() || fullDescription.trim().slice(0, 100),
      fullDescription: fullDescription.trim(),
      description:
        shortDescription.trim() || fullDescription.trim() || `Catalog item for ${finalCategory || "Herbicides"}`,
      imageUrl: images[0] ?? "",
      images: images,
    };

    onSave(productPayload, productToEdit ? productToEdit.id : undefined);
    onOpenChange(false);
  };

  // Converted price preview calculation
  const numericPrice = parseFloat(price);
  const convertedRwf = !Number.isNaN(numericPrice) ? Math.round(numericPrice * rate) : null;

  // Filtered preset images for sample selector
  const filteredPresets = useMemo(() => {
    if (presetCategoryFilter === "All") return PRESET_AGRO_IMAGES;
    return PRESET_AGRO_IMAGES.filter((p) => p.category.toLowerCase().includes(presetCategoryFilter.toLowerCase()));
  }, [presetCategoryFilter]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onPaste={handlePaste}
        className="max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl md:rounded-3xl p-5 md:p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                  {isEditing ? <Edit2 className="size-4" /> : <Sparkles className="size-4" />}
                </span>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {isEditing ? `Edit: ${productToEdit?.name}` : "Add New Agro Product"}
                </DialogTitle>
              </div>
              <Badge
                className={
                  isEditing
                    ? "bg-[#0B3B2C] text-white hover:bg-[#0B3B2C]"
                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                }
              >
                {isEditing ? "Editing Mode" : "New SKU"}
              </Badge>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              {isEditing
                ? `Update catalog details, product images, inventory levels, and specifications for ${productToEdit?.name}`
                : "Register a new agricultural chemical, fertilizer, seed variety, or spraying equipment in the catalog."}
            </DialogDescription>
          </DialogHeader>

          {/* Section 1: Basic Info */}
          <div className="space-y-3 rounded-2xl bg-muted/20 p-3.5 border border-border/50">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">Product Identification</h4>
              {isEditing && (
                <span className="text-[11px] font-mono text-muted-foreground">ID: {productToEdit?.id}</span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="product-name" className="text-xs font-semibold">
                  Product Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="product-name"
                  placeholder="e.g. 2,4-D Amine 720g/L Selective Herbicide"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className={`h-9 text-xs rounded-xl ${errors.name ? "border-rose-500" : ""}`}
                />
                {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="product-sku" className="text-xs font-semibold">
                  SKU / Product Code
                </Label>
                <Input
                  id="product-sku"
                  placeholder="e.g. HER-001"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="h-9 text-xs rounded-xl font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="product-category" className="text-xs font-semibold">
                    Category <span className="text-rose-500">*</span>
                  </Label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory((prev) => !prev)}
                    className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    {isCustomCategory ? "Pick from List" : "+ Custom Category"}
                  </button>
                </div>
                {isCustomCategory ? (
                  <Input
                    id="product-category-custom"
                    placeholder="Enter category name..."
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
                    }}
                    className={`h-9 text-xs rounded-xl ${errors.category ? "border-rose-500" : ""}`}
                  />
                ) : (
                  <Select value={category} onValueChange={(val) => setCategory(val)}>
                    <SelectTrigger id="product-category" className="h-9 text-xs rounded-xl">
                      <SelectValue placeholder="Select Category">{category || "Select Category"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {availableCategories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-xs">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.category && <p className="text-[11px] text-rose-500">{errors.category}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="product-brand" className="text-xs">
                  Manufacturer / Brand
                </Label>
                <Input
                  id="product-brand"
                  placeholder="e.g. Adama, Syngenta, Bayer, Esete Agro"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="product-ingredient" className="text-xs">
                Active Ingredient / Technical Composition
              </Label>
              <Input
                id="product-ingredient"
                placeholder="e.g. 2,4-D Dimethylamine salt 720 g/L SL"
                value={activeIngredient}
                onChange={(e) => setActiveIngredient(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Section 2: Product Images (Up to 6 images) */}
          <div className="space-y-3 rounded-2xl bg-muted/20 p-3.5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="size-3.5 text-emerald-600" />
                  <span>
                    Product Images ({images.length}/{MAX_IMAGES})
                  </span>
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Upload photos, drag & drop, paste from clipboard, or pick sample agro visuals.
                </p>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  images.length === MAX_IMAGES ? "border-amber-500 text-amber-600 font-semibold" : "border-border/60"
                }`}
              >
                {images.length === MAX_IMAGES ? `${MAX_IMAGES} of ${MAX_IMAGES} (Max)` : `${images.length} added`}
              </Badge>
            </div>

            {/* Thumbnail Gallery (Up to 6) */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                {images.map((img, idx) => (
                  <div
                    key={`img-${idx}-${img.slice(0, 20)}`}
                    className="relative group rounded-xl border border-border/60 overflow-hidden bg-background p-1 aspect-square flex flex-col justify-between shadow-2xs"
                  >
                    <div className="relative w-full h-full rounded-lg overflow-hidden bg-muted/40">
                      <Image
                        src={img}
                        alt={`Product image ${idx + 1}`}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                        unoptimized={img.startsWith("data:")}
                      />
                    </div>

                    {/* Primary badge or Set Primary button */}
                    {idx === 0 ? (
                      <span className="absolute top-1.5 left-1.5 flex items-center gap-0.5 rounded-md bg-[#0B3B2C] text-white px-1.5 py-0.5 text-[9px] font-bold shadow-xs">
                        <Star className="size-2 fill-amber-300 text-amber-300" />
                        Main
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        className="absolute top-1.5 left-1.5 rounded-md bg-background/90 hover:bg-background text-foreground px-1.5 py-0.5 text-[9px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity border border-border/50 shadow-xs cursor-pointer"
                      >
                        Set Main
                      </button>
                    )}

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 rounded-md bg-rose-600 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs hover:bg-rose-700 cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Drag and Drop Zone & Upload Controls */}
            {images.length < MAX_IMAGES ? (
              <div className="space-y-2.5 pt-1">
                {/* Drag & Drop Area */}
                <button
                  type="button"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
                    isDraggingOver
                      ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40"
                      : "border-border/70 hover:border-emerald-500/60 bg-background/50 hover:bg-muted/20"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    multiple
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  {isProcessingImage ? (
                    <div className="flex flex-col items-center gap-1.5 py-1">
                      <Loader2 className="size-6 text-emerald-600 animate-spin" />
                      <p className="text-xs font-semibold text-foreground">Optimizing and attaching image...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 py-1">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-[#0B8A5A] dark:bg-emerald-950 dark:text-emerald-300 mb-1">
                        <Upload className="size-4" />
                      </div>
                      <p className="text-xs font-semibold text-foreground">Click to browse or drop images here</p>
                      <p className="text-[11px] text-muted-foreground">
                        PNG, JPG, WebP up to 5MB • Tip: You can also paste copied images (Ctrl+V)
                      </p>
                    </div>
                  )}
                </button>

                {/* External Image URL Row */}
                <div className="flex items-center gap-1.5">
                  <Input
                    placeholder="Or paste external image URL (https://...)..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                    className="h-9 text-xs rounded-xl flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddImageUrl}
                    disabled={!imageUrlInput.trim()}
                    className="h-9 rounded-xl text-xs px-3 font-semibold cursor-pointer shrink-0"
                  >
                    Add URL
                  </Button>
                </div>

                {/* Preset Agro Visuals Toggle */}
                <div className="pt-1 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowPresetsLibrary((prev) => !prev)}
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Layers className="size-3" />
                      <span>
                        {showPresetsLibrary ? "Hide Agro Stock Photo Library" : "Browse Agro Stock Photo Library"}
                      </span>
                    </button>
                    <span className="text-[10px] text-muted-foreground">Ready-to-use input visuals</span>
                  </div>

                  {showPresetsLibrary && (
                    <div className="mt-2.5 p-3 rounded-xl border border-border/60 bg-background space-y-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {["All", "Herbicides", "Insecticides", "Fungicides", "Fertilizers", "Seeds", "Equipment"].map(
                          (cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setPresetCategoryFilter(cat)}
                              className={`rounded-lg px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                                presetCategoryFilter === cat
                                  ? "bg-[#0B3B2C] text-white"
                                  : "bg-muted text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {cat}
                            </button>
                          ),
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 max-h-44 overflow-y-auto pr-1">
                        {filteredPresets.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => handleAddPresetImage(preset.url, preset.name)}
                            className="flex items-center gap-2 p-1.5 rounded-lg border border-border/60 hover:border-emerald-500 bg-muted/20 hover:bg-emerald-50/40 text-left cursor-pointer transition-all"
                          >
                            <div className="relative size-9 rounded-md overflow-hidden bg-muted shrink-0">
                              <Image
                                src={preset.url}
                                alt={preset.name}
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-foreground truncate">{preset.name}</p>
                              <p className="text-[9px] text-muted-foreground">{preset.category}</p>
                            </div>
                            <Plus className="size-3 text-emerald-600 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground italic text-center py-1">
                Maximum {MAX_IMAGES} images added. To replace or add another image, remove one above.
              </p>
            )}

            {errors.images && <p className="text-[11px] text-rose-500">{errors.images}</p>}
          </div>

          {/* Section 3: Pricing & Multi-Currency */}
          <div className="space-y-3 rounded-2xl bg-muted/20 p-3.5 border border-border/50">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                Pricing & Multi-Currency ({currency})
              </h4>
              <div className="flex items-center gap-2">
                <Label htmlFor="show-price" className="text-xs cursor-pointer">
                  Publicly Show Price
                </Label>
                <Switch
                  id="show-price"
                  checked={showPrice}
                  onCheckedChange={setShowPrice}
                  className="data-[state=checked]:bg-[#0B3B2C] data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700 cursor-pointer [&>span]:data-[state=checked]:translate-x-[14px] [&>span]:data-[state=unchecked]:translate-x-0.5 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="product-price" className="text-xs font-semibold">
                  Price in Base ETB (Ethiopian Birr)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    ETB
                  </span>
                  <Input
                    id="product-price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Leave empty for 'Contact us for price'"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
                    }}
                    className={`h-9 pl-12 text-xs rounded-xl ${errors.price ? "border-rose-500" : ""}`}
                  />
                </div>
                {errors.price && <p className="text-[11px] text-rose-500">{errors.price}</p>}
              </div>

              {/* Live Converted Price in RWF */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Coins className="size-3 text-emerald-600" />
                  <span>Converted RWF (at 1 ETB = {rate} RWF)</span>
                </Label>
                <div className="h-9 rounded-xl border border-border/60 bg-background/60 px-3 flex items-center text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  {convertedRwf !== null ? `RWF ${convertedRwf.toLocaleString("en-US")}` : "Contact us for price"}
                </div>
              </div>
            </div>

            {!showPrice && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg">
                Notice: When &apos;Publicly Show Price&apos; is off, customers will see &apos;Contact us for
                price&apos;.
              </p>
            )}
          </div>

          {/* Section 4: Inventory & Packaging */}
          <div className="space-y-3 rounded-2xl bg-muted/20 p-3.5 border border-border/50">
            <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">Inventory & Packaging</h4>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="space-y-1">
                <Label htmlFor="product-stock" className="text-xs font-semibold">
                  In Stock Units <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="product-stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => {
                    setStock(e.target.value);
                    if (errors.stock) setErrors((prev) => ({ ...prev, stock: "" }));
                  }}
                  className={`h-9 text-xs rounded-xl ${errors.stock ? "border-rose-500" : ""}`}
                />
                {errors.stock && <p className="text-[11px] text-rose-500">{errors.stock}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="product-min-threshold" className="text-xs">
                  Low Stock Alert At
                </Label>
                <Input
                  id="product-min-threshold"
                  type="number"
                  min="0"
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="product-package-size" className="text-xs">
                  Package Size
                </Label>
                <Input
                  id="product-package-size"
                  placeholder="e.g. 1L Bottle, 25kg Sack"
                  value={packageSize}
                  onChange={(e) => setPackageSize(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="product-unit" className="text-xs">
                  Inventory Unit
                </Label>
                <Input
                  id="product-unit"
                  placeholder="e.g. Liters, Bags, Units"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Status & Visibility */}
          <div className="space-y-3 rounded-2xl bg-muted/20 p-3.5 border border-border/50">
            <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">
              Catalog Status & Visibility
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="product-status" className="text-xs font-semibold">
                  Publishing Status
                </Label>
                <Select value={status} onValueChange={(val: ProductStatus) => setStatus(val)}>
                  <SelectTrigger id="product-status" className="h-9 text-xs rounded-xl capitalize">
                    <SelectValue placeholder="Status">{status}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="published" className="text-xs">
                      Published (Live)
                    </SelectItem>
                    <SelectItem value="draft" className="text-xs">
                      Draft (Work in Progress)
                    </SelectItem>
                    <SelectItem value="archived" className="text-xs">
                      Archived (Hidden)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-2.5">
                <div className="space-y-0.5">
                  <Label htmlFor="product-active" className="text-xs font-semibold cursor-pointer">
                    Active in Store
                  </Label>
                  <p className="text-[10px] text-muted-foreground">Available for farm orders</p>
                </div>
                <Switch
                  id="product-active"
                  checked={active}
                  onCheckedChange={setActive}
                  className="data-[state=checked]:bg-[#0B3B2C] data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700 cursor-pointer [&>span]:data-[state=checked]:translate-x-[14px] [&>span]:data-[state=unchecked]:translate-x-0.5 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-2.5">
                <div className="space-y-0.5">
                  <Label htmlFor="product-featured" className="text-xs font-semibold cursor-pointer">
                    Featured Item
                  </Label>
                  <p className="text-[10px] text-muted-foreground">Top recommendation</p>
                </div>
                <Switch
                  id="product-featured"
                  checked={featured}
                  onCheckedChange={setFeatured}
                  className="data-[state=checked]:bg-[#0B3B2C] data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700 cursor-pointer [&>span]:data-[state=checked]:translate-x-[14px] [&>span]:data-[state=unchecked]:translate-x-0.5 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Descriptions */}
          <div className="space-y-3 rounded-2xl bg-muted/20 p-3.5 border border-border/50">
            <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">Descriptions & Usage</h4>

            <div className="space-y-1">
              <Label htmlFor="short-desc" className="text-xs">
                Short Description (Summary)
              </Label>
              <Input
                id="short-desc"
                placeholder="Brief one-line summary for catalog cards"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="full-desc" className="text-xs">
                Full Technical Description & Recommended Dosage
              </Label>
              <Textarea
                id="full-desc"
                placeholder="Detailed application guidelines, target weeds/pests, water volume ratio, and safety intervals..."
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                className="text-xs rounded-xl resize-none h-20"
              />
            </div>
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
              className="h-9 rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white text-xs font-semibold px-5 shadow-xs cursor-pointer gap-1.5"
            >
              {isEditing ? <Edit2 className="size-3.5" /> : <Plus className="size-3.5" />}
              <span>{isEditing ? "Save Product Changes" : "Create Agro Product"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
