import { useState } from "react";
import { useSelector } from "react-redux";
import { Product, ProductFormData } from "@/redux/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronsUpDown, Check, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BasicInfoTabProps {
  product: Product | null;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export default function BasicInfoTab({ product, formData, setFormData }: BasicInfoTabProps) {
  const { manufacturers = [] } = useSelector((state: any) => state.manufacturers);
  const { categories = [] } = useSelector((state: any) => state.categories);
  
  // Filter only active manufacturers and categories
  const activeManufacturers = (manufacturers || []).filter((m: any) => m && m.status === 1);
  const activeCategories = (categories || []).filter((c: any) => c && c.status === 1);
  
  const [manufacturerOpen, setManufacturerOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Read-only Info */}
      {product && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Price w/o VAT</Label>
                <p className="font-semibold">AED {product.price_without_vat}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Stock</Label>
                <p className="font-semibold">{product.available_stock}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Stock Status</Label>
                <Badge variant="outline">{product.stock_status}</Badge>
              </div>
              <div>
                <Label className="text-muted-foreground">SKU</Label>
                <p className="font-mono text-xs">{product.sku || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {product && product.sku && product.sku !== `444${product.dynamic_code}` && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>SKU not mapped with dynamic ID. Expected: 444{product.dynamic_code}, Current: {product.sku}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFormData({ ...formData, generateSku: true })}
            >
              Fix SKU
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="product_name">Product Name *</Label>
          <Input
            id="product_name"
            value={formData.product_name}
            onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
            required
            minLength={3}
          />
        </div>
        {product ? (
          <div>
            <Label htmlFor="price">Price (AED) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              disabled
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="price_without_vat">Price without VAT (AED) *</Label>
            <Input
              id="price_without_vat"
              type="number"
              step="0.01"
              min="0"
              value={formData.price_without_vat}
              onChange={(e) => setFormData({ ...formData, price_without_vat: e.target.value })}
              required
            />
          </div>
        )}
      </div>

      {!product && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vat">VAT (%)</Label>
            <Input
              id="vat"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.vat}
              onChange={(e) => setFormData({ ...formData, vat: e.target.value })}
              placeholder="Leave empty for no VAT"
            />
          </div>
          <div>
            <Label htmlFor="dynamic_code">Dynamic Code</Label>
            <Input
              id="dynamic_code"
              value={formData.dynamic_code}
              onChange={(e) => setFormData({ ...formData, dynamic_code: e.target.value })}
              placeholder="Will generate SKU as 444 + this code"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="upc">UPC (e.g., 30 ml, 20 tab)</Label>
          <Input
            id="upc"
            value={formData.upc}
            onChange={(e) => setFormData({ ...formData, upc: e.target.value })}
            placeholder="30 ml"
          />
        </div>
        <div>
          <Label htmlFor="ean">EAN Barcode</Label>
          <Input
            id="ean"
            value={formData.ean}
            onChange={(e) => setFormData({ ...formData, ean: e.target.value })}
            maxLength={100}
            placeholder="1234567890123"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="manufacturer">Manufacturer *</Label>
        <Popover open={manufacturerOpen} onOpenChange={setManufacturerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={manufacturerOpen}
              className="w-full justify-between"
            >
              {formData.manufacturer_id
                ? activeManufacturers.find((manufacturer) => {
                    const manufacturerId = manufacturer?.id?.toString() || manufacturer?.manufacturer_id?.toString();
                    return manufacturerId === formData.manufacturer_id;
                  })?.name || "Select manufacturer"
                : "Select manufacturer"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search manufacturers..." />
              <CommandList>
                <CommandEmpty>No manufacturer found.</CommandEmpty>
                <CommandGroup>
                  {activeManufacturers.filter(manufacturer => manufacturer && (manufacturer.id || manufacturer.manufacturer_id)).map((manufacturer) => {
                    const manufacturerId = manufacturer.id?.toString() || manufacturer.manufacturer_id?.toString();
                    if (!manufacturerId) return null;
                    const isSelected = formData.manufacturer_id === manufacturerId;
                    return (
                      <CommandItem
                        key={manufacturerId}
                        value={manufacturer.name || ""}
                        onSelect={() => {
                          setFormData({ ...formData, manufacturer_id: manufacturerId });
                          setManufacturerOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {manufacturer.name || "Unknown"}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Categories</Label>
        <p className="text-sm text-muted-foreground mb-2">Select categories for this product. You can select multiple categories including parent and child categories.</p>
        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={categoryOpen}
              className="w-full justify-between"
            >
              {formData.category_ids.length > 0
                ? `${formData.category_ids.length} categories selected`
                : "Select categories"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search categories..." />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  {activeCategories.filter(category => category && (category.id || category.category_id)).map((category) => {
                    const categoryId = category.id || category.category_id;
                    if (!categoryId) return null;
                    const isSelected = formData.category_ids.includes(categoryId);
                    return (
                      <CommandItem
                        key={categoryId}
                        value={category.name || ""}
                        onSelect={() => {
                          const newCategoryIds = isSelected
                            ? formData.category_ids.filter(id => id !== categoryId)
                            : [...formData.category_ids, categoryId];
                          setFormData({ ...formData, category_ids: newCategoryIds });
                        }}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={isSelected}
                          className="pointer-events-none"
                        />
                        <span>{category.name || "Unknown"}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {formData.category_ids.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {formData.category_ids.map(categoryId => {
              const category = categories.find(cat => (cat.id || cat.category_id) === categoryId);
              return (
                <Badge key={categoryId} variant="secondary" className="text-xs">
                  {category?.name || "Unknown"}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        category_ids: formData.category_ids.filter(id => id !== categoryId)
                      });
                    }}
                    className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {product && !product.sku && (
        <div className="flex items-center space-x-2 p-3 border rounded-lg bg-blue-50 dark:bg-blue-950">
          <Checkbox
            id="generateSku"
            checked={formData.generateSku}
            onCheckedChange={(checked) => setFormData({ ...formData, generateSku: checked as boolean })}
          />
          <Label htmlFor="generateSku" className="cursor-pointer">
            Generate SKU (444 + {product.dynamic_code})
          </Label>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="web"
            checked={formData.web}
            onCheckedChange={(checked) => setFormData({ ...formData, web: checked })}
          />
          <Label htmlFor="web">Web Visibility</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="mobile"
            checked={formData.mobile}
            onCheckedChange={(checked) => setFormData({ ...formData, mobile: checked })}
          />
          <Label htmlFor="mobile">Mobile Visibility</Label>
        </div>
      </div>
    </div>
  );
}