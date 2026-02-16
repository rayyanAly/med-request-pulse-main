import { useState, useEffect, useMemo } from "react";
import { Plus, Download, Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchAllOrders } from "@/redux/actions/orderActions";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 100;

export default function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: any) => state.orders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Filter orders by search term (name and phone)
  const searchFilteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter((order: any) => {
      const name = `${order.firstname || ''} ${order.lastname || ''}`.toLowerCase();
      const phone = (order.telephone || '').toLowerCase();
      return name.includes(term) || phone.includes(term);
    });
  }, [orders, searchTerm]);

  // Filter by date range
  const dateFilteredOrders = useMemo(() => {
    if (!dateRange?.from && !dateRange?.to) return searchFilteredOrders;
    return searchFilteredOrders.filter((order: any) => {
      if (!order.date_added) return false;
      // Parse date format DD/MM/YYYY HH:mm:ss
      const datePart = order.date_added.split(' ')[0];
      const [day, month, year] = datePart.split('/');
      const orderDate = new Date(`${year}-${month}-${day}`);
      
      if (dateRange?.from) {
        if (orderDate < dateRange.from) return false;
      }
      if (dateRange?.to) {
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999);
        if (orderDate > endDate) return false;
      }
      return true;
    });
  }, [searchFilteredOrders, dateRange]);

  // Filter by status
  const statusFilteredOrders = useMemo(() => {
    if (statusFilter === "all") return dateFilteredOrders;
    return dateFilteredOrders.filter((order: any) => {
      const status = order.order_status;
      if (statusFilter === "new") return status === "New Order";
      if (statusFilter === "process") return status === "Under Process";
      if (statusFilter === "ready") return status === "Ready for Dispatch";
      if (statusFilter === "dispatch") return status === "Dispatch";
      if (statusFilter === "delivered") return status === "Delivered";
      if (statusFilter === "canceled") return status === "Canceled";
      if (statusFilter === "hold") return status === "On Hold";
      return true;
    });
  }, [dateFilteredOrders, statusFilter]);

  // Paginate
  const totalPages = Math.ceil(statusFilteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return statusFilteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [statusFilteredOrders, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateRange, statusFilter]);

  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range";
    if (!dateRange.to) return format(dateRange.from, "dd/MM/yyyy");
    return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`;
  };

  // Apply date range and close popover
  const applyDateRange = () => {
    setCalendarOpen(false);
  };

  // Clear date range
  const clearDateRange = () => {
    setDateRange(undefined);
    setCalendarOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Status</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all prescription delivery orders
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link to="/orders/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="grid w-full grid-cols-8 lg:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">New Order</TabsTrigger>
            <TabsTrigger value="process">Under Process</TabsTrigger>
            <TabsTrigger value="ready">Ready for Dispatch</TabsTrigger>
            <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
            <TabsTrigger value="hold">On Hold</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:max-w-xs"
          />
          
          {/* Date Range Picker */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`sm:max-w-xs justify-start text-left font-normal ${!dateRange?.from && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                initialFocus
              />
              <div className="flex justify-end gap-2 p-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearDateRange}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={applyDateRange}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {dateRange?.from && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearDateRange}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      {loading && (
        <div className="text-center py-12 text-muted-foreground">
          Loading orders...
        </div>
      )}
      {error && (
        <div className="text-center py-12 text-red-500">
          Error loading orders: {error}
        </div>
      )}
      {!loading && !error && (
        <OrdersTable 
          statusFilter={statusFilter} 
          filteredOrders={paginatedOrders}
        />
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedOrders.length} of {statusFilteredOrders.length} order{statusFilteredOrders.length !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-3 text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
