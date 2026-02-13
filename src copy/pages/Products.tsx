import { useState, useEffect, useMemo, startTransition } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchProducts } from "@/redux/actions/productActions";
import ProductsHeader from "@/components/products/ProductsHeader";
import ProductsFilters from "@/components/products/ProductsFilters";
import ProductsTable from "@/components/products/ProductsTable";
import ProductsSkeleton from "@/components/products/ProductsSkeleton";
import ProductPreviewDialog from "@/components/products/ProductPreviewDialog";
import EditProductDialog from "@/components/products/EditProductDialog";
import CreateProductDialog from "@/components/products/CreateProductDialog";

export default function Products() {
  const dispatch = useDispatch<AppDispatch>();
  const { products = [], allProducts = [], loading, error, pagination } = useSelector((state: any) => state.products);
  const { manufacturers = [] } = useSelector((state: any) => state.manufacturers);
  const [manufacturerFilter, setManufacturerFilter] = useState<string[]>([]);
  const [stockStatusFilter, setStockStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  // Fetch products when page or filters change
  useEffect(() => {
    dispatch(fetchProducts(currentPage, 50, manufacturerFilter, searchQuery) as any);
  }, [dispatch, currentPage, manufacturerFilter, searchQuery]);

  const handleProductSelect = async (productId: number) => {
    // Try to find in current products first
    let product = allProducts?.find(p => p.product_id === productId);
    
    // If not found, fetch from API
    if (!product) {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const result = await response.json();
        product = result.data || result;
      } catch (error) {
        console.error('Error fetching product:', error);
        return;
      }
    }
    
    if (product) {
      setSelectedProduct(product);
      setShowPreview(true);
    }
  };

  const handleEdit = () => {
    setShowPreview(false);
    setShowEdit(true);
  };

  const handleCreate = () => {
    setShowCreate(true);
  };

  // Only apply stock filter client-side
  const filteredProducts = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) return [];
    
    return allProducts.filter((product: any) => {
      const matchesStock = stockStatusFilter === "all" || 
        (stockStatusFilter === "in-stock" && product.available_stock > 0) || 
        (stockStatusFilter === "out-of-stock" && product.available_stock === 0);
      return matchesStock;
    });
  }, [allProducts, stockStatusFilter]);

  // Use pagination data from API
  const totalFiltered = filteredProducts.length;
  const totalPages = pagination?.totalPages || 1;
  const totalProducts = pagination?.total || 0;

  if (loading && allProducts.length === 0) {
    return <ProductsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ProductsHeader onCreateProduct={handleCreate} />
      <ProductsFilters
        manufacturerFilter={manufacturerFilter}
        setManufacturerFilter={setManufacturerFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setCurrentPage={setCurrentPage}
        manufacturers={manufacturers}
        totalProducts={totalProducts}
        onProductSelect={handleProductSelect}
      />
      <ProductsTable
        products={filteredProducts || []}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagination={{
          page: currentPage,
          limit: 50,
          total: totalProducts,
          totalPages: totalPages,
          hasNext: pagination?.hasNext || currentPage < totalPages,
          hasPrev: pagination?.hasPrev || currentPage > 1
        }}
        totalFiltered={totalFiltered}
        start={(currentPage - 1) * 50}
        end={Math.min(currentPage * 50, totalProducts)}
      />
      {selectedProduct && (
        <>
          <ProductPreviewDialog
            open={showPreview}
            onOpenChange={(open) => {
              setShowPreview(open);
              if (!open) setSelectedProduct(null);
            }}
            product={selectedProduct}
            onEdit={handleEdit}
          />
          <EditProductDialog
            open={showEdit}
            onOpenChange={(open) => {
              setShowEdit(open);
              if (!open) setSelectedProduct(null);
            }}
            product={selectedProduct}
          />
        </>
      )}
      <CreateProductDialog
        open={showCreate}
        onOpenChange={setShowCreate}
      />
    </div>
  );
}
