import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Manufacturer } from "@/redux/types";
import { X, Edit2 } from "lucide-react";

interface ViewManufacturerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manufacturer: Manufacturer | null;
  onEdit: (manufacturer: Manufacturer) => void;
}

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return IMAGE_BASE_URL + imagePath;
};

export default function ViewManufacturerDialog({
  open,
  onOpenChange,
  manufacturer,
  onEdit,
}: ViewManufacturerDialogProps) {
  if (!manufacturer) return null;

  const imageUrl = getImageUrl(manufacturer.image);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            View Manufacturer
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>ID</Label>
            <code className="rounded bg-muted px-2 py-1 text-sm font-mono block">
              {manufacturer.manufacturer_id}
            </code>
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={manufacturer.name} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Input value={manufacturer.sort_order} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Show in Home</Label>
            <Input 
              value={manufacturer.show_in_home === 1 ? "Yes" : "No"} 
              disabled 
              className="bg-muted" 
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Input 
              value={manufacturer.status === 1 ? "Active" : "Inactive"} 
              disabled 
              className="bg-muted" 
            />
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            <div className="h-32 w-80 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/25">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={manufacturer.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-muted-foreground">No Image</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center">{manufacturer.image || 'No image'}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          <Button onClick={() => {
            onOpenChange(false);
            onEdit(manufacturer);
          }}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
