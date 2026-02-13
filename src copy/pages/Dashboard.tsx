import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  DollarSign,
  ShoppingBag,
  Users,
  ShoppingCart,
  TrendingUp,
  Target,
} from "lucide-react";
import { dashboardStats } from "@/lib/mock-data";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { RecentCarts } from "@/components/dashboard/RecentCarts";
import { CampaignsList } from "@/components/dashboard/CampaignsList";
import { fetchAbandonedCarts } from "@/redux/actions/abandonedCartsActions";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { carts } = useSelector((state: RootState) => state.abandonedCarts);

  // Calculate real abandoned carts count (unique carts)
  const uniqueCarts = new Set();
  carts.forEach((cart) => {
    cart.items.forEach((item) => {
      uniqueCarts.add(item.cart_id || item.id);
    });
  });
  const realAbandonedCartsCount = uniqueCarts.size;

  useEffect(() => {
    dispatch(fetchAbandonedCarts());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-normal text-foreground">Dashboard</h1>
        <p className="text-muted-foreground font-light text-lg">
          Welcome back! Here's your marketing overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Revenue"
          value={dashboardStats.revenue.value}
          change={dashboardStats.revenue.change}
          trend={dashboardStats.revenue.trend}
          icon={DollarSign}
          prefix="$"
        />
        <StatCard
          title="Orders"
          value={dashboardStats.orders.value}
          change={dashboardStats.orders.change}
          trend={dashboardStats.orders.trend}
          icon={ShoppingBag}
        />
        <StatCard
          title="Avg. Order Value"
          value={dashboardStats.aov.value}
          change={dashboardStats.aov.change}
          trend={dashboardStats.aov.trend}
          icon={Target}
          prefix="$"
        />
        <StatCard
          title="Customers"
          value={dashboardStats.customers.value}
          change={dashboardStats.customers.change}
          trend={dashboardStats.customers.trend}
          icon={Users}
        />
        <StatCard
          title="Abandoned Carts"
          value={realAbandonedCartsCount}
          change={dashboardStats.abandonedCarts.change}
          trend={dashboardStats.abandonedCarts.trend}
          icon={ShoppingCart}
        />
        <StatCard
          title="Conversion Rate"
          value={dashboardStats.conversionRate.value}
          change={dashboardStats.conversionRate.change}
          trend={dashboardStats.conversionRate.trend}
          icon={TrendingUp}
          suffix="%"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <TrafficChart />
      </div>

      {/* Activity Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentCarts />
        <CampaignsList />
      </div>
    </div>
  );
}
