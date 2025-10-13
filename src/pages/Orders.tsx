import { useState, useEffect } from "react";
import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/OrdersTable";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "@/redux/actions/orderActions";

export default function Orders() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: any) => state.orders);
  const [statusFilter, setStatusFilter] = useState("new");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("09/08/2025 - 10/08/2025");

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

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
          <TabsList className="grid w-full grid-cols-7 lg:w-auto">
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
            placeholder="Search customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:max-w-xs"
          />
          <Input
            placeholder="Date range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="sm:max-w-xs"
          />
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
      {!loading && !error && <OrdersTable statusFilter={statusFilter} />}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1 to 4 of 4 entries
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="default" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
