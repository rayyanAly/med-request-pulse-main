import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BannerBasicInfoProps {
  name: string;
  setName: (value: string) => void;
  bannerType: string;
  setBannerType: (value: string) => void;
  expiryDate: Date | undefined;
  setExpiryDate: (date: Date | undefined) => void;
  status: number;
  setStatus: (value: number) => void;
  description: string;
  setDescription: (value: string) => void;
  descriptionImage: string;
  setDescriptionImage: (value: string) => void;
  errors: Record<string, string>;
}

const bannerTypes = [
  { value: 'brands', label: 'Brands' },
  { value: 'categories', label: 'Categories' },
  { value: 'products', label: 'Products' },
  { value: 'page', label: 'Page' },
  { value: 'others', label: 'Others' },
];

export default function BannerBasicInfo({
  name,
  setName,
  bannerType,
  setBannerType,
  expiryDate,
  setExpiryDate,
  status,
  setStatus,
  description,
  setDescription,
  descriptionImage,
  setDescriptionImage,
  errors,
}: BannerBasicInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Basic Information
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Banner Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter banner name"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bannerType">Banner Type *</Label>
          <Select value={bannerType} onValueChange={setBannerType}>
            <SelectTrigger className={errors.bannerType ? "border-destructive" : ""}>
              <SelectValue placeholder="Select banner type" />
            </SelectTrigger>
            <SelectContent>
              {bannerTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.bannerType && (
            <p className="text-xs text-destructive">{errors.bannerType}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Expiry Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex h-10 w-full items-center justify-start rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  !expiryDate && "text-muted-foreground",
                  errors.expiryDate && "border-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expiryDate ? format(expiryDate, "PPP") : "Pick a date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={expiryDate}
                onSelect={(date) => {
                  if (date) {
                    // Set to end of selected day in local time
                    const localEndOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
                    setExpiryDate(localEndOfDay);
                  } else {
                    setExpiryDate(undefined);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.expiryDate && (
            <p className="text-xs text-destructive">{errors.expiryDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status.toString()} onValueChange={(value) => setStatus(parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Active</SelectItem>
              <SelectItem value="0">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter banner description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descriptionImage">Description Image</Label>
        <Input
          id="descriptionImage"
          value={descriptionImage}
          onChange={(e) => setDescriptionImage(e.target.value)}
          placeholder="Enter description image path"
        />
      </div>
    </div>
  );
}