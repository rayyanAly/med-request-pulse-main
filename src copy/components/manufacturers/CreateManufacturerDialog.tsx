import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RootState } from "@/redux/store";
import { createManufacturer, fetchManufacturers } from "@/redux/actions/manufacturerActions";

interface CreateManufacturerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateManufacturerDialog({
  open,
  onOpenChange,
}: CreateManufacturerDialogProps) {
  const dispatch = useDispatch();
  const { creating, creatingError } = useSelector(
    (state: RootState) => state.manufacturers
  );

  const [formData, setFormData] = useState({
    name: "",
    sort_order: 0,
    show_in_home: 0,
    status: 1,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("sort_order", String(formData.sort_order));
    data.append("show_in_home", String(formData.show_in_home));
    data.append("status", String(formData.status));

    if (image) {
      data.append("image", image);
    }

    const result = await dispatch(createManufacturer(data) as any);

    if (result.success) {
      dispatch(fetchManufacturers() as any);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      sort_order: 0,
      show_in_home: 0,
      status: 1,
    });
    setImage(null);
    setImagePreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Manufacturer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show_in_home"
                  checked={formData.show_in_home === 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      show_in_home: e.target.checked ? 1 : 0,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="show_in_home">Show in Home</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="status"
                  checked={formData.status === 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.checked ? 1 : 0,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
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

          {/* Error Message */}
          {creatingError && (
            <div className="text-sm text-destructive mt-4">{creatingError}</div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create Manufacturer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
