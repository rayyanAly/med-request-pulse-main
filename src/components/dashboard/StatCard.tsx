import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatCardProps } from "@/api/types";

export function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  prefix = "",
  suffix = "",
  loading = false,
}: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        <div className={`p-2 rounded-lg`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        ) : (
          <div className="text-3xl font-bold">
            {prefix}
            {typeof value === "number" ? value.toLocaleString() : value}
            {suffix}
          </div>
        )}
        {change !== undefined && !loading && (
          <div className="mt-2 flex items-center gap-1">
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : trend === "down" ? (
              <TrendingDown className="h-4 w-4 text-red-600" />
            ) : null}
            <span
              className={cn(
                "text-sm font-medium",
                trend === "up"
                  ? "text-green-600"
                  : trend === "down"
                  ? "text-red-600"
                  : "text-muted-foreground"
              )}
            >
              {trend === "up" ? "+" : trend === "down" ? "-" : ""}
              {change}%
            </span>
            <span className="text-sm text-muted-foreground">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
