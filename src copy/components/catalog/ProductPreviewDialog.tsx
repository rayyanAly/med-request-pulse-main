import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/redux/types";
import { Package, DollarSign, Barcode, Building2, AlertCircle, Globe, Smartphone } from "lucide-react";
import { memo } from "react";

interface ProductPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

const getImageUrl = (imagePath: string) => {
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
  return baseUrl + imagePath;
};

export default memo(function ProductPreviewDialog({ open, onOpenChange, product }: ProductPreviewDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 flex-wrap text-2xl">
            <span>{product.product_name}</span>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="text-sm">ID: {product.product_id}</Badge>
              <Badge variant="secondary" className="text-sm">{product.dynamic_code}</Badge>
              <Badge className={product.status === "Active" ? "bg-green-500 text-sm" : "bg-gray-500 text-sm"}>
                {product.status}
              </Badge>
              {product.visibility.web && (
                <Badge variant="outline" className="text-sm">
                  <Globe className="w-3 h-3 mr-1" />Web
                </Badge>
              )}
              {product.visibility.mobile && (
                <Badge variant="outline" className="text-sm">
                  <Smartphone className="w-3 h-3 mr-1" />Mobile
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Pricing Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <span className="font-bold text-lg">AED {product.price}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price w/o VAT:</span>
                    <span className="font-semibold">AED {product.price_without_vat}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Stock Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-500" />
                    Stock
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Available:</span>
                    <span className="font-bold text-lg">{product.available_stock}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant={product.available_stock > 0 ? "default" : "destructive"}>
                      {product.stock_status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Manufacturer Card - Smaller */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-orange-500" />
                    Manufacturer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold text-base">{product.manufacturer.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {product.manufacturer.id}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Identifiers Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-purple-500" />
                    Identifiers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">SKU:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{product.sku || "Not set"}</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">UPC:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{product.upc || "—"}</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">EAN:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{product.ean || "—"}</code>
                  </div>
                </CardContent>
              </Card>

              {/* Product Images Preview - Beside Manufacturer */}
              {(product.main_image || (product.sub_images && product.sub_images.length > 0)) && (
                <Card className="md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="w-4 h-4 text-purple-500" />
                      Product Images ({(product.main_image ? 1 : 0) + (product.sub_images?.length || 0)})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {/* Main Image */}
                      {product.main_image && (
                        <div className="flex-shrink-0">
                          <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden border-2 border-primary">
                            <img
                              src={getImageUrl(product.main_image.image)}
                              alt={product.product_name}
                              className="w-full h-full object-contain p-1"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/80x80?text=Main';
                              }}
                            />
                            <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded font-semibold">
                              Main
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sub Images */}
                      {product.sub_images && product.sub_images.slice(0, 5).map((img, index) => (
                        <div key={img.image_id || index} className="flex-shrink-0">
                          <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors">
                            <img
                              src={getImageUrl(img.image)}
                              alt={`${product.product_name} ${index + 1}`}
                              className="w-full h-full object-contain p-1 hover:scale-105 transition-transform"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/80x80?text=Sub';
                              }}
                            />
                            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                              #{img.sort_order}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Show count if more images */}
                      {product.sub_images && product.sub_images.length > 5 && (
                        <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 bg-muted rounded-lg border-2 border-border">
                          <div className="text-center">
                            <Package className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">+{product.sub_images.length - 5}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4 mt-4">
            {product.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{product.description}</p>
                </CardContent>
              </Card>
            )}

            {product.details && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{product.details}</p>
                </CardContent>
              </Card>
            )}

            {product.how_it_works && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{product.how_it_works}</p>
                </CardContent>
              </Card>
            )}

            {product.ingredients && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{product.ingredients}</p>
                </CardContent>
              </Card>
            )}

            {product.warnings && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed text-amber-700 dark:text-amber-400">
                    {product.warnings}
                  </p>
                </CardContent>
              </Card>
            )}

            {!product.description && !product.details && !product.how_it_works &&
             !product.ingredients && !product.warnings && (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No content information available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="seo" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Meta Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{product.meta_title || <span className="text-muted-foreground italic">Not set</span>}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Meta Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {product.meta_description || <span className="text-muted-foreground italic">Not set</span>}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Meta Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{product.meta_keyword || <span className="text-muted-foreground italic">Not set</span>}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6 mt-4">
            {/* All Images in One Line */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Product Images ({(product.main_image ? 1 : 0) + (product.sub_images?.length || 0)})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {/* Main Image */}
                  {product.main_image && (
                    <div className="flex-shrink-0">
                      <div className="relative w-32 h-32 bg-muted rounded-lg overflow-hidden border-2 border-primary">
                        <img
                          src={getImageUrl(product.main_image.image)}
                          alt={product.product_name}
                          className="w-full h-full object-contain p-2"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/128x128?text=Main';
                          }}
                        />
                        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded font-semibold">
                          Main
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub Images */}
                  {product.sub_images && product.sub_images.map((img, index) => (
                    <div key={img.image_id || index} className="flex-shrink-0">
                      <div className="relative w-32 h-32 bg-muted rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors">
                        <img
                          src={getImageUrl(img.image)}
                          alt={`${product.product_name} ${index + 1}`}
                          className="w-full h-full object-contain p-2 hover:scale-105 transition-transform"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/128x128?text=Sub';
                          }}
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          #{img.sort_order}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* No images message */}
                  {(!product.main_image && (!product.sub_images || product.sub_images.length === 0)) && (
                    <div className="flex items-center justify-center w-full py-12 text-muted-foreground">
                      <div className="text-center">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No images available</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
});