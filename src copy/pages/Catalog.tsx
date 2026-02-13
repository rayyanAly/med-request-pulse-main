import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchProducts } from "@/redux/actions/productActions";
import CatalogHeader from "@/components/catalog/CatalogHeader";
import CatalogFilters from "@/components/catalog/CatalogFilters";
import CatalogTable from "@/components/catalog/CatalogTable";
import CatalogSkeleton from "@/components/catalog/CatalogSkeleton";

export default function Catalog() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, allProducts, manufacturers, loading, error, pagination } = useSelector((state: any) => state.products);
  const [manufacturerFilter, setManufacturerFilter] = useState("all");
  const [stockStatusFilter, setStockStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts(1, 10000) as any);
  }, [dispatch]);

  const filteredProducts = allProducts.filter((product: any) => {
    const matchesManufacturer = manufacturerFilter === "all" || product.manufacturer.id.toString() === manufacturerFilter;
    const matchesStock = stockStatusFilter === "all" || 
      (stockStatusFilter === "in-stock" && product.available_stock > 0) || 
      (stockStatusFilter === "out-of-stock" && product.available_stock === 0);
    return matchesManufacturer && matchesStock;
  });

  const totalFiltered = filteredProducts.length;
  const totalPages = Math.ceil(totalFiltered / 100);
  const start = (currentPage - 1) * 100;
  const end = start + 100;
  const paginatedProducts = filteredProducts.slice(start, end);

  if (loading && products.length === 0) {
    return <CatalogSkeleton />;
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
      <CatalogHeader />
      <CatalogFilters
        manufacturerFilter={manufacturerFilter}
        setManufacturerFilter={setManufacturerFilter}
        stockStatusFilter={stockStatusFilter}
        setStockStatusFilter={setStockStatusFilter}
        setCurrentPage={setCurrentPage}
        manufacturers={manufacturers}
      />
      <CatalogTable
        products={paginatedProducts}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagination={{
          page: currentPage,
          limit: 100,
          total: totalFiltered,
          totalPages: totalPages,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1
        }}
        totalFiltered={totalFiltered}
        start={start}
        end={end}
      />
    </div>
  );
}