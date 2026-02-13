import { useEffect, useState } from "react";
import { Package, ShoppingCart, CheckCircle, Clock } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboardStats } from "@/api/orderApi";

export default function Dashboard() {
  const { loading } = useSelector((state: RootState) => state.orders);
  const { products } = useSelector((state: RootState) => state.products);

  const [stats, setStats] = useState<{
    total_orders: number;
    total_sale: number;
    total_customers: number;
  } | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await fetchDashboardStats();
        if (result.success && result.data) {
          setStats(result.data);
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.total_orders?.toLocaleString() || "0",
      icon: ShoppingCart,
      loading: loading,
    },
    {
      title: "Total Sale",
      value: stats?.total_sale
        ? `AED ${stats.total_sale.toLocaleString()}`
        : "AED 0",
      icon: Package,
      loading: loading,
    },
    {
      title: "Customers",
      value: stats?.total_customers?.toLocaleString() || "0",
      icon: CheckCircle,
      loading: loading,
    },
    {
      title: "Products",
      value: products.length.toLocaleString(),
      icon: Clock,
      loading: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your pharmacy operations
        </p>
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
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your recent orders and activities will appear here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
