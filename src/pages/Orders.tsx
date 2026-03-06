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
    // Get default date range (last 30 days like panel)
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const defaultDateRange = {
      startdate: format(thirtyDaysAgo, 'yyyy-MM-dd'),
      enddate: format(now, 'yyyy-MM-dd'),
    };
    
    // Initial fetch with default date range - same as panel
    dispatch(fetchAllOrders(defaultDateRange));
  }, [dispatch]);

  // Filter orders by search term (name and phone) - client-side
  const searchFilteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter((order: any) => {
      const name = `${order.firstname || ''} ${order.lastname || ''}`.toLowerCase();
      const phone = (order.telephone || '').toLowerCase();
      return name.includes(term) || phone.includes(term);
    });
  }, [orders, searchTerm]);

  // Filter by status (client-side)
  const statusFilteredOrders = useMemo(() => {
    if (statusFilter === "all") return searchFilteredOrders;
    return searchFilteredOrders.filter((order: any) => {
      const status = order.order_status;
      if (statusFilter === "new") return status === "New Order";
      if (statusFilter === "process") return status === "Under Process";
      if (statusFilter === "ready") return status === "Ready for Dispatch";
      if (statusFilter === "dispatch") return status === "Dispatch";
      if (statusFilter === "delivered") return status === "Delivered";
      if (statusFilter === "complete") return status === "Complete";
      if (statusFilter === "canceled") return status === "Canceled";
      if (statusFilter === "hold") return status === "On Hold";
      return true;
    });
  }, [searchFilteredOrders, statusFilter]);

  // Paginate
  const totalPages = Math.ceil(statusFilteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return statusFilteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [statusFilteredOrders, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range";
    if (!dateRange.to) return format(dateRange.from, "dd/MM/yyyy");
    return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`;
  };

  // Apply date range and fetch from API (server-side filtering - same as panel)
  const applyDateRange = () => {
    if (dateRange?.from && dateRange?.to) {
      const dateRangeParams = {
        startdate: format(dateRange.from, 'yyyy-MM-dd'),
        enddate: format(dateRange.to, 'yyyy-MM-dd'),
      };
      // Fetch orders from API with date range - server-side filtering
      dispatch(fetchAllOrders(dateRangeParams));
    } else {
      // No date range - fetch all
      dispatch(fetchAllOrders());
    }
    setCalendarOpen(false);
  };

  // Clear date range and fetch all orders
  const clearDateRange = () => {
    setDateRange(undefined);
    // Fetch all orders without date filter
    dispatch(fetchAllOrders());
    setCalendarOpen(false);
  };

  // Export orders to Excel with proper column widths
  const exportToCSV = () => {
    // Export only the currently filtered orders (respects date range from server)
    const ordersToExport = statusFilteredOrders;
    
    if (ordersToExport.length === 0) {
      alert("No orders to export");
      return;
    }

    // Column widths in characters
    const colWidths = [15, 25, 18, 12, 20, 18, 18, 20, 20, 20, 20, 12];
    
    // Define columns
    const columns = [
      { key: "order_id", header: "Order ID", width: colWidths[0] },
      { key: "customer_name", header: "Customer Name", width: colWidths[1] },
      { key: "phone", header: "Phone", width: colWidths[2] },
      { key: "total", header: "Total (AED)", width: colWidths[3] },
      { key: "status", header: "Status", width: colWidths[4] },
      { key: "payment_method", header: "Payment Method", width: colWidths[5] },
      { key: "payment_status", header: "Payment Status", width: colWidths[6] },
      { key: "received_at", header: "Received at", width: colWidths[7] },
      { key: "prepared_at", header: "Prepared at", width: colWidths[8] },
      { key: "dispatched", header: "Dispatched at", width: colWidths[9] },
      { key: "delivered_at", header: "Delivered at", width: colWidths[10] },
      { key: "prescription", header: "Prescription", width: colWidths[11] },
    ];

    // Build HTML table for Excel with column widths
    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<style>
table { border-collapse: collapse; }
td { border: 1px solid #ddd; padding: 5px; mso-number-format:"\@"; }
th { border: 1px solid #ddd; background: #f3f4f6; padding: 5px; font-weight: bold; }
</style>
</head><body>
<table>`;

    // Header row
    html += "<tr>";
    columns.forEach(col => {
      html += `<th style="width:${col.width * 10}px">${col.header}</th>`;
    });
    html += "</tr>";

    // Data rows
    ordersToExport.forEach((order: any) => {
      html += "<tr>";
      html += `<td>${order.order_id_internal || order.order_id || ""}</td>`;
      html += `<td>${(order.firstname || "") + " " + (order.lastname || "")}</td>`;
      html += `<td style="mso-number-format:\'\\@\';">${order.telephone || ""}</td>`;
      html += `<td>${order.total || "0"}</td>`;
      html += `<td>${order.order_status || ""}</td>`;
      html += `<td>${order.payment_method || ""}</td>`;
      html += `<td>${order.payment_status || ""}</td>`;
      html += `<td>${order.received_at || order.date_added || ""}</td>`;
      html += `<td>${order.prepared_at || ""}</td>`;
      html += `<td>${order.dispatched || ""}</td>`;
      html += `<td>${order.delivered_at || order.accepted_at || ""}</td>`;
      html += `<td>${order.prescription === 1 ? "Yes" : "No"}</td>`;
      html += "</tr>";
    });

    html += "</table></body></html>";

    // Create and download file
    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_export_${format(new Date(), "yyyy-MM-dd_HHmmss")}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          <Button variant="outline" className="gap-2" onClick={exportToCSV}>
            <Download className="h-4 w-4" />
            Export Excel
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
          <TabsList className="grid w-full grid-cols-9 lg:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">New Order</TabsTrigger>
            <TabsTrigger value="process">Under Process</TabsTrigger>
            <TabsTrigger value="ready">Ready for Dispatch</TabsTrigger>
            <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
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
