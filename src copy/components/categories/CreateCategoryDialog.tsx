import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createCategory, fetchCategories } from "@/redux/actions/categoryActions";
import { RootState } from "@/redux/store";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCategoryDialog({
  open,
  onOpenChange,
}: CreateCategoryDialogProps) {
  const dispatch = useDispatch();
  const { categories, creating, creatingError } = useSelector(
    (state: RootState) => state.categories
  );

  const [formData, setFormData] = useState({
    name: "",
    parent_id: 0,
    sort_order: 0,
    status: 1,
    top: 0,
    column: 1,
    list_in_api: 1,
    display_sub_categories: 0,
    is_menu: 0,
    description: "",
    meta_title: "",
    meta_description: "",
    meta_keyword: "",
    seo_url: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

    const data = new FormData();
    data.append("name", formData.name);
    data.append("parent_id", String(formData.parent_id));
    data.append("sort_order", String(formData.sort_order));
    data.append("status", String(formData.status));
    data.append("top", String(formData.top));
    data.append("column", String(formData.column));
    data.append("list_in_api", String(formData.list_in_api));
    data.append("display_sub_categories", String(formData.display_sub_categories));
    data.append("is_menu", String(formData.is_menu));
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

    const result = await dispatch(createCategory(data) as any);

    if (result.success) {
      dispatch(fetchCategories() as any);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      parent_id: 0,
      sort_order: 0,
      status: 1,
      top: 0,
      column: 1,
      list_in_api: 1,
      display_sub_categories: 0,
      is_menu: 0,
      description: "",
      meta_title: "",
      meta_description: "",
      meta_keyword: "",
      seo_url: "",
    });
    setImage(null);
    setBanner(null);
    setImagePreview(null);
    setBannerPreview(null);
    onOpenChange(false);
  };

  const rootCategories = categories.filter((c) => c.parent_id === 0);

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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
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
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
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
                  <Select
                    value={String(formData.column)}
                    onValueChange={(value) => setFormData({ ...formData, column: parseInt(value) })}
                  >
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
                      <input
                        type="checkbox"
                        id="status"
                        checked={formData.status === 1}
                        onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 1 : 0 })}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="status">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="top"
                        checked={formData.top === 1}
                        onChange={(e) => setFormData({ ...formData, top: e.target.checked ? 1 : 0 })}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="top">Show in Top Menu</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="list_in_api"
                        checked={formData.list_in_api === 1}
                        onChange={(e) => setFormData({ ...formData, list_in_api: e.target.checked ? 1 : 0 })}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="list_in_api">List in API</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="display_sub_categories"
                        checked={formData.display_sub_categories === 1}
                        onChange={(e) => setFormData({ ...formData, display_sub_categories: e.target.checked ? 1 : 0 })}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="display_sub_categories">Show Sub Categories</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_menu"
                        checked={formData.is_menu === 1}
                        onChange={(e) => setFormData({ ...formData, is_menu: e.target.checked ? 1 : 0 })}
                        className="h-4 w-4 rounded border-gray-300"
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
                    placeholder="Meta Title for SEO"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Input
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="Meta Description for SEO"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="meta_keyword">Meta Keywords</Label>
                  <Input
                    id="meta_keyword"
                    value={formData.meta_keyword}
                    onChange={(e) => setFormData({ ...formData, meta_keyword: e.target.value })}
                    placeholder="keywords, for, seo"
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

          {creatingError && <div className="text-sm text-destructive mt-4">{creatingError}</div>}

          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={creating}>{creating ? "Creating..." : "Create Category"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
