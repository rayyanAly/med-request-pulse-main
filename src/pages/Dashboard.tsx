import { useEffect, useState, useCallback, useMemo } from "react";
import { ShoppingCart, RefreshCw, TrendingUp, Users, Clock, Calendar as CalendarIcon, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllOrders } from "@/redux/actions/orderActions";
import { Order } from "@/api/types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

// Format number with K (thousands) and M (millions) abbreviations
function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

// Normalize UAE phone numbers to handle different formats
// +971, 971, 0 → all should map to the same last 9 digits
function normalizePhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "";
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");
  
  // Handle UAE phone number formats
  // +971XXXXXXXXX (with +)
  // 971XXXXXXXXX (with country code)
  // 05XXXXXXXXX (with leading 0)
  // 5XXXXXXXXX (without leading 0)
  
  if (digitsOnly.startsWith("971")) {
    // Remove country code 971
    return digitsOnly.slice(3);
  } else if (digitsOnly.startsWith("0")) {
    // Remove leading 0
    return digitsOnly.slice(1);
  }
  
  // Return as-is if none of the above
  return digitsOnly;
}

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading: ordersLoading } = useSelector((state: any) => state.orders);

  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Get default date range (last 30 days like panel)
  const getDefaultDateRange = useCallback(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return {
      from: thirtyDaysAgo,
      to: now,
    };
  }, []);

  // Initialize with default 30-day range
  useEffect(() => {
    const defaultRange = getDefaultDateRange();
    setDateRange(defaultRange);
    
    // Fetch orders with initial date range
    dispatch(fetchAllOrders({
      startdate: format(defaultRange.from, 'yyyy-MM-dd'),
      enddate: format(defaultRange.to, 'yyyy-MM-dd'),
    }));
  }, [dispatch, getDefaultDateRange]);

  // Calculate unique customers from orders using normalized phone numbers
  const uniqueCustomers = useMemo(() => {
    const customerSet = new Set<string>();
    orders.forEach((order: Order) => {
      const normalized = normalizePhoneNumber(order.telephone);
      if (normalized) {
        customerSet.add(normalized);
      }
    });
    return customerSet.size;
  }, [orders]);

  // Calculate completed orders from Redux orders
  const completedOrders = useMemo(() => {
    return orders.filter((order: Order) => {
      const status = order.order_status?.toLowerCase() || "";
      return status === "delivered" || status === "complete";
    });
  }, [orders]);

  // Calculate pending orders (not completed, not canceled, not new order, not drafted, not returned, not deleted)
  const pendingOrders = useMemo(() => {
    return orders.filter((order: Order) => {
      const status = order.order_status?.toLowerCase() || "";
      const completedStatuses = ["delivered", "complete", "canceled", "cancelled", "new order", "drafted order", "returned", "deleted"];
      return !completedStatuses.includes(status);
    });
  }, [orders]);

  // Calculate total revenue from completed orders
  const completedRevenue = useMemo(() => {
    return completedOrders.reduce((sum: number, order: Order) => {
      const total = typeof order.total === 'number' ? order.total : 0;
      return sum + total;
    }, 0);
  }, [completedOrders]);

  const loadAll = useCallback(async (dateRangeParams?: { startdate?: string; enddate?: string }) => {
    setRefreshing(true);
    try {
      await dispatch(fetchAllOrders(dateRangeParams));
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Removed polling - now only load on date range change or manual refresh

  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range";
    if (!dateRange.to) return format(dateRange.from, "dd/MM/yyyy");
    return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`;
  };

  // Apply date range and fetch orders (server-side filtering)
  const applyDateRange = () => {
    if (dateRange?.from && dateRange?.to) {
      const dateRangeParams = {
        startdate: format(dateRange.from, 'yyyy-MM-dd'),
        enddate: format(dateRange.to, 'yyyy-MM-dd'),
      };
      loadAll(dateRangeParams);
    }
    setCalendarOpen(false);
  };

  // Clear date range and fetch default 30 days
  const clearDateRange = () => {
    const defaultRange = getDefaultDateRange();
    setDateRange(defaultRange);
    loadAll({
      startdate: format(defaultRange.from, 'yyyy-MM-dd'),
      enddate: format(defaultRange.to, 'yyyy-MM-dd'),
    });
    setCalendarOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "complete":
      case "delivered":
        return "text-green-600 bg-green-50";
      case "pending":
      case "processing":
      case "new order":
        return "text-yellow-600 bg-yellow-50";
      case "cancel":
      case "cancelled":
      case "canceled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Get recent 15 completed orders
  const recentCompletedOrders = useMemo(() => {
    return completedOrders.slice(0, 15);
  }, [completedOrders]);

  const statCards = [
    {
      title: "Completed Orders",
      value: completedOrders.length.toLocaleString(),
      icon: ShoppingCart,
      loading: ordersLoading,
    },
    {
      title: "Completed Revenue",
      value: `${formatCompactNumber(completedRevenue)} AED`,
      icon: TrendingUp,
      loading: ordersLoading,
    },
    {
      title: "Pending Orders",
      value: pendingOrders.length.toLocaleString(),
      icon: Clock,
      loading: ordersLoading,
    },
    {
      title: "Unique Customers",
      value: uniqueCustomers.toLocaleString(),
      icon: Users,
      loading: ordersLoading,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your pharmacy operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range Picker */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`justify-start text-left font-normal ${!dateRange?.from && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
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
          
          <button
            onClick={() => loadAll(dateRange?.from && dateRange?.to ? {
              startdate: format(dateRange.from, 'yyyy-MM-dd'),
              enddate: format(dateRange.to, 'yyyy-MM-dd'),
            } : undefined)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            loading={stat.loading}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Completed Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : recentCompletedOrders.length === 0 ? (
            <p className="text-muted-foreground">No completed orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentCompletedOrders.map((order) => (
                <div
                  key={order.order_id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <p className="font-medium">{order.firstname} {order.lastname}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.telephone} • {order.order_id_internal || order.order_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      AED {Number(order.total).toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.order_status || '')}`}>
                      {order.order_status || 'Completed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
