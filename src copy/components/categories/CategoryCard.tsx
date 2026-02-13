import { memo, useState } from "react";
import {
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@/redux/types";
import EditCategoryDialog from "./EditCategoryDialog";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return IMAGE_BASE_URL + imagePath;
};

interface CategoryCardProps {
  category: Category;
  onEdit?: (category: Category) => void;
}

const statusStyles = {
  1: "status-success",
  0: "status-warning",
};

const CategoryCard = memo(({ category, onEdit }: CategoryCardProps) => {
  const imageUrl = getImageUrl(category.image);
  
  const [imageError, setImageError] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(category);
    } else {
      setEditDialogOpen(true);
    }
  };

  return (
    <div className="stat-card">
      <div className="flex items-center gap-4">
        {/* Category Image - Left side */}
        <div className="h-16 w-16 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
          {imageUrl ? (
            imageError ? (
              <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground text-xs">
                No Image
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={category.name}
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

        {/* Category Info - Middle */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate" title={category.name}>
            {category.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            ID: {category.category_id}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-muted-foreground">Sort: {category.sort_order}</span>
            {category.top === 1 && (
              <span className="status-badge status-info text-xs">Top Menu</span>
            )}
            {category.is_menu === 1 && (
              <span className="status-badge status-info text-xs">In Menu</span>
            )}
            {category.seo_url && (
              <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={category.seo_url}>
                SEO: {category.seo_url}
              </span>
            )}
          </div>
        </div>

        {/* Status & Actions - Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={cn("status-badge", statusStyles[category.status as keyof typeof statusStyles])}>
            {category.status === 1 ? 'Active' : 'Inactive'}
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
        <EditCategoryDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          category={category}
        />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.category.category_id === nextProps.category.category_id &&
    prevProps.category.status === nextProps.category.status &&
    prevProps.category.name === nextProps.category.name &&
    prevProps.category.image === nextProps.category.image &&
    prevProps.category.sort_order === nextProps.category.sort_order &&
    prevProps.category.top === nextProps.category.top &&
    prevProps.category.is_menu === nextProps.category.is_menu &&
    prevProps.category.seo_url === nextProps.category.seo_url
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;
