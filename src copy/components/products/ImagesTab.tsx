import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import { ProductFormData } from "@/redux/types";

const getImageUrl = (imagePath: string) => {
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
  return baseUrl + imagePath;
};

interface ImagesTabProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  mainImageFile: File | null;
  setMainImageFile: (file: File | null) => void;
  subImageFiles: File[];
  setSubImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  mainImagePreview: string;
  subImagePreviews: string[];
  handleMainImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImagesTab({
  formData,
  setFormData,
  mainImageFile,
  setMainImageFile,
  subImageFiles,
  setSubImageFiles,
  mainImagePreview,
  subImagePreviews,
  handleMainImageChange,
  handleSubImagesChange,
}: ImagesTabProps) {
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

  return (
    <div className="space-y-4">
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
        <Label>Sub Images</Label>
        <div className="mt-2">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleSubImagesChange}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Add more sub images. Existing images will be kept.
          </p>
          {formData.sub_images.length > 0 && (
            <div className="space-y-2 mt-2">
              {formData.sub_images.map((img, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm font-medium">#{img.sort_order}</span>
                  <Card className="flex-1">
                    <CardContent className="p-2">
                      <img
                        src={img.preview || getImageUrl(img.image)}
                        alt={`Sub ${index}`}
                        className="w-full h-24 object-contain rounded"
                      />
                    </CardContent>
                  </Card>
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveSubImageUp(index)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveSubImageDown(index)}
                      disabled={index === formData.sub_images.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSubImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}