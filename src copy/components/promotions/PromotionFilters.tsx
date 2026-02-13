import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Download } from "lucide-react";
import * as XLSX from 'xlsx';

interface PromotionFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  manufacturerFilter: string;
  setManufacturerFilter: (value: string) => void;
  valueFilter: string;
  setValueFilter: (value: string) => void;
  setCurrentPage: (page: number) => void;
  uniqueManufacturers: string[];
  uniqueValues: string[];
  filteredPromotions: any[];
}

export default function PromotionFilters({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  manufacturerFilter,
  setManufacturerFilter,
  valueFilter,
  setValueFilter,
  setCurrentPage,
  uniqueManufacturers,
  uniqueValues,
  filteredPromotions,
}: PromotionFiltersProps) {
  const handleExportExcel = () => {
    // Convert UTC date to Dubai timezone (UTC+4)
    const convertToDubaiDate = (utcDate: string) => {
      const date = new Date(utcDate);
      // Add 4 hours for Dubai timezone
      const dubaiDate = new Date(date.getTime() + (4 * 60 * 60 * 1000));
      return dubaiDate;
    };
    
    // Format date for display (DD/MM/YYYY)
    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    
    // Transform data to match UI format
    const exportData = filteredPromotions.map(promo => {
      const now = new Date();
      const startDateDubai = convertToDubaiDate(promo.start_date);
      const endDateDubai = convertToDubaiDate(promo.end_date);
      
      // Set end date to 23:59:59 in Dubai timezone
      endDateDubai.setHours(23, 59, 59, 999);
      
      const nowDubai = new Date(now.getTime() + (4 * 60 * 60 * 1000));
      const isActive = nowDubai >= startDateDubai && nowDubai <= endDateDubai;
      
      return {
        'Item Code': promo.item_code,
        'Product Name': promo.product_name,
        'Promotion Code': promo.promotion_code,
        'Type': promo.promotion_type.replace('fix_percent', 'Fixed Percentage').replace('buy_one_get_one_free', 'Buy One Get One Free').replace('buy_one_get_50%_second', 'Buy One Get 50% Second').replace('buy_two_get_one_free', 'Buy Two Get One Free').replace(/_/g, ' '),
        'Discount Value': promo.promotion_value,
        'Stock': promo.available_stock,
        'Manufacturer': promo.manufacturer_name,
        'Start Date': formatDate(startDateDubai),
        'End Date': formatDate(endDateDubai),
        'Status': isActive ? 'Active' : 'Expired',
      };
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Auto-size columns
    const colWidths = [
      { wch: 12 }, // Item Code
      { wch: 30 }, // Product Name
      { wch: 15 }, // Promotion Code
      { wch: 20 }, // Type
      { wch: 15 }, // Discount Value
      { wch: 8 },  // Stock
      { wch: 20 }, // Manufacturer
      { wch: 12 }, // Start Date
      { wch: 12 }, // End Date
      { wch: 10 }, // Status
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Promotions');

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `promotions_${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };
  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search promotions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Fixed Percentage">Fixed Percentage</SelectItem>
                <SelectItem value="Buy One Get One Free">Buy One Get One Free</SelectItem>
                <SelectItem value="Buy One Get 50% Second">Buy One Get 50% Second</SelectItem>
                <SelectItem value="Buy Two Get One Free">Buy Two Get One Free</SelectItem>
              </SelectContent>
            </Select>
            <Select value={manufacturerFilter} onValueChange={(value) => { setManufacturerFilter(value); setCurrentPage(1); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Manufacturer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Manufacturers</SelectItem>
                {uniqueManufacturers.map(manufacturer => (
                  <SelectItem key={manufacturer} value={manufacturer}>
                    {manufacturer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={valueFilter} onValueChange={(value) => { setValueFilter(value); setCurrentPage(1); }}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Values</SelectItem>
                {uniqueValues.map(value => (
                  <SelectItem key={value} value={value}>
                    {value}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleExportExcel}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={filteredPromotions.length === 0}
            >
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}