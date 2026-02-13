import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
}

export function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  prefix = "",
  suffix = "",
}: StatCardProps) {
  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-normal font-light text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-light text-foreground">
            {prefix}
            {typeof value === "number" ? value.toLocaleString() : value}
            {suffix}
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          {trend === "up" ? (
            <div className="flex items-center gap-1 text-success">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+{change}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-destructive">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">{change}%</span>
            </div>
          )}
          <span className="text-sm font-light text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  );
}
