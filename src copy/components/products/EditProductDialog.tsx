import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateProduct } from "@/redux/actions/productActions";
import { fetchManufacturers } from "@/redux/actions/manufacturerActions";
import { fetchCategories } from "@/redux/actions/categoryActions";
import { Product, ProductFormData } from "@/redux/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import BasicInfoTab from "./BasicInfoTab";
import ContentTab from "./ContentTab";
import SeoTab from "./SeoTab";
import ImagesTab from "./ImagesTab";

const getImageUrl = (imagePath: string) => {
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
  return baseUrl + imagePath;
};

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  imagesOnly?: boolean;
}

export default function EditProductDialog({ open, onOpenChange, product, imagesOnly = false }: EditProductDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { manufacturers } = useSelector((state: any) => state.manufacturers);
  const { categories } = useSelector((state: any) => state.categories);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    product_name: "",
    price: "",
    upc: "",
    ean: "",
    manufacturer_id: "",
    category_ids: [],
    description: "",
    details: "",
    how_it_work: "",
    ingredients: "",
    warnings: "",
    meta_title: "",
    meta_description: "",
    meta_keyword: "",
    web: true,
    mobile: true,
    status: true,
    generateSku: false,
    sub_images: [],
  });
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [subImageFiles, setSubImageFiles] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  const [manufacturerOpen, setManufacturerOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    if (product && open) {
      // Fetch manufacturers if not already loaded
      if (!manufacturers || manufacturers.length === 0) {
        dispatch(fetchManufacturers() as any);
      }

      // Fetch categories if not already loaded
      if (!categories || categories.length === 0) {
        dispatch(fetchCategories() as any);
      }

      setFormData({
        product_name: product.product_name || product.name || "",
        price: product.price?.toString() || "",
        upc: product.upc || "",
        ean: product.ean || "",
        manufacturer_id: product.manufacturer?.id?.toString() || product.manufacturer?.manufacturer_id?.toString() || "",
        category_ids: product.categories?.map(cat => cat.category_id) || [],
        description: product.description || "",
        details: product.details || "",
        how_it_work: product.how_it_work || "",
        ingredients: product.ingredients || "",
        warnings: product.warnings || "",
        meta_title: product.meta_title || "",
        meta_description: product.meta_description || "",
        meta_keyword: product.meta_keyword || "",
        web: product.visibility?.web ?? (product as any).web ?? true,
        mobile: product.visibility?.mobile ?? (product as any).mobile ?? true,
        status: product.status === "Active" || (product as any).status === true,
        generateSku: false,
        sub_images: product.sub_images || [],
      });
      setMainImagePreview(product.main_image?.image ? getImageUrl(product.main_image.image) : "");
      setSubImagePreviews(product.sub_images?.map(img => img.image ? getImageUrl(img.image) : "") || []);
    }
  }, [product, open, manufacturers, categories, dispatch]);

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
    setSubImageFiles(prev => [...prev, ...files]);
    const previews = files.map(file => {
      const reader = new FileReader();
      return new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(previews).then(newPreviews => {
      // Add to sub_images with sort_order and preview
      const maxSort = Math.max(0, ...formData.sub_images.map(img => img.sort_order));
      const startFileIndex = subImageFiles.length; // since we appended to subImageFiles already
      const newImages = newPreviews.map((preview, index) => ({ image: '', sort_order: maxSort + index + 1, preview, fileIndex: startFileIndex + index }));
      setFormData(prev => ({
        ...prev,
        sub_images: [...prev.sub_images, ...newImages]
      }));
    });
  };

  const moveSubImageUp = (index: number) => {
    if (index === 0) return;
    setFormData(prev => {
      const newSubImages = [...prev.sub_images];
      [newSubImages[index], newSubImages[index - 1]] = [newSubImages[index - 1], newSubImages[index]];
      // Swap sort_order
      const temp = newSubImages[index].sort_order;
      newSubImages[index].sort_order = newSubImages[index - 1].sort_order;
      newSubImages[index - 1].sort_order = temp;
      return { ...prev, sub_images: newSubImages };
    });
  };

  const moveSubImageDown = (index: number) => {
    if (index === formData.sub_images.length - 1) return;
    setFormData(prev => {
      const newSubImages = [...prev.sub_images];
      [newSubImages[index], newSubImages[index + 1]] = [newSubImages[index + 1], newSubImages[index]];
      // Swap sort_order
      const temp = newSubImages[index].sort_order;
      newSubImages[index].sort_order = newSubImages[index + 1].sort_order;
      newSubImages[index + 1].sort_order = temp;
      return { ...prev, sub_images: newSubImages };
    });
  };

  const removeSubImage = (index: number) => {
    const img = formData.sub_images[index];
    const removedFileIndex = img.fileIndex;
    setFormData(prev => {
      const newSubImages = prev.sub_images.filter((_, i) => i !== index);
      // Reassign sort_order
      newSubImages.forEach((img, i) => img.sort_order = i + 1);
      // Adjust fileIndex for remaining new images
      newSubImages.forEach(img => {
        if (img.fileIndex !== undefined && img.fileIndex > removedFileIndex!) {
          img.fileIndex!--;
        }
      });
      return { ...prev, sub_images: newSubImages };
    });
    // If it's a new image, remove from files
    if (removedFileIndex !== undefined) {
      setSubImageFiles(prev => prev.filter((_, i) => i !== removedFileIndex));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    try {
      // Sort subImageFiles to match the sort_order of new sub_images
      const newSubImages = formData.sub_images.filter(img => img.fileIndex !== undefined);
      newSubImages.sort((a, b) => a.sort_order - b.sort_order);
      const sortedFiles = newSubImages.map(img => subImageFiles[img.fileIndex!]);

      await dispatch(updateProduct(product.product_id, formData, mainImageFile, sortedFiles, product.dynamic_code) as any);

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
            {imagesOnly ? "Fix Broken Images" : "Edit Product"}: {product?.product_name || product?.name || ""}
            {product && (
              <div className="flex gap-2">
                <Badge variant="outline">ID: {product.product_id}</Badge>
                <Badge variant="secondary">{product.dynamic_code}</Badge>
                <Badge className={(product.status === "Active" || (product as any).status === true) ? "bg-green-500" : "bg-gray-500"}>
                  {(product as any).status === true ? "Active" : product.status || "Inactive"}
                </Badge>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {imagesOnly ? (
            <div className="space-y-4 mt-4">
              <ImagesTab
                formData={formData}
                setFormData={setFormData}
                mainImageFile={mainImageFile}
                setMainImageFile={setMainImageFile}
                subImageFiles={subImageFiles}
                setSubImageFiles={setSubImageFiles}
                mainImagePreview={mainImagePreview}
                subImagePreviews={subImagePreviews}
                handleMainImageChange={handleMainImageChange}
                handleSubImagesChange={handleSubImagesChange}
              />
              <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Images"}
                </Button>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <BasicInfoTab product={product} formData={formData} setFormData={setFormData} />
              </TabsContent>

              <TabsContent value="content" className="space-y-4 mt-4">
                <ContentTab formData={formData} setFormData={setFormData} />
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 mt-4">
                <SeoTab formData={formData} setFormData={setFormData} />
              </TabsContent>

              <TabsContent value="images" className="space-y-4 mt-4">
                <ImagesTab
                  formData={formData}
                  setFormData={setFormData}
                  mainImageFile={mainImageFile}
                  setMainImageFile={setMainImageFile}
                  subImageFiles={subImageFiles}
                  setSubImageFiles={setSubImageFiles}
                  mainImagePreview={mainImagePreview}
                  subImagePreviews={subImagePreviews}
                  handleMainImageChange={handleMainImageChange}
                  handleSubImagesChange={handleSubImagesChange}
                />
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
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}