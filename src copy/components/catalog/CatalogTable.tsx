import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Edit, Eye } from "lucide-react";
import { Product } from "@/redux/types";
import EditProductDialog from "./EditProductDialog";
import ProductPreviewDialog from "./ProductPreviewDialog";

interface CatalogTableProps {
  products: Product[];
  loading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  totalFiltered: number;
  start: number;
  end: number;
}

export default function CatalogTable({
  products,
  loading,
  currentPage,
  setCurrentPage,
  pagination,
  totalFiltered,
  start,
  end,
}: CatalogTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0) {
      return <Badge className="status-badge status-error">Out of Stock</Badge>;
    }
    return <Badge className="status-badge status-success">In Stock</Badge>;
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handlePreview = (product: Product) => {
    setSelectedProduct(product);
    setPreviewDialogOpen(true);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          All Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No products found matching the current filters.
                </TableCell>
              </TableRow>
            )}
            {products.map((product) => (
              <TableRow key={product.product_id} className="table-row-hover">
                <TableCell>
                  <code className="rounded bg-muted px-2 py-1 text-sm font-mono font-semibold text-foreground">
                    {product.dynamic_code}
                  </code>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-foreground">{product.product_name}</p>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-foreground">AED {product.price}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-foreground">{product.available_stock}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{product.manufacturer.name}</span>
                </TableCell>
                <TableCell>{getStatusBadge(product.status, product.available_stock)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handlePreview(product)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products.length > 0 && (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages} - Showing {start + 1} to {Math.min(end, totalFiltered)} of {totalFiltered} items
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrev || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNext || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <EditProductDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        product={selectedProduct}
      />
      <ProductPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        product={selectedProduct}
      />
    </Card>
  );
}