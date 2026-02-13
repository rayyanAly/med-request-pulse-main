import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  product_id: number;
  product_name?: string;
  name?: string; // Alternative field name from API
  dynamic_code: string;
  sku?: string;
  image?: string;
  price: number;
  manufacturer?: {
    name: string;
  };
}

interface ProductSearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onProductSelect?: (productId: number) => void;
  onClear?: () => void;
}

const getImageUrl = (imagePath: string) => {
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
  return baseUrl + imagePath;
};

export default function ProductSearchAutocomplete({
  value,
  onChange,
  onKeyDown,
  onProductSelect,
  onClear
}: ProductSearchAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (value.trim().length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        // Search products by name, SKU, dynamic_code, AND manufacturer name
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(value.trim())}&limit=50`);
        const result = await response.json();
        
        const products = Array.isArray(result) ? result : result.data || [];
        setSuggestions(products);
        setShowDropdown(products.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(searchProducts, 300);
    return () => clearTimeout(timer);
  }, [value]);

  const handleSelectProduct = (product: Product) => {
    onChange(product.dynamic_code || product.sku || product.product_name || product.name || '');
    setShowDropdown(false);
    if (onProductSelect) {
      onProductSelect(product.product_id);
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 z-[70]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        placeholder="Search by name, SKU, or dynamic code..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        className="pl-10 pr-10 relative z-10"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 z-10"
          onClick={() => {
            onChange('');
            if (onClear) {
              onClear();
            }
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      {isLoading && !value && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground z-10" />
      )}
      
      {showDropdown && suggestions.length > 0 && (
        <Card className="absolute z-[9999] w-full mt-1 max-h-[400px] overflow-y-auto shadow-lg border-2 bg-background">
          <div className="p-1">
            {suggestions.map((product) => (
              <div
                key={product.product_id}
                className="flex items-center gap-3 p-2 hover:bg-accent cursor-pointer rounded-md transition-colors"
                onClick={() => handleSelectProduct(product)}
              >
                {product.image && (
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.product_name}
                    className="w-12 h-12 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ddd" width="48" height="48"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.product_name || product.name}</p>
                  <div className="flex gap-2 items-center text-xs text-muted-foreground">
                    <span className="font-mono">{product.dynamic_code}</span>
                    {product.sku && <span>•</span>}
                    {product.sku && <span className="font-mono">{product.sku}</span>}
                    {product.manufacturer?.name && <span>•</span>}
                    {product.manufacturer?.name && <span>{product.manufacturer.name}</span>}
                  </div>
                </div>
                <div className="text-sm font-semibold text-primary">
                  AED {product.price}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
