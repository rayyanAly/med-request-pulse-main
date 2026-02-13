import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateProduct } from "@/redux/actions/productActions";
import { fetchManufacturers } from "@/redux/actions/manufacturerActions";
import { Product } from "@/redux/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, GripVertical, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";

const getImageUrl = (imagePath: string) => {
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
  return baseUrl + imagePath;
};

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export default memo(function EditProductDialog({ open, onOpenChange, product }: EditProductDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { manufacturers } = useSelector((state: any) => state.manufacturers);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    price: "",
    upc: "",
    ean: "",
    manufacturer_id: "",
    description: "",
    details: "",
    how_it_works: "",
    ingredients: "",
    warnings: "",
    meta_title: "",
    meta_description: "",
    meta_keyword: "",
    web: true,
    mobile: true,
    status: true,
    generateSku: false,
  });
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [subImageFiles, setSubImageFiles] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  const [manufacturerOpen, setManufacturerOpen] = useState(false);

  useEffect(() => {
    if (product && open) {
      // Fetch manufacturers if not already loaded
      if (!manufacturers || manufacturers.length === 0) {
        dispatch(fetchManufacturers() as any);
      }

      setFormData({
        product_name: product.product_name,
        price: product.price.toString(),
        upc: product.upc || "",
        ean: product.ean || "",
        manufacturer_id: product.manufacturer?.id?.toString() || "",
        description: product.description || "",
        details: product.details || "",
        how_it_works: product.how_it_works || "",
        ingredients: product.ingredients || "",
        warnings: product.warnings || "",
        meta_title: product.meta_title || "",
        meta_description: product.meta_description || "",
        meta_keyword: product.meta_keyword || "",
        web: product.visibility.web,
        mobile: product.visibility.mobile,
        status: product.status === "Active",
        generateSku: false,
      });
      setMainImagePreview(product.main_image?.image ? getImageUrl(product.main_image.image) : "");
      setSubImagePreviews(product.sub_images?.map(img => img.image ? getImageUrl(img.image) : "") || []);
    }
  }, [product, open, manufacturers, dispatch]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setMainImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSubImageFiles(files);
    const previews = files.map(file => {
      const reader = new FileReader();
      return new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(previews).then(setSubImagePreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    try {
      await dispatch(updateProduct(product.product_id, formData, mainImageFile, subImageFiles) as any);

      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Product
            {product && (
              <div className="flex gap-2">
                <Badge variant="outline">ID: {product.product_id}</Badge>
                <Badge variant="secondary">{product.dynamic_code}</Badge>
                <Badge className={product.status === "Active" ? "bg-green-500" : "bg-gray-500"}>
                  {product.status}
                </Badge>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
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
                  />
                </div>
              </div>

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
                        ? manufacturers.find((manufacturer) => {
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
                          {manufacturers.filter(manufacturer => manufacturer && (manufacturer.id || manufacturer.manufacturer_id)).map((manufacturer) => {
                            const manufacturerId = manufacturer.id?.toString() || manufacturer.manufacturer_id?.toString();
                            if (!manufacturerId) return null;
                            const isSelected = formData.manufacturer_id === manufacturerId;
                            return (
                              <CommandItem
                                key={manufacturerId}
                                value={manufacturer.name}
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
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.status}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                  />
                  <Label htmlFor="status">Active Status</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Full product description..."
                />
              </div>

              <div>
                <Label htmlFor="details">Details</Label>
                <Textarea
                  id="details"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={4}
                  placeholder="Product details..."
                />
              </div>

              <div>
                <Label htmlFor="how_it_works">How It Works</Label>
                <Textarea
                  id="how_it_works"
                  value={formData.how_it_works}
                  onChange={(e) => setFormData({ ...formData, how_it_works: e.target.value })}
                  rows={3}
                  placeholder="How it works..."
                />
              </div>

              <div>
                <Label htmlFor="ingredients">Ingredients</Label>
                <Textarea
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  rows={3}
                  placeholder="Ingredients list..."
                />
              </div>

              <div>
                <Label htmlFor="warnings">Warnings</Label>
                <Textarea
                  id="warnings"
                  value={formData.warnings}
                  onChange={(e) => setFormData({ ...formData, warnings: e.target.value })}
                  rows={3}
                  placeholder="Warnings text..."
                />
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="SEO title for search engines"
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows={3}
                  placeholder="SEO description for search results"
                />
              </div>

              <div>
                <Label htmlFor="meta_keyword">Meta Keywords</Label>
                <Input
                  id="meta_keyword"
                  value={formData.meta_keyword}
                  onChange={(e) => setFormData({ ...formData, meta_keyword: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4 mt-4">
              <div>
                <Label>Main Image</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />
                  {mainImagePreview && (
                    <Card className="mt-2">
                      <CardContent className="p-2">
                        <img src={mainImagePreview} alt="Main" className="w-full h-48 object-contain rounded" loading="lazy" />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <div>
                <Label>Sub Images (Upload new to replace all)</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleSubImagesChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to keep existing sub-images
                  </p>
                  {subImagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {subImagePreviews.map((preview, index) => (
                        <Card key={index}>
                          <CardContent className="p-2">
                            <img src={preview} alt={`Sub ${index}`} className="w-full h-24 object-contain rounded" loading="lazy" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
});