import { memo, useState } from "react";
import {
  Monitor,
  Smartphone,
  Eye,
  Edit,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Banner } from "@/redux/types";
import EditBannerDialog from "./EditBannerDialog";
import BannerPreviewDialog from "./BannerPreviewDialog";

const statusStyles = {
  active: "status-success",
  inactive: "status-warning",
};

const bannerTypeLabels: Record<string, string> = {
  'brands': 'Brands',
  'page': 'Page',
  'others': 'Others',
  'products': 'Products',
  'categories': 'Categories',
};

const getBannerStatus = (banner: Banner) => {
  const now = new Date();
  const expiryDate = new Date(banner.expiry_date);
  // Set expiry date to 23:59:59 for comparison
  expiryDate.setHours(23, 59, 59, 999);
  // Dubai timezone (UTC+4)
  const nowDubai = new Date(now.getTime() + (now.getTimezoneOffset() + 4 * 60) * 60000);
  const expiryDubai = new Date(expiryDate.getTime() + (expiryDate.getTimezoneOffset() + 4 * 60) * 60000);
  return nowDubai <= expiryDubai ? 'active' : 'inactive';
};

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const getImageUrl = (imagePath: string) => {
  return IMAGE_BASE_URL + imagePath;
};

interface BannerCardProps {
  banner: Banner;
}

const BannerCard = memo(({ banner }: BannerCardProps) => {
  const status = getBannerStatus(banner);
  const imageUrl = banner.images.length > 0
    ? getImageUrl(banner.images[0].image)
    : null;
  const hasMobileImage = banner.images.length > 0 &&
    banner.images[0].mobile_image &&
    banner.images[0].mobile_image !== banner.images[0].image;
  const expiryDate = new Date(banner.expiry_date).toLocaleDateString('en-GB');

  const [imageError, setImageError] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  return (
    <div className="stat-card">
      {/* Banner Preview */}
      <div className="mb-4 max-h-48 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        {imageUrl ? (
          imageError ? (
            <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground text-sm">
              Image not available
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={banner.name}
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
            />
          )
        ) : (
          <span className="text-sm text-muted-foreground">No Image</span>
        )}
      </div>

      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground truncate" title={banner.name}>{banner.name}</h3>
          <p className="text-sm text-muted-foreground">
            {bannerTypeLabels[banner.banner_type] || banner.banner_type}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setPreviewDialogOpen(true)}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("status-badge", statusStyles[status])}>
            {status}
          </span>
          <Badge variant="outline" className="uppercase text-xs">
            EN
          </Badge>
          <div className="flex items-center gap-1">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            {hasMobileImage && (
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Calendar className="h-4 w-4" />
          <span>Expires: {expiryDate}</span>
        </div>
      </div>

      {banner.description && (
        <div className="mt-3 text-sm text-muted-foreground">
          {banner.description}
        </div>
      )}

      <EditBannerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        banner={banner}
      />

      <BannerPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        banner={banner}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function - only re-render if banner data actually changed
  return (
    prevProps.banner.banner_id === nextProps.banner.banner_id &&
    prevProps.banner.status === nextProps.banner.status &&
    prevProps.banner.is_expired === nextProps.banner.is_expired &&
    prevProps.banner.name === nextProps.banner.name &&
    prevProps.banner.description === nextProps.banner.description &&
    prevProps.banner.banner_type === nextProps.banner.banner_type &&
    prevProps.banner.expiry_date === nextProps.banner.expiry_date &&
    prevProps.banner.images.length === nextProps.banner.images.length
  );
});

BannerCard.displayName = 'BannerCard';

export default BannerCard;
