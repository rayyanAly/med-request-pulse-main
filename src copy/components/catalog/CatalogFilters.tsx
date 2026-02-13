import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductManufacturer } from "@/redux/types";

interface CatalogFiltersProps {
  manufacturerFilter: string;
  setManufacturerFilter: (value: string) => void;
  stockStatusFilter: string;
  setStockStatusFilter: (value: string) => void;
  setCurrentPage: (page: number) => void;
  manufacturers: ProductManufacturer[];
}

export default function CatalogFilters({
  manufacturerFilter,
  setManufacturerFilter,
  stockStatusFilter,
  setStockStatusFilter,
  setCurrentPage,
  manufacturers,
}: CatalogFiltersProps) {
  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Select 
            value={manufacturerFilter} 
            onValueChange={(value) => { 
              setManufacturerFilter(value); 
              setCurrentPage(1); 
            }}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="All Manufacturers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Manufacturers</SelectItem>
              {manufacturers.map((manufacturer) => (
                <SelectItem key={manufacturer.id} value={manufacturer.id.toString()}>
                  {manufacturer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stockStatusFilter} onValueChange={(value) => { setStockStatusFilter(value); setCurrentPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}