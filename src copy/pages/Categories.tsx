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
import { fetchCategories } from "@/redux/actions/categoryActions";
import { RootState } from "@/redux/store";
import { Category } from "@/redux/types";
import CreateCategoryDialog from "@/components/categories/CreateCategoryDialog";
import EditCategoryDialog from "@/components/categories/EditCategoryDialog";
import ViewCategoryDialog from "@/components/categories/ViewCategoryDialog";
import CategoriesSkeleton from "@/components/skeleton/CategoriesSkeleton";

const ITEMS_PER_PAGE = 50;

export default function Categories() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories = [], loading, error } = useSelector(
    (state: RootState) => state.categories
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [menuFilter, setMenuFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    dispatch(fetchCategories() as any);
  }, [dispatch]);

  // Build parent hierarchy map
  const parentMap = useMemo(() => {
    const map: Record<number, string> = {};
    categories.forEach((cat) => {
      map[cat.category_id] = cat.name;
    });
    return map;
  }, [categories]);

  const getParentHierarchy = (parentId: number) => {
    if (parentId === 0) return "Root";
    const parentName = parentMap[parentId];
    if (!parentName) return `ID: ${parentId}`;
    return parentName;
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      if (statusFilter !== "all") {
        const status = category.status === 1 ? "active" : "inactive";
        if (status !== statusFilter) return false;
      }
      if (menuFilter !== "all") {
        const isInMenu = category.top === 1 || category.is_menu === 1;
        if ((menuFilter === "in_menu" && !isInMenu) || (menuFilter === "not_in_menu" && isInMenu)) {
          return false;
        }
      }
      if (
        searchQuery &&
        !(category.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [categories, statusFilter, menuFilter, searchQuery, parentMap]);

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const totalCategories = filteredCategories.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalCategories);
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const stats = useMemo(
    () => ({
      total: categories.length,
      active: categories.filter((c) => c.status === 1).length,
      inactive: categories.filter((c) => c.status === 0).length,
      inMenu: categories.filter((c) => c.top === 1 || c.is_menu === 1).length,
    }),
    [categories]
  );

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setViewDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, menuFilter, searchQuery]);

  if (loading && categories.length === 0) {
    return <CategoriesSkeleton />;
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
          <h1 className="text-4xl font-normal text-foreground">Categories</h1>
          <p className="text-muted-foreground text-lg font-light">
            Manage product categories
          </p>
        </div>
        <Button
          className="gap-2 gradient-primary text-primary-foreground"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Categories</p>
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
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">In Menu</p>
          <p className="mt-1 text-2xl font-bold text-info">
            {stats.inMenu}
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
                placeholder="Search categories..."
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
            <Select value={menuFilter} onValueChange={setMenuFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Menu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Menu</SelectItem>
                <SelectItem value="in_menu">In Menu</SelectItem>
                <SelectItem value="not_in_menu">Not In Menu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => dispatch(fetchCategories() as any)}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Categories Table */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {categories.length === 0
            ? "No categories available"
            : "No categories match the current filters"}
        </div>
      ) : (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              All Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Top Menu</TableHead>
                  <TableHead>In Menu</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCategories.map((category) => {
                  const parentName = getParentHierarchy(category.parent_id);
                  return (
                    <TableRow key={category.category_id}>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-1 text-sm font-mono font-semibold text-foreground">
                          {category.category_id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{category.name}</div>
                        {category.seo_url && (
                          <div className="text-xs text-muted-foreground truncate max-w-[150px]" title={category.seo_url}>
                            {category.seo_url}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground truncate block" title={category.path || ''}>
                          {category.path || '-'}
                        </span>
                      </TableCell>
                      <TableCell>{category.sort_order}</TableCell>
                      <TableCell>
                        {category.top === 1 ? (
                          <span className="status-badge status-info">Yes</span>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {category.is_menu === 1 ? (
                          <span className="status-badge status-info">Yes</span>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`status-badge ${
                          category.status === 1 ? "status-success" : "status-warning"
                        }`}>
                          {category.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleView(category)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
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
                  Page {currentPage} of {totalPages} ({totalCategories} total) - Showing {startIndex + 1} to {endIndex}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <CreateCategoryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      {selectedCategory && (
        <>
          <EditCategoryDialog
            open={editDialogOpen}
            onOpenChange={(open) => {
              setEditDialogOpen(open);
              if (!open) setSelectedCategory(null);
            }}
            category={selectedCategory}
          />
          <ViewCategoryDialog
            open={viewDialogOpen}
            onOpenChange={(open) => {
              setViewDialogOpen(open);
              if (!open) setSelectedCategory(null);
            }}
            category={selectedCategory}
            onEdit={handleEdit}
          />
        </>
      )}
    </div>
  );
}
