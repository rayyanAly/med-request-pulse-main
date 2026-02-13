import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Banner } from "@/redux/types";
import { Monitor, Smartphone, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface BannerPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner;
}

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
  return banner.status === 1 && !banner.is_expired ? 'active' : 'inactive';
};

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const getImageUrl = (imagePath: string) => {
  return IMAGE_BASE_URL + imagePath;
};

export default function BannerPreviewDialog({ open, onOpenChange, banner }: BannerPreviewDialogProps) {
  const status = getBannerStatus(banner);
  const expiryDate = new Date(banner.expiry_date).toLocaleDateString('en-GB');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Banner Preview: {banner.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-sm text-muted-foreground">{banner.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <p className="text-sm text-muted-foreground">
                  {bannerTypeLabels[banner.banner_type] || banner.banner_type}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <div className="mt-1">
                  <span className={cn("status-badge", statusStyles[status])}>
                    {status}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Expiry Date</label>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{expiryDate}</span>
                </div>
              </div>
            </div>
            {(banner.description || banner.description_image) && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {banner.description && (
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-sm text-muted-foreground mt-1">{banner.description}</p>
                  </div>
                )}
                {banner.description_image && (
                  <div>
                    <label className="text-sm font-medium">Image Description</label>
                    <p className="text-sm text-muted-foreground mt-1">{banner.description_image}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Object Information */}
          {banner.object_id && banner.object_id !== 0 && (
            <>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Object Information
                </h3>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {banner.banner_type === 'brands' ? 'Brand ID' :
                     banner.banner_type === 'categories' ? 'Category ID' :
                     banner.banner_type === 'products' ? 'Product ID' : 'Object ID'}: {banner.object_id}
                  </span>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Images */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Images
            </h3>
            <div className="space-y-4">
              {banner.images.map((image, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium">{image.title}</h4>
                      {image.link && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Link: {image.link}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          Sort Order: {image.sort_order}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                          {image.mobile_image && image.mobile_image !== image.image && (
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      {image.meta && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Meta: {image.meta}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4">
                      {image.image && (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-32 h-32 rounded border overflow-hidden">
                            <img
                              src={getImageUrl(image.image)}
                              alt={image.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">Desktop</span>
                        </div>
                      )}
                      {image.mobile_image && image.mobile_image !== image.image && (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-32 h-32 rounded border overflow-hidden">
                            <img
                              src={getImageUrl(image.mobile_image)}
                              alt={`${image.title} Mobile`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">Mobile</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}