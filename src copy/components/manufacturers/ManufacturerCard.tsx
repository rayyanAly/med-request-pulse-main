import { memo, useState } from "react";
import {
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Manufacturer } from "@/redux/types";
import EditManufacturerDialog from "./EditManufacturerDialog";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return IMAGE_BASE_URL + imagePath;
};

interface ManufacturerCardProps {
  manufacturer: Manufacturer;
  onEdit?: (manufacturer: Manufacturer) => void;
}

const statusStyles = {
  1: "status-success",
  0: "status-warning",
};

const ManufacturerCard = memo(({ manufacturer, onEdit }: ManufacturerCardProps) => {
  const imageUrl = getImageUrl(manufacturer.image);
  
  const [imageError, setImageError] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(manufacturer);
    } else {
      setEditDialogOpen(true);
    }
  };

  return (
    <div className="stat-card">
      <div className="flex items-center gap-4">
        {/* Manufacturer Logo - Left side */}
        <div className="h-20 w-40 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
          {imageUrl ? (
            imageError ? (
              <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground text-xs">
                No Image
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={manufacturer.name}
                className="w-full h-full object-contain p-1"
                loading="lazy"
                decoding="async"
                onError={() => setImageError(true)}
              />
            )
          ) : (
            <span className="text-xs text-muted-foreground">No Image</span>
          )}
        </div>

        {/* Manufacturer Info - Middle */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate" title={manufacturer.name}>
            {manufacturer.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            ID: {manufacturer.manufacturer_id}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">Sort: {manufacturer.sort_order}</span>
            {manufacturer.show_in_home === 1 && (
              <span className="status-badge status-info text-xs">Show in Home</span>
            )}
          </div>
        </div>

        {/* Status & Actions - Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={cn("status-badge", statusStyles[manufacturer.status as keyof typeof statusStyles])}>
            {manufacturer.status === 1 ? 'Active' : 'Inactive'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="gap-1"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>
        </div>
      </div>

      {!onEdit && (
        <EditManufacturerDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          manufacturer={manufacturer}
        />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.manufacturer.manufacturer_id === nextProps.manufacturer.manufacturer_id &&
    prevProps.manufacturer.status === nextProps.manufacturer.status &&
    prevProps.manufacturer.name === nextProps.manufacturer.name &&
    prevProps.manufacturer.image === nextProps.manufacturer.image &&
    prevProps.manufacturer.sort_order === nextProps.manufacturer.sort_order &&
    prevProps.manufacturer.show_in_home === nextProps.manufacturer.show_in_home
  );
});

ManufacturerCard.displayName = 'ManufacturerCard';

export default ManufacturerCard;
