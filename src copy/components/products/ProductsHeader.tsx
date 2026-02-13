import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductsHeaderProps {
  onCreateProduct?: () => void;
}

export default function ProductsHeader({ onCreateProduct }: ProductsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-4xl font-normal text-foreground">
          Products
        </h1>
        <p className="text-lg font-light text-muted-foreground">
          View and manage product catalog
        </p>
      </div>
      {onCreateProduct && (
        <Button onClick={onCreateProduct} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Product
        </Button>
      )}
    </div>
  );
}