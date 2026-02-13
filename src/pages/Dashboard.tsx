import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, CheckCircle, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "@/api/orderApi";
import { RootState } from "@/redux/store";
import { Skeleton } from "@/components/ui/skeleton";

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
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      loading: loading,
    },
    {
      title: "Total Sale",
      value: stats?.total_sale ? `AED ${stats.total_sale.toLocaleString()}` : "AED 0",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      loading: loading,
    },
    {
      title: "Customers",
      value: stats?.total_customers?.toLocaleString() || "0",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      loading: loading,
    },
    {
      title: "Products",
      value: products.length.toLocaleString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
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
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-3xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
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
