import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Check, ChevronsUpDown, Settings } from "lucide-react";
import { ProductManufacturer } from "@/redux/types";
import ProductSearchAutocomplete from "./ProductSearchAutocomplete";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { UPDATE_PRODUCT_STATUS_SUCCESS } from "@/redux/constants/productConstants";
import { useToast } from "@/hooks/use-toast";

interface ProductsFiltersProps {
  manufacturerFilter: string[];
  setManufacturerFilter: (value: string[]) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setCurrentPage: (page: number) => void;
  manufacturers: any[];
  totalProducts: number;
  onProductSelect?: (productId: number) => void;
}

export default function ProductsFilters({
  manufacturerFilter,
  setManufacturerFilter,
  searchQuery,
  setSearchQuery,
  setCurrentPage,
  manufacturers,
  totalProducts,
  onProductSelect,
}: ProductsFiltersProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localManufacturers, setLocalManufacturers] = useState<string[]>(manufacturerFilter);
  const [manufacturerOpen, setManufacturerOpen] = useState(false);
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false);
  const [productCodes, setProductCodes] = useState("");
  const [visibilityAction, setVisibilityAction] = useState<"enable" | "disable">("enable");
  const [isUpdating, setIsUpdating] = useState(false);

  const uniqueManufacturers = useMemo(() => {
    if (!manufacturers || !Array.isArray(manufacturers) || manufacturers.length === 0) return [];
    const seen = new Set();
    return manufacturers.filter((manufacturer) => {
      if (!manufacturer) return false;
      const id = manufacturer.manufacturer_id || manufacturer.id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [manufacturers]);

  const hasFilters = localSearch.trim() || localManufacturers.length > 0;
  const hasManufacturerFilters = localManufacturers.length > 0;

  const applyFilters = () => {
    setSearchQuery(localSearch);
    setManufacturerFilter(localManufacturers);
    setCurrentPage(1);
  };

  const clearManufacturers = () => {
    setLocalManufacturers([]);
    setManufacturerFilter([]);
    // Don't reset page - stay on current page
  };

  const handleBulkUpdate = async () => {
    if (!productCodes.trim()) return;

    setIsUpdating(true);
    try {
      const web = visibilityAction === "enable" ? 1 : 0;
      const mobile = visibilityAction === "enable" ? 1 : 0;

      // Call the API directly to get the response for the success message
      const response = await fetch('/api/products/bulk/visibility', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codes: productCodes.trim(),
          web: web,
          mobile: mobile
        })
      });

      const result = await response.json();

      if (result.success) {
        // Dispatch the action to update Redux state
        dispatch({ type: UPDATE_PRODUCT_STATUS_SUCCESS, payload: result.data });

        const updatedCount = result.data?.updated_count || 0;
        const isEnabling = visibilityAction === "enable";
        toast({
          title: "Success",
          description: `Updated visibility for ${updatedCount} product(s)`,
          className: isEnabling
            ? "bg-blue-100 border-blue-400 text-blue-800 border-2"
            : "bg-orange-100 border-orange-400 text-orange-800 border-2",
        });
      } else {
        throw new Error(result.error || 'Failed to update product visibility');
      }

      // Clear form and close sheet
      setProductCodes("");
      setVisibilityAction("enable");
      setBulkUpdateOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update product visibility",
        variant: "destructive",
        className: "bg-red-100 border-red-400 text-red-800 border-2",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="glass-card relative z-10">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Search and Action Buttons Row */}
          <div className="flex gap-3 relative z-50">
            <ProductSearchAutocomplete
              value={localSearch}
              onChange={(value) => {
                setLocalSearch(value);
                if (value === '') {
                  applyFilters();
                }
              }}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              onProductSelect={() => applyFilters()}
              onClear={() => applyFilters()}
            />
            <Button onClick={applyFilters} className="gap-2">
              <Filter className="h-4 w-4" />
              Apply
            </Button>
          </div>

          {/* Filters Count Badge */}
          {hasFilters && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">
                {totalProducts} products found
              </Badge>
              {localManufacturers.length > 0 && (
                <Badge variant="outline">
                  {localManufacturers.length} manufacturers
                </Badge>
              )}
            </div>
          )}
          
          {/* Dropdowns Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Popover open={manufacturerOpen} onOpenChange={setManufacturerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={manufacturerOpen}
                  className="w-[250px] justify-between"
                >
                  {localManufacturers.length === 0
                    ? "All Manufacturers"
                    : `${localManufacturers.length} selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search manufacturers..." />
                  <CommandList>
                    <CommandEmpty>No manufacturer found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setLocalManufacturers([]);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            localManufacturers.length === 0 ? "opacity-100" : "opacity-0"
                          )}
                        />
                        All Manufacturers
                      </CommandItem>
                      {uniqueManufacturers.map((manufacturer) => {
                        const id = (manufacturer.manufacturer_id || manufacturer.id)?.toString();
                        if (!id) return null;
                        const isSelected = localManufacturers.includes(id);
                        return (
                          <CommandItem
                            key={id}
                            value={manufacturer.name}
                            onSelect={() => {
                              if (isSelected) {
                                setLocalManufacturers(localManufacturers.filter((m) => m !== id));
                              } else {
                                setLocalManufacturers([...localManufacturers, id]);
                              }
                            }}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="h-4 w-4"
                              />
                              <span className="flex-1">{manufacturer.name || "Unknown"}</span>
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {hasManufacturerFilters && (
              <Button onClick={clearManufacturers} variant="outline" size="sm" className="gap-1">
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
            </div>
            <Sheet open={bulkUpdateOpen} onOpenChange={setBulkUpdateOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Bulk Update
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle className="font-light">Bulk Visibility Update</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <Label htmlFor="productCodes" className="text-sm font-light">
                      Product Codes
                    </Label>
                    <Textarea
                      id="productCodes"
                      placeholder="Enter product dynamic codes or SKUs"
                      value={productCodes}
                      onChange={(e) => setProductCodes(e.target.value)}
                      className="mt-2 font-light"
                      rows={4}
                    />
                    <p className="text-xs font-light tracking-wider text-muted-foreground mt-2">
                      Enter multiple codes separated by commas
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Action</Label>
                    <RadioGroup
                      value={visibilityAction}
                      onValueChange={(value: "enable" | "disable") => setVisibilityAction(value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="enable" id="enable" />
                        <Label htmlFor="enable" className="text-sm">
                          Enable web & mobile visibility
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="disable" id="disable" />
                        <Label htmlFor="disable" className="text-sm">
                          Disable web & mobile visibility
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleBulkUpdate}
                      className="flex-1"
                      disabled={!productCodes.trim() || isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Update Products"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setProductCodes("");
                        setVisibilityAction("enable");
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}