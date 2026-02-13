import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface BannerImage {
  title: string;
  link: string;
  image: File | null;
  mobile_image: File | null;
  sort_order: number;
  meta: string;
  existingImage?: string;
  existingMobileImage?: string;
}

interface BannerImagesProps {
  images: BannerImage[];
  addImage: () => void;
  removeImage: (index: number) => void;
  updateImage: (index: number, field: keyof BannerImage, value: string | number | File | null) => void;
  errors: Record<string, string>;
}

export default function BannerImages({
  images,
  addImage,
  removeImage,
  updateImage,
  errors,
}: BannerImagesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Images
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addImage}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </Button>
      </div>

      {errors.images && (
        <p className="text-xs text-destructive">{errors.images}</p>
      )}

      <div className="space-y-4">
        {images.map((image, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Image {index + 1}</h4>
              {images.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={image.title}
                  onChange={(e) => updateImage(index, 'title', e.target.value)}
                  placeholder="Image title"
                  className={errors[`image_${index}_title`] ? "border-destructive" : ""}
                />
                {errors[`image_${index}_title`] && (
                  <p className="text-xs text-destructive">{errors[`image_${index}_title`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Link</Label>
                <Input
                  value={image.link}
                  onChange={(e) => updateImage(index, 'link', e.target.value)}
                  placeholder="Image link URL"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Desktop Image {!image.existingImage && '*'}</Label>
                {image.existingImage && (
                  <div className="mb-2">
                    <img 
                      src={`${import.meta.env.VITE_IMAGE_BASE_URL || 'https://dashboard.800pharmacy.ae/image/'}${image.existingImage}`}
                      alt="Current desktop image"
                      className="w-full h-24 object-cover rounded border"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Current image (upload new to replace)</p>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateImage(index, 'image', e.target.files?.[0] || null)}
                  className={errors[`image_${index}_image`] ? "border-destructive" : ""}
                />
                {errors[`image_${index}_image`] && (
                  <p className="text-xs text-destructive">{errors[`image_${index}_image`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Mobile Image</Label>
                {image.existingMobileImage && (
                  <div className="mb-2">
                    <img 
                      src={`${import.meta.env.VITE_IMAGE_BASE_URL || 'https://dashboard.800pharmacy.ae/image/'}${image.existingMobileImage}`}
                      alt="Current mobile image"
                      className="w-full h-24 object-cover rounded border"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Current image (upload new to replace)</p>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateImage(index, 'mobile_image', e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={image.sort_order}
                  onChange={(e) => updateImage(index, 'sort_order', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Meta</Label>
                <Input
                  value={image.meta}
                  onChange={(e) => updateImage(index, 'meta', e.target.value)}
                  placeholder="Additional metadata"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}