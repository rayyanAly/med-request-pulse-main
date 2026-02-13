import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Search, Upload, X, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import EditProductDialog from "@/components/products/EditProductDialog";

interface BrokenImage {
  image_id?: number;
  image: string;
  url: string;
  sort_order?: number;
  is_broken: boolean;
}

interface BrokenProduct {
  product_id: number;
  dynamic_code: string;
  product_name: string;
  manufacturer: {
    id: number;
    name: string;
  };
  main_image: BrokenImage;
  sub_images: BrokenImage[];
  has_broken_images: boolean;
}

export default function BrokenImages() {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [brokenProducts, setBrokenProducts] = useState<BrokenProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fixingProductId, setFixingProductId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const scanBrokenImages = async () => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/products/images/broken');
      const result = await response.json();

      setBrokenProducts(result.data);

      toast({
        title: "Scan Complete",
        description: `Found ${result.data.length} products with broken images`,
        className: result.data.length > 0 ? "bg-orange-100 border-orange-400 text-orange-800 border-2" : "bg-green-100 border-green-400 text-green-800 border-2",
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Failed to scan for broken images",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const exportBrokenImages = () => {
    const exportData = [];

    for (const product of brokenProducts) {
      // Main image
      if (product.main_image.is_broken) {
        exportData.push({
          'Dynamic ID': product.dynamic_code,
          'Product Name': product.product_name,
          'Manufacturer Name': product.manufacturer.name,
          'Broken Image Type': 'Main Image',
          'Image URL': product.main_image.url,
          'Image Path': product.main_image.image
        });
      }

      // Sub images
      for (const subImage of product.sub_images) {
        if (subImage.is_broken) {
          exportData.push({
            'Dynamic ID': product.dynamic_code,
            'Product Name': product.product_name,
            'Manufacturer Name': product.manufacturer.name,
            'Broken Image Type': `Sub Image (${subImage.sort_order})`,
            'Image URL': subImage.url,
            'Image Path': subImage.image
          });
        }
      }
    }

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Auto-size columns
    const colWidths = [
      { wch: 15 }, // Dynamic ID
      { wch: 30 }, // Product Name
      { wch: 20 }, // Manufacturer Name
      { wch: 20 }, // Broken Image Type
      { wch: 69 }, // Image URL
      { wch: 32 }  // Image Path
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Broken Images');

    // Generate filename with current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `broken-images-${dateStr}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);

    toast({
      title: "Export Complete",
      description: `Exported ${exportData.length} broken images to ${filename}`,
    });
  };

  const allFiltered = brokenProducts.filter(product =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.dynamic_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.manufacturer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFixImages = (product: any) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const totalFiltered = allFiltered.length;
  const totalPages = Math.ceil(totalFiltered / 50);
  const start = (currentPage - 1) * 50;
  const end = start + 50;
  const filteredProducts = allFiltered.slice(start, end);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-normal text-foreground">Broken Images</h1>
          <p className="text-lg font-light text-muted-foreground">
            Detect and fix products with missing images
          </p>
        </div>
        <div className="flex gap-2">
          {brokenProducts.length > 0 && (
            <Button onClick={exportBrokenImages} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          )}
          <Button onClick={scanBrokenImages} disabled={isScanning}>
            {isScanning ? "Scanning..." : "Scan All Products"}
          </Button>
        </div>
      </div>

      {brokenProducts.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Found {brokenProducts.length} Products
              </span>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, code, or manufacturer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Card key={product.product_id} className="border border-orange-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{product.product_name}</h3>
                          <Badge variant="outline">{product.dynamic_code}</Badge>
                          <Badge variant="secondary">{product.manufacturer.name}</Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          {product.main_image.is_broken && (
                            <div className="flex items-center gap-2 text-destructive">
                              <X className="h-4 w-4" />
                              <span>Main Image: {product.main_image.image}</span>
                            </div>
                          )}
                          
                          {product.sub_images.filter(img => img.is_broken).map((img, idx) => (
                            <div key={img.image_id || idx} className="flex items-center gap-2 text-destructive">
                              <X className="h-4 w-4" />
                              <span>Sub Image {img.sort_order}: {img.image}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFixImages(product)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Fix Images
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 py-4 border-t">
                <div className="flex-1 text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} - Showing {start + 1} to {Math.min(end, totalFiltered)} of {totalFiltered} items
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isScanning && brokenProducts.length === 0 && (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Click "Scan All Products" to check for broken images
            </p>
          </CardContent>
        </Card>
      )}

      {isScanning && (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Scanning all products...</p>
              <p className="text-sm text-muted-foreground">This may take 30-60 seconds</p>
            </div>
          </CardContent>
        </Card>
      )}

      <EditProductDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        product={selectedProduct}
        imagesOnly={true}
      />
    </div>
  );
}
