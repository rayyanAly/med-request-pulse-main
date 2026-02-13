import { useState, useEffect, useMemo, startTransition } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Search, Plus, RefreshCw, ChevronLeft, ChevronRight, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchManufacturers } from "@/redux/actions/manufacturerActions";
import { RootState } from "@/redux/store";
import { Manufacturer } from "@/redux/types";
import CreateManufacturerDialog from "@/components/manufacturers/CreateManufacturerDialog";
import EditManufacturerDialog from "@/components/manufacturers/EditManufacturerDialog";
import ViewManufacturerDialog from "@/components/manufacturers/ViewManufacturerDialog";
import ManufacturersSkeleton from "@/components/skeleton/ManufacturersSkeleton";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return IMAGE_BASE_URL + imagePath;
};

const ITEMS_PER_PAGE = 50;

export default function Manufacturers() {
  const dispatch = useDispatch<AppDispatch>();
  const { manufacturers = [], loading, error } = useSelector(
    (state: RootState) => state.manufacturers
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);

  useEffect(() => {
    dispatch(fetchManufacturers() as any);
  }, [dispatch]);

  const filteredManufacturers = useMemo(() => {
    return manufacturers.filter((manufacturer) => {
      if (statusFilter !== "all") {
        const status = manufacturer.status === 1 ? "active" : "inactive";
        if (status !== statusFilter) return false;
      }
      if (
        searchQuery &&
        !manufacturer.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [manufacturers, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredManufacturers.length / ITEMS_PER_PAGE);
  const totalManufacturers = filteredManufacturers.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalManufacturers);
  const currentManufacturers = filteredManufacturers.slice(startIndex, endIndex);

  const stats = useMemo(
    () => ({
      total: manufacturers.length,
      active: manufacturers.filter((m) => m.status === 1).length,
      inactive: manufacturers.filter((m) => m.status === 0).length,
    }),
    [manufacturers]
  );

  const handleView = (manufacturer: Manufacturer) => {
    setSelectedManufacturer(manufacturer);
    setViewDialogOpen(true);
  };

  const handleEdit = (manufacturer: Manufacturer) => {
    setSelectedManufacturer(manufacturer);
    setEditDialogOpen(true);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  if (loading && manufacturers.length === 0) {
    return <ManufacturersSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-normal text-foreground">Manufacturers</h1>
          <p className="text-muted-foreground text-lg font-light">
            Manage product manufacturers
          </p>
        </div>
        <Button
          className="gap-2 gradient-primary text-primary-foreground"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Manufacturer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Manufacturers</p>
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
                placeholder="Search manufacturers..."
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
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => dispatch(fetchManufacturers() as any)}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Manufacturers Table */}
      {filteredManufacturers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {manufacturers.length === 0
            ? "No manufacturers available"
            : "No manufacturers match the current filters"}
        </div>
      ) : (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              All Manufacturers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Show in Home</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentManufacturers.map((manufacturer) => {
                  const imageUrl = getImageUrl(manufacturer.image);
                  return (
                    <TableRow key={manufacturer.manufacturer_id}>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-1 text-sm font-mono font-semibold text-foreground">
                          {manufacturer.manufacturer_id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{manufacturer.name}</span>
                      </TableCell>
                      <TableCell>{manufacturer.sort_order}</TableCell>
                      <TableCell>
                        {manufacturer.show_in_home === 1 ? (
                          <span className="status-badge status-info">Yes</span>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`status-badge ${
                          manufacturer.status === 1 ? "status-success" : "status-warning"
                        }`}>
                          {manufacturer.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="h-12 w-20 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={manufacturer.name}
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">No Img</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleView(manufacturer)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(manufacturer)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 py-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startTransition(() => setCurrentPage(currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          className={`w-8 h-8 p-0 ${
                            currentPage === pageNum
                              ? "gradient-primary text-primary-foreground"
                              : ""
                          }`}
                          onClick={() => startTransition(() => setCurrentPage(pageNum))}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startTransition(() => setCurrentPage(currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 text-sm text-muted-foreground text-right">
                  Page {currentPage} of {totalPages} ({totalManufacturers} total) - Showing {startIndex + 1} to {endIndex}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <CreateManufacturerDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      {selectedManufacturer && (
        <>
          <EditManufacturerDialog
            open={editDialogOpen}
            onOpenChange={(open) => {
              setEditDialogOpen(open);
              if (!open) setSelectedManufacturer(null);
            }}
            manufacturer={selectedManufacturer}
          />
          <ViewManufacturerDialog
            open={viewDialogOpen}
            onOpenChange={(open) => {
              setViewDialogOpen(open);
              if (!open) setSelectedManufacturer(null);
            }}
            manufacturer={selectedManufacturer}
            onEdit={handleEdit}
          />
        </>
      )}
    </div>
  );
}
