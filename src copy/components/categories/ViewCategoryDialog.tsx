import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/redux/types";
import { X, Edit2 } from "lucide-react";

interface ViewCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onEdit: (category: Category) => void;
}

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return IMAGE_BASE_URL + imagePath;
};

export default function ViewCategoryDialog({
  open,
  onOpenChange,
  category,
  onEdit,
}: ViewCategoryDialogProps) {
  if (!category) return null;

  const imageUrl = getImageUrl(category.image);
  const bannerUrl = getImageUrl(category.category_banner);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            View Category
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="meta">Meta</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ID</Label>
                <code className="rounded bg-muted px-2 py-1 text-sm font-mono block">
                  {category.category_id}
                </code>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={category.name} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Parent ID</Label>
                <Input value={category.parent_id} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input value={category.sort_order} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Top Menu</Label>
                <Input value={category.top === 1 ? "Yes" : "No"} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>In Menu</Label>
                <Input value={category.is_menu === 1 ? "Yes" : "No"} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Input value={category.status === 1 ? "Active" : "Inactive"} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>List in API</Label>
                <Input value={category.list_in_api === 1 ? "Yes" : "No"} disabled className="bg-muted" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Description</Label>
                <Input value={category.description || ''} disabled className="bg-muted" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category Image</Label>
                <div className="h-48 w-48 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/25 mx-auto">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-muted-foreground">No Image</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground text-center">{category.image || 'No image path'}</p>
              </div>
              <div className="space-y-2">
                <Label>Category Banner</Label>
                <div className="h-48 w-full rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/25">
                  {bannerUrl ? (
                    <img
                      src={bannerUrl}
                      alt={`${category.name} banner`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-muted-foreground">No Banner</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground text-center">{category.category_banner || 'No banner path'}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="meta" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input value={category.meta_title || ''} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Input value={category.meta_description || ''} disabled className="bg-muted" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Meta Keywords</Label>
                <Input value={category.meta_keyword || ''} disabled className="bg-muted" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="seo" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SEO URL</Label>
                <Input value={category.seo_url || ''} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={category.name} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input value={category.meta_title || ''} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Input value={category.meta_description || ''} disabled className="bg-muted" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          <Button onClick={() => {
            onOpenChange(false);
            onEdit(category);
          }}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
