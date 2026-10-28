"use client";

import { useRef, useState } from "react";

import { AlertCircle, Check, Download, FileText, Loader2, Plus, Upload, X } from "lucide-react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAgroCategories } from "@/data/categories-store";
import type { AgroProduct, ProductCategory } from "@/data/products";

interface ImportProductsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (products: Omit<AgroProduct, "id">[]) => void;
}

export function ImportProductsDialog({ isOpen, onOpenChange, onImport }: ImportProductsDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedProducts, setParsedProducts] = useState<Omit<AgroProduct, "id">[]>([]);
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { categories } = useAgroCategories();
  const defaultCategory = categories[0]?.name ?? "Herbicides";

  const handleDownloadSampleCSV = () => {
    const csvContent =
      "Product Name,SKU,Category,Price ETB,Stock,Unit,Brand,Active Ingredient,Package Size\n" +
      '"Glyphosate 480 SL Herbicide","HER-101","Herbicides",1650,40,"Liters","Syngenta","Glyphosate 480 g/L SL","1L Bottle"\n' +
      '"Urea 46% Granular Fertilizer","FER-202","Fertilizers",3800,80,"Bags","Ethiopian Agro","Nitrogen 46%","50kg Bag"\n' +
      '"Mancozeb 80 WP Fungicide","FUN-303","Fungicides",1450,25,"Packets","Adama","Mancozeb 80%","1kg Packet"\n';

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "esete_agro_import_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded sample CSV template.");
  };

  const parseCSVText = (text: string): Omit<AgroProduct, "id">[] => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length < 2) return [];

    // Parse CSV line taking quotes into account
    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim().replace(/^["']|["']$/g, ""));
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^["']|["']$/g, ""));
      return result;
    };

    const header = parseLine(lines[0]).map((h) => h.toLowerCase());
    const nameIdx = header.findIndex((h) => h.includes("name") || h.includes("product"));
    const skuIdx = header.findIndex((h) => h.includes("sku") || h.includes("code"));
    const catIdx = header.findIndex((h) => h.includes("cat"));
    const priceIdx = header.findIndex((h) => h.includes("price") || h.includes("etb"));
    const stockIdx = header.findIndex((h) => h.includes("stock") || h.includes("qty") || h.includes("quantity"));
    const unitIdx = header.findIndex((h) => h.includes("unit"));
    const brandIdx = header.findIndex((h) => h.includes("brand") || h.includes("maker"));
    const ingredientIdx = header.findIndex((h) => h.includes("ingredient") || h.includes("active"));
    const sizeIdx = header.findIndex((h) => h.includes("size") || h.includes("pack"));

    const items: Omit<AgroProduct, "id">[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseLine(lines[i]);
      if (cols.length === 0 || !cols[nameIdx >= 0 ? nameIdx : 0]) continue;

      const name = cols[nameIdx >= 0 ? nameIdx : 0] || "Unnamed Input";
      const sku = (skuIdx >= 0 && cols[skuIdx]) || `IMP-${Math.floor(100 + Math.random() * 900)}`;
      const cat = (catIdx >= 0 && cols[catIdx]) || defaultCategory;
      const priceStr = priceIdx >= 0 ? cols[priceIdx] : "";
      const parsedPrice = priceStr ? parseFloat(priceStr.replace(/[^0-9.]/g, "")) : null;
      const stockStr = stockIdx >= 0 ? cols[stockIdx] : "20";
      const stock = parseInt(stockStr.replace(/[^0-9]/g, ""), 10) || 20;
      const unit = (unitIdx >= 0 && cols[unitIdx]) || "Units";
      const brand = (brandIdx >= 0 && cols[brandIdx]) || "Esete Agro";
      const activeIngredient = (ingredientIdx >= 0 && cols[ingredientIdx]) || "";
      const packageSize = (sizeIdx >= 0 && cols[sizeIdx]) || "1 Unit";

      let stockStatus: AgroProduct["stockStatus"] = "in_stock";
      if (stock === 0) stockStatus = "out_of_stock";
      else if (stock <= 10) stockStatus = "low_stock";

      items.push({
        name,
        sku,
        category: cat as ProductCategory,
        brand,
        activeIngredient,
        packageSize,
        unit,
        price: parsedPrice && !Number.isNaN(parsedPrice) ? parsedPrice : null,
        showPrice: parsedPrice !== null,
        stock,
        minThreshold: 10,
        stockStatus,
        status: "published",
        active: true,
        featured: false,
        shortDescription: `${name} supplied by ${brand}.`,
        fullDescription: `${name} (${activeIngredient}) for professional farm application in Merkato Gojam Berenda.`,
        description: `${name} supplied by ${brand}.`,
        imageUrl: "",
        images: [],
      });
    }

    return items;
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);
    try {
      const text = await file.text();
      let products: Omit<AgroProduct, "id">[] = [];

      if (file.name.endsWith(".json")) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          products = parsed.map((p) => ({
            name: p.name || "Imported Product",
            sku: p.sku || `IMP-${Math.floor(100 + Math.random() * 900)}`,
            category: p.category || defaultCategory,
            brand: p.brand || "Esete Agro",
            activeIngredient: p.activeIngredient || "",
            packageSize: p.packageSize || "1 Unit",
            unit: p.unit || "Units",
            price: typeof p.price === "number" ? p.price : null,
            showPrice: p.showPrice !== false,
            stock: typeof p.stock === "number" ? p.stock : 20,
            minThreshold: p.minThreshold || 10,
            stockStatus: p.stockStatus || "in_stock",
            status: p.status || "published",
            active: p.active !== false,
            featured: Boolean(p.featured),
            shortDescription: p.shortDescription || p.description || "",
            fullDescription: p.fullDescription || p.description || "",
            description: p.description || "",
            imageUrl: p.imageUrl || "",
            images: Array.isArray(p.images) ? p.images : [],
          }));
        }
      } else {
        // Assume CSV
        products = parseCSVText(text);
      }

      if (products.length === 0) {
        toast.error("No valid product records found in file. Please check format.");
      } else {
        setParsedProducts(products);
        toast.success(`Successfully parsed ${products.length} products from ${file.name}.`);
      }
    } catch (err) {
      console.error("Import parsing error", err);
      toast.error("Failed to parse file. Make sure it is valid CSV or JSON.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processFile(file);
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void processFile(file);
    }
  };

  const handleConfirmImport = () => {
    if (parsedProducts.length === 0) return;
    onImport(parsedProducts);
    toast.success(`Imported ${parsedProducts.length} products to Esete Agro inventory!`);
    onOpenChange(false);
    setParsedProducts([]);
    setFileName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl md:rounded-3xl p-5 md:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#E8F6ED] text-[#0B8A5A] dark:bg-emerald-950/40 dark:text-emerald-300">
                <Upload className="size-4" />
              </span>
              <DialogTitle className="text-xl font-bold text-foreground">Import Catalog Products</DialogTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadSampleCSV}
              className="h-8 text-xs rounded-xl gap-1.5 cursor-pointer"
            >
              <Download className="size-3 text-emerald-600" />
              <span>Sample CSV Template</span>
            </Button>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Upload CSV or JSON inventory spreadsheet to quickly import agro-chemicals, fertilizers, and equipment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Upload Drop Area */}
          <button
            type="button"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
              isDragging
                ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40"
                : "border-border/70 hover:border-emerald-500/60 bg-muted/20 hover:bg-muted/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,text/csv,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <Loader2 className="size-8 text-emerald-600 animate-spin" />
                <p className="text-xs font-semibold text-foreground">Parsing inventory data...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 py-1">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-[#0B8A5A] dark:bg-emerald-950 dark:text-emerald-300 mb-1">
                  <Upload className="size-5" />
                </div>
                <p className="text-xs font-bold text-foreground">
                  {fileName ? `File selected: ${fileName}` : "Click to select CSV/JSON file or drag & drop"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Supports columns: Product Name, SKU, Category, Price, Stock, Unit, Brand, Active Ingredient
                </p>
              </div>
            )}
          </button>

          {/* Parsed Preview Table */}
          {parsedProducts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">Parsed Products Preview</span>
                  <Badge className="bg-[#0B3B2C] text-white text-[10px]">{parsedProducts.length} SKUs Ready</Badge>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setParsedProducts([]);
                    setFileName("");
                  }}
                  className="h-7 text-xs text-rose-500 hover:text-rose-700"
                >
                  Clear
                </Button>
              </div>

              <div className="max-h-56 overflow-y-auto rounded-xl border border-border/60">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 text-[11px]">
                      <TableHead className="py-2">SKU</TableHead>
                      <TableHead className="py-2">Product Name</TableHead>
                      <TableHead className="py-2">Category</TableHead>
                      <TableHead className="py-2">Price (ETB)</TableHead>
                      <TableHead className="py-2">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedProducts.slice(0, 10).map((p, idx) => (
                      <TableRow key={idx} className="text-xs">
                        <TableCell className="font-mono text-[10px] font-semibold">{p.sku}</TableCell>
                        <TableCell className="font-medium max-w-[180px] truncate">{p.name}</TableCell>
                        <TableCell className="text-[11px]">{p.category}</TableCell>
                        <TableCell className="font-semibold text-emerald-800 dark:text-emerald-300">
                          {p.price !== null ? `ETB ${p.price.toLocaleString("en-US")}` : "Contact"}
                        </TableCell>
                        <TableCell>
                          {p.stock} {p.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {parsedProducts.length > 10 && (
                <p className="text-[11px] text-muted-foreground italic text-center">
                  Showing first 10 of {parsedProducts.length} items to import.
                </p>
              )}
            </div>
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
            type="button"
            size="sm"
            onClick={handleConfirmImport}
            disabled={parsedProducts.length === 0}
            className="h-9 rounded-xl bg-[#0B3B2C] hover:bg-[#134636] text-white text-xs font-semibold px-4 gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Import {parsedProducts.length} Products</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
