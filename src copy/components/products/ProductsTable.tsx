import { useState, useCallback, memo, startTransition } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Package, Edit, Eye, Monitor, Smartphone, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/redux/types";
import EditProductDialog from "./EditProductDialog";
import ProductPreviewDialog from "./ProductPreviewDialog";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateProduct, updateProductStatus, updateProductVisibility } from "@/redux/actions/productActions";
import { useToast } from "@/hooks/use-toast";

// Memoized row component to prevent unnecessary re-renders
const ProductRow = memo(({
  product,
  onEdit,
  onPreview,
  onToggleWeb,
  onToggleMobile
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onPreview: (product: Product) => void;
  onToggleWeb: (product: Product) => void;
  onToggleMobile: (product: Product) => void;
}) => (
  <TableRow key={product.product_id} className="table-row-hover">
    <TableCell>
      <code className="rounded bg-muted px-2 py-1 text-sm font-mono font-semibold text-foreground">
        {product.dynamic_code}
      </code>
    </TableCell>
    <TableCell>
      <p className="text-sm text-foreground">{product.product_name || product.name}</p>
    </TableCell>
    <TableCell>
      <span className="font-semibold text-foreground">AED {product.price}</span>
    </TableCell>
    <TableCell>
      <span className="font-medium text-foreground">{product.available_stock}</span>
    </TableCell>
    <TableCell>
      <span className="text-sm text-muted-foreground">{product.manufacturer?.name || "Unknown"}</span>
    </TableCell>
    <TableCell>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleWeb(product)}
          className="p-1 h-8 w-8"
        >
          <Monitor className={`h-4 w-4 ${product.visibility.web ? 'text-green-600' : 'text-red-600'}`} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleMobile(product)}
          className="p-1 h-8 w-8"
        >
          <Smartphone className={`h-4 w-4 ${product.visibility.mobile ? 'text-green-600' : 'text-red-600'}`} />
        </Button>
      </div>
    </TableCell>
    <TableCell>
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => onPreview(product)}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
));

interface ProductsTableProps {
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

export default function ProductsTable({
  products,
  loading,
  currentPage,
  setCurrentPage,
  pagination,
  totalFiltered,
  start,
  end,
}: ProductsTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [pendingAction, setPendingAction] = useState<'web' | 'mobile' | null>(null);

  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  }, []);

  const handlePreview = useCallback((product: Product) => {
    setSelectedProduct(product);
    setPreviewDialogOpen(true);
  }, []);

  const handleNextProduct = useCallback(() => {
    if (!selectedProduct) return;
    const currentIndex = products.findIndex(p => p.product_id === selectedProduct.product_id);
    if (currentIndex < products.length - 1) {
      setSelectedProduct(products[currentIndex + 1]);
    }
  }, [selectedProduct, products]);

  const handlePreviousProduct = useCallback(() => {
    if (!selectedProduct) return;
    const currentIndex = products.findIndex(p => p.product_id === selectedProduct.product_id);
    if (currentIndex > 0) {
      setSelectedProduct(products[currentIndex - 1]);
    }
  }, [selectedProduct, products]);

  const currentProductIndex = selectedProduct ? products.findIndex(p => p.product_id === selectedProduct.product_id) : -1;
  const hasNext = currentProductIndex >= 0 && currentProductIndex < products.length - 1;
  const hasPrevious = currentProductIndex > 0;

  const handleToggleWeb = useCallback((product: Product) => {
    setPendingProduct(product);
    setPendingAction('web');
    setConfirmDialogOpen(true);
  }, []);

  const handleToggleMobile = useCallback((product: Product) => {
    setPendingProduct(product);
    setPendingAction('mobile');
    setConfirmDialogOpen(true);
  }, []);

  const executeToggle = useCallback(async () => {
    if (!pendingProduct || !pendingAction) return;

    const newVisibility = pendingAction === 'web'
      ? !pendingProduct.visibility.web
      : !pendingProduct.visibility.mobile;

    try {
      const web = pendingAction === 'web' ? newVisibility : pendingProduct.visibility.web;
      const mobile = pendingAction === 'mobile' ? newVisibility : pendingProduct.visibility.mobile;

      await dispatch(updateProductVisibility(pendingProduct.product_id, web, mobile) as any);

      toast({
        title: "Success",
        description: `Product ${pendingAction} visibility ${newVisibility ? 'enabled' : 'disabled'} successfully`,
        className: newVisibility
          ? "bg-blue-100 border-blue-400 text-blue-800 border-2"
          : "bg-orange-100 border-orange-400 text-orange-800 border-2",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update product visibility",
        variant: "destructive",
        className: "bg-red-100 border-red-400 text-red-800 border-2",
      });
    } finally {
      setConfirmDialogOpen(false);
      setPendingProduct(null);
      setPendingAction(null);
    }
  }, [pendingProduct, pendingAction, dispatch, toast]);

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
              <TableHead>Visibility</TableHead>
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
            {products && Array.isArray(products) && products.map((product) => (
              <ProductRow
                key={product.product_id}
                product={product}
                onEdit={handleEdit}
                onPreview={handlePreview}
                onToggleWeb={handleToggleWeb}
                onToggleMobile={handleToggleMobile}
              />
            ))}
          </TableBody>
        </Table>
        {products.length > 0 && (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startTransition(() => setCurrentPage(currentPage - 1))}
                disabled={!pagination.hasPrev || loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={`w-8 h-8 p-0 ${
                        currentPage === pageNum
                          ? "gradient-primary text-primary-foreground"
                          : ""
                      }`}
                      onClick={() => startTransition(() => setCurrentPage(pageNum))}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => startTransition(() => setCurrentPage(currentPage + 1))}
                disabled={!pagination.hasNext || loading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 text-sm text-muted-foreground text-right">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total products) - Showing {start + 1} to {end}
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
        onNext={handleNextProduct}
        onPrevious={handlePreviousProduct}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      />

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction === 'web'
                ? (pendingProduct?.visibility.web ? 'Disable' : 'Enable')
                : (pendingProduct?.visibility.mobile ? 'Disable' : 'Enable')
              } {pendingAction === 'web' ? 'Web' : 'Mobile'} Visibility
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {pendingAction === 'web'
                ? (pendingProduct?.visibility.web ? 'disable' : 'enable')
                : (pendingProduct?.visibility.mobile ? 'disable' : 'enable')
              } {pendingAction === 'web' ? 'web' : 'mobile'} visibility for "{pendingProduct?.product_name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeToggle}>
              {pendingAction === 'web'
                ? (pendingProduct?.visibility.web ? 'Disable' : 'Enable')
                : (pendingProduct?.visibility.mobile ? 'Disable' : 'Enable')
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}