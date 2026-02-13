import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateManufacturer } from "@/redux/actions/manufacturerActions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Upload } from "lucide-react";
import { Manufacturer } from "@/redux/types";

interface EditManufacturerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manufacturer: Manufacturer;
}

export default function EditManufacturerDialog({
  open,
  onOpenChange,
  manufacturer,
}: EditManufacturerDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: manufacturer.name,
    sort_order: manufacturer.sort_order || 0,
    show_in_home: manufacturer.show_in_home === 1,
    status: manufacturer.status === 1,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    manufacturer.image ? getImageUrl(manufacturer.image) : null
  );

  useEffect(() => {
    setFormData({
      name: manufacturer.name,
      sort_order: manufacturer.sort_order || 0,
      show_in_home: manufacturer.show_in_home === 1,
      status: manufacturer.status === 1,
    });
    setImage(null);
    setImagePreview(
      manufacturer.image ? getImageUrl(manufacturer.image) : null
    );
  }, [manufacturer]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Manufacturer name is required",
        variant: "destructive",
        className: "bg-red-100 border-red-400 text-red-800 border-2",
      });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("sort_order", String(formData.sort_order));
      data.append("show_in_home", formData.show_in_home ? "1" : "0");
      data.append("status", formData.status ? "1" : "0");

      if (image) {
        data.append("image", image);
      }

      const result = await dispatch(updateManufacturer(manufacturer.manufacturer_id, data) as any);

      if (result.success) {
        toast({
          title: "Success",
          description: "Manufacturer updated successfully",
          className: "bg-blue-100 border-blue-400 text-blue-800 border-2",
        });
        onOpenChange(false);
      } else {
        throw new Error(result.error || "Failed to update manufacturer");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update manufacturer",
        variant: "destructive",
        className: "bg-red-100 border-red-400 text-red-800 border-2",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Manufacturer</DialogTitle>
          <DialogDescription>
            Update the manufacturer details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter manufacturer name"
                  required
                />
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show_in_home"
                  checked={formData.show_in_home}
                  onCheckedChange={(checked) => setFormData({ ...formData, show_in_home: checked as boolean })}
                />
                <Label htmlFor="show_in_home">Show in Home</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked as boolean })}
                />
                <Label htmlFor="status">Active</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex items-center justify-center w-full">
                {imagePreview ? (
                  <div className="relative w-full h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

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
              {loading ? "Updating..." : "Update Manufacturer"}
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
