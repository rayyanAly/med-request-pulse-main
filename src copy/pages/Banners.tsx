import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchBanners } from "@/redux/actions/bannerActions";
import { RootState } from "@/redux/store";
import { Banner } from "@/redux/types";
import BannerCard from "@/components/banners/BannerCard";
import BannerSkeleton from "@/components/skeleton/BannerSkeleton";
import CreateBannerDialog from "@/components/banners/CreateBannerDialog";

const getBannerStatus = (banner: Banner) => {
  const now = new Date();
  const expiryDate = new Date(banner.expiry_date);
  // Set expiry date to 23:59:59 for comparison
  expiryDate.setHours(23, 59, 59, 999);
  // Dubai timezone (UTC+4)
  const nowDubai = new Date(now.getTime() + (now.getTimezoneOffset() + 4 * 60) * 60000);
  const expiryDubai = new Date(expiryDate.getTime() + (expiryDate.getTimezoneOffset() + 4 * 60) * 60000);
  return nowDubai <= expiryDubai ? 'active' : 'inactive';
};

export default function Banners() {
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector((state: RootState) => state.banners);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchBanners() as any);
  }, [dispatch]);

  // Handle filter changes
  useEffect(() => {
    setFilterLoading(true);
    dispatch(fetchBanners() as any);
  }, [statusFilter, typeFilter, searchQuery, dispatch]);

  // Reset filter loading when banners are loaded
  useEffect(() => {
    if (!loading) {
      setFilterLoading(false);
    }
  }, [loading]);

  const filteredBanners = useMemo(() => {
    return banners.filter((banner) => {
      const status = getBannerStatus(banner);
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (typeFilter !== "all" && banner.banner_type !== typeFilter) return false;
      if (searchQuery && !banner.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !banner.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [banners, statusFilter, typeFilter, searchQuery]);

  const stats = useMemo(() => ({
    total: banners.length,
    active: banners.filter(b => getBannerStatus(b) === 'active').length,
    inactive: banners.filter(b => getBannerStatus(b) === 'inactive').length,
  }), [banners]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-normal text-foreground">Banners</h1>
          <p className="text-muted-foreground text-lg font-light">
            Manage website and mobile app banners
          </p>
        </div>
        <Button
          className="gap-2 gradient-primary text-primary-foreground"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create Banner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Banners</p>
          <p className="mt-1 text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="mt-1 text-2xl font-bold text-success">
            {stats.active}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="mt-1 text-2xl font-bold text-destructive">
            {stats.inactive}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search banners..."
                className="input-search pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="brands">Brands</SelectItem>
                <SelectItem value="categories">Categories</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="page">Page</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => dispatch(fetchBanners() as any)}
            disabled={loading || filterLoading}
          >
            <RefreshCw className={`h-4 w-4 ${(loading || filterLoading) ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Banners Grid */}
      {(loading || filterLoading) ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BannerSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">{error}</div>
      ) : filteredBanners.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {banners.length === 0 ? "No banners available" : "No banners match the current filters"}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBanners.map((banner) => (
            <BannerCard key={banner.banner_id} banner={banner} />
          ))}
        </div>
      )}

      <CreateBannerDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
