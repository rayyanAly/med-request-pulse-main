import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BannerObjectSelectionProps {
  bannerType: string;
  objectId: number | null;
  setObjectId: (id: number | null) => void;
  manufacturers: any[];
  categories: any[];
  products: any[];
  referenceDataLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  errors: Record<string, string>;
}

export default function BannerObjectSelection({
  bannerType,
  objectId,
  setObjectId,
  manufacturers,
  categories,
  products,
  referenceDataLoading,
  searchQuery,
  setSearchQuery,
  commandOpen,
  setCommandOpen,
  errors,
}: BannerObjectSelectionProps) {
  // Memoized filtered data for performance
  const filteredOptions = useMemo(() => {
    if (!bannerType || bannerType === 'page' || bannerType === 'others') return [];

    const data = bannerType === 'brands' ? (manufacturers || []) :
                bannerType === 'categories' ? (categories || []) : (products || []);
    const idField = bannerType === 'brands' ? 'manufacturer_id' :
                   bannerType === 'categories' ? 'category_id' : 'product_id';

    const validData = data.filter(item => item[idField]);

    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      return validData.filter(item =>
        item.name && item.name.toLowerCase().includes(searchLower)
      );
    }

    // When no search, show all items (cached data loads instantly)
    return validData;
  }, [bannerType, manufacturers, categories, products, searchQuery]);

  // Helper to get selected object name
  const getSelectedObjectName = () => {
    if (!objectId || !bannerType) return "";
    const data = bannerType === 'brands' ? (manufacturers || []) :
                bannerType === 'categories' ? (categories || []) : (products || []);
    const idField = bannerType === 'brands' ? 'manufacturer_id' :
                   bannerType === 'categories' ? 'category_id' : 'product_id';
    const selectedItem = data.find(item => item[idField] === objectId);
    return selectedItem ? selectedItem.name : "";
  };

  if (!(bannerType === 'brands' || bannerType === 'categories' || bannerType === 'products')) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label>
        {bannerType === 'brands' ? 'Manufacturer' :
         bannerType === 'categories' ? 'Category' : 'Product'} *
      </Label>
      {referenceDataLoading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : (
        <Popover open={commandOpen} onOpenChange={setCommandOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={commandOpen}
              className={cn(
                "w-full justify-between",
                errors.objectId && "border-destructive"
              )}
            >
              {objectId ? getSelectedObjectName() : `Select ${bannerType.slice(0, -1)}...`}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[400px] p-0"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="flex flex-col">
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  placeholder={`Search ${bannerType.slice(0, -1)}s...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div
                className="max-h-[300px] overflow-y-scroll overscroll-contain p-1"
                style={{
                  scrollbarWidth: 'thin',
                  WebkitOverflowScrolling: 'touch'
                }}
                onWheel={(e) => {
                  e.stopPropagation();
                }}
              >
                {(() => {
                  const idField = bannerType === 'brands' ? 'manufacturer_id' :
                                 bannerType === 'categories' ? 'category_id' : 'product_id';

                  if (filteredOptions.length === 0) {
                    return (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        {searchQuery.trim()
                          ? `No ${bannerType.slice(0, -1)}s found.`
                          : `No ${bannerType.slice(0, -1)}s available.`
                        }
                      </div>
                    );
                  }

                  return filteredOptions.map((item) => {
                    const itemId = item[idField];
                    const isSelected = objectId === itemId;
                    return (
                      <div
                        key={itemId}
                        onClick={() => {
                          setObjectId(itemId);
                          setCommandOpen(false);
                          setSearchQuery("");
                        }}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                          isSelected && "bg-accent"
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {item.name}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
      {errors.objectId && (
        <p className="text-xs text-destructive">{errors.objectId}</p>
      )}
    </div>
  );
}