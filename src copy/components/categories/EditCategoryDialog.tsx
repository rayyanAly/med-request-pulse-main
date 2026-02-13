import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateCategory, fetchCategories } from "@/redux/actions/categoryActions";
import { RootState } from "@/redux/store";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Upload } from "lucide-react";
import { Category } from "@/redux/types";

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
}

export default function EditCategoryDialog({
  open,
  onOpenChange,
  category,
}: EditCategoryDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { categories } = useSelector((state: RootState) => state.categories);
  
  // Build full breadcrumb path for a category
  const getCategoryPath = (categoryId: number): string => {
    const path: string[] = [];
    let currentId: number | undefined = categoryId;
    while (currentId) {
      const cat = categories.find((c) => c.category_id === currentId);
      if (cat) {
        path.unshift(cat.name);
        currentId = cat.parent_id || undefined;
      } else {
        break;
      }
    }
    return path.join(' > ');
  };

  // Show all categories (not just root) so users can select any parent
  const allParentCategories = categories.filter((c) => c.status === 1);
  
  const [formData, setFormData] = useState({
    name: category.name || "",
    parent_id: category.parent_id || 0,
    sort_order: category.sort_order || 0,
    status: category.status === 1,
    top: category.top === 1,
    column: category.column || 1,
    list_in_api: category.list_in_api === 1,
    display_sub_categories: category.display_sub_categories === 1,
    is_menu: category.is_menu === 1,
    description: category.description || "",
    meta_title: category.meta_title || "",
    meta_description: category.meta_description || "",
    meta_keyword: category.meta_keyword || "",
    seo_url: category.seo_url || "",
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    category.image ? getImageUrl(category.image) : null
  );
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    category.category_banner ? getImageUrl(category.category_banner) : null
  );

  useEffect(() => {
    setFormData({
      name: category.name || "",
      parent_id: category.parent_id || 0,
      sort_order: category.sort_order || 0,
      status: category.status === 1,
      top: category.top === 1,
      column: category.column || 1,
      list_in_api: category.list_in_api === 1,
      display_sub_categories: category.display_sub_categories === 1,
      is_menu: category.is_menu === 1,
      description: category.description || "",
      meta_title: category.meta_title || "",
      meta_description: category.meta_description || "",
      meta_keyword: category.meta_keyword || "",
      seo_url: category.seo_url || "",
    });
    setImage(null);
    setBanner(null);
    setImagePreview(category.image ? getImageUrl(category.image) : null);
    setBannerPreview(category.category_banner ? getImageUrl(category.category_banner) : null);
  }, [category]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const removeBanner = () => {
    setBanner(null);
    setBannerPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
        className: "bg-red-100 border-red-400 text-red-800 border-2",
      });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("parent_id", String(formData.parent_id));
      data.append("sort_order", String(formData.sort_order));
      data.append("status", formData.status ? "1" : "0");
      data.append("top", formData.top ? "1" : "0");
      data.append("column", String(formData.column));
      data.append("list_in_api", formData.list_in_api ? "1" : "0");
      data.append("display_sub_categories", formData.display_sub_categories ? "1" : "0");
      data.append("is_menu", formData.is_menu ? "1" : "0");
      data.append("description", formData.description);
      data.append("meta_title", formData.meta_title);
      data.append("meta_description", formData.meta_description);
      data.append("meta_keyword", formData.meta_keyword);
      data.append("seo_url", formData.seo_url);
      
      if (image) {
        data.append("image", image);
      }
      if (banner) {
        data.append("category_banner", banner);
      }

      const result = await dispatch(updateCategory(category.category_id, data) as any);

      if (result.success) {
        toast({
          title: "Success",
          description: "Category updated successfully",
          className: "bg-blue-100 border-blue-400 text-blue-800 border-2",
        });
        onOpenChange(false);
      } else {
        throw new Error(result.error || "Failed to update category");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
        className: "bg-red-100 border-red-400 text-red-800 border-2",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="meta">Meta</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent_id">Parent Category</Label>
                  <Select
                    value={String(formData.parent_id)}
                    onValueChange={(value) => setFormData({ ...formData, parent_id: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto">
                      <SelectItem value="0">Root (No Parent)</SelectItem>
                      {allParentCategories.map((cat) => (
                        <SelectItem key={cat.category_id} value={String(cat.category_id)}>
                          {cat.category_id} - {getCategoryPath(cat.category_id)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="column">Column</Label>
                  <Select value={String(formData.column)} onValueChange={(value) => setFormData({ ...formData, column: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Column</SelectItem>
                      <SelectItem value="2">2 Columns</SelectItem>
                      <SelectItem value="3">3 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter category description"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Options</Label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="status"
                        checked={formData.status}
                        onCheckedChange={(checked) => setFormData({ ...formData, status: checked as boolean })}
                      />
                      <Label htmlFor="status">Active</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="top"
                        checked={formData.top}
                        onCheckedChange={(checked) => setFormData({ ...formData, top: checked as boolean })}
                      />
                      <Label htmlFor="top">Show in Top Menu</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="list_in_api"
                        checked={formData.list_in_api}
                        onCheckedChange={(checked) => setFormData({ ...formData, list_in_api: checked as boolean })}
                      />
                      <Label htmlFor="list_in_api">List in API</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="display_sub_categories"
                        checked={formData.display_sub_categories}
                        onCheckedChange={(checked) => setFormData({ ...formData, display_sub_categories: checked as boolean })}
                      />
                      <Label htmlFor="display_sub_categories">Display Sub Categories</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_menu"
                        checked={formData.is_menu}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_menu: checked as boolean })}
                      />
                      <Label htmlFor="is_menu">Show in Menu</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="meta" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="Enter meta title for SEO"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Input
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="Enter meta description for SEO"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="meta_keyword">Meta Keywords</Label>
                  <Input
                    id="meta_keyword"
                    value={formData.meta_keyword}
                    onChange={(e) => setFormData({ ...formData, meta_keyword: e.target.value })}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="mt-4">
              <div className="space-y-2">
                <Label htmlFor="seo_url">SEO URL</Label>
                <Input
                  id="seo_url"
                  value={formData.seo_url}
                  onChange={(e) => setFormData({ ...formData, seo_url: e.target.value })}
                  placeholder="category-slug-url"
                />
              </div>
            </TabsContent>

            <TabsContent value="images" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category Image</Label>
                  <div className="flex items-center justify-center w-full">
                    {imagePreview ? (
                      <div className="relative w-full h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={removeImage}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 cursor-pointer hover:bg-muted/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to upload image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Category Banner</Label>
                  <div className="flex items-center justify-center w-full">
                    {bannerPreview ? (
                      <div className="relative w-full h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden">
                        <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-contain" />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={removeBanner}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 cursor-pointer hover:bg-muted/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to upload banner</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="gradient-primary text-primary-foreground"
            >
              {loading ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function getImageUrl(imagePath: string): string {
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  if (!imagePath) return "";
  if (imagePath.startsWith('http')) return imagePath;
  return IMAGE_BASE_URL + imagePath;
}
