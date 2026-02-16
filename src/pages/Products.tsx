import { useEffect, useState } from "react";
import { Search, Grid, List, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts, fetchAllCategories } from "@/redux/actions/productActions";
import { RootState } from "@/redux/store";
import { Product, Category } from "@/api/types";

const ITEMS_PER_PAGE = 100;

// Base URL for product images
const IMAGE_BASE_URL = "https://dashboard.800pharmacy.ae/";

// Helper to get full image URL
const getProductImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return "/placeholder.svg";
  // If already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  // Prepend the base URL
  return `${IMAGE_BASE_URL}${imagePath}`;
};

export default function Products() {
  const dispatch = useDispatch<any>();
  const { products, categories, loading, error } = useSelector((state: RootState) => state.products);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toString().includes(searchTerm.toLowerCase()) ||
    (product.plus_symptoms && product.plus_symptoms.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categoryFilteredProducts = selectedCategory === "all" 
    ? filteredProducts 
    : filteredProducts.filter((p: Product) => p.category_id === parseInt(selectedCategory));

  const totalPages = Math.ceil(categoryFilteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = categoryFilteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            Browse your pharmacy product catalog ({products.length} products)
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, or symptoms..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={(value) => {
              setSelectedCategory(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-full sm:w-48 h-9">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category: Category) => (
                  <SelectItem key={category.category_id} value={String(category.category_id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                className="h-9 w-9"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                className="h-9 w-9"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      {loading ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" : "space-y-4"}>
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-32 w-full rounded-lg mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => dispatch(fetchAllProducts())} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : paginatedProducts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No products found</p>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginatedProducts.map((product: Product) => (
              <Card key={product.product_id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square relative bg-muted">
                  <img
                    src={getProductImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  {product.prescription_required === 1 && (
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      Rx
                    </Badge>
                  )}
                </div>
                <CardContent className="p-3 space-y-1.5">
                  <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>SKU: {product.sku}</span>
                    {product.unit && <span>• {product.unit}</span>}
                  </div>
                  {product.category_name && (
                    <Badge variant="outline" className="text-[10px] h-5">
                      {product.category_name}
                    </Badge>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-primary text-sm">AED {product.price.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">
                      {product.available_stock || 0} in stock
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedProducts.map((product: Product) => (
              <Card key={product.product_id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={getProductImageUrl(product.image)}
                      alt={product.name}
                      className="w-16 h-16 object-contain rounded-lg bg-muted shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-medium truncate">{product.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>SKU: {product.sku}</span>
                            {product.unit && <span>• {product.unit}</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {product.category_name && (
                              <Badge variant="outline" className="text-xs">
                                {product.category_name}
                              </Badge>
                            )}
                            {product.prescription_required === 1 && (
                              <Badge variant="secondary" className="text-xs">
                                Rx Required
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-primary">AED {product.price.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {product.available_stock || 0} in stock
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
