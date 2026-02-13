import {
  Users,
  Clock,
  MousePointerClick,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { analyticsData, deviceBreakdown, topPages } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const hourlyData = [
  { hour: "00", visitors: 45 },
  { hour: "02", visitors: 23 },
  { hour: "04", visitors: 12 },
  { hour: "06", visitors: 34 },
  { hour: "08", visitors: 156 },
  { hour: "10", visitors: 289 },
  { hour: "12", visitors: 345 },
  { hour: "14", visitors: 312 },
  { hour: "16", visitors: 298 },
  { hour: "18", visitors: 267 },
  { hour: "20", visitors: 189 },
  { hour: "22", visitors: 98 },
];

const deviceIcons = {
  Mobile: Smartphone,
  Desktop: Monitor,
  Tablet: Tablet,
};

export default function Analytics() {
  const StatChange = ({ value, isPositive }: { value: number; isPositive: boolean }) => (
    <div className={cn("flex items-center gap-1 text-sm", isPositive ? "text-success" : "text-destructive")}>
      {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
      <span>{Math.abs(value)}%</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-normal text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Website and mobile app performance</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="today">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Users className="h-5 w-5 text-primary" />
            <StatChange value={analyticsData.visitors.change} isPositive={analyticsData.visitors.change > 0} />
          </div>
          <p className="mt-3 text-2xl font-bold">{analyticsData.visitors.today.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Visitors</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <MousePointerClick className="h-5 w-5 text-primary" />
            <StatChange value={analyticsData.sessions.change} isPositive={analyticsData.sessions.change > 0} />
          </div>
          <p className="mt-3 text-2xl font-bold">{analyticsData.sessions.today.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Sessions</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <TrendingUp className="h-5 w-5 text-primary" />
            <StatChange value={analyticsData.bounceRate.change} isPositive={analyticsData.bounceRate.change < 0} />
          </div>
          <p className="mt-3 text-2xl font-bold">{analyticsData.bounceRate.today}%</p>
          <p className="text-sm text-muted-foreground">Bounce Rate</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Clock className="h-5 w-5 text-primary" />
            <StatChange value={analyticsData.avgDuration.change} isPositive={analyticsData.avgDuration.change > 0} />
          </div>
          <p className="mt-3 text-2xl font-bold">{analyticsData.avgDuration.today}</p>
          <p className="text-sm text-muted-foreground">Avg. Duration</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <MousePointerClick className="h-5 w-5 text-primary" />
            <StatChange value={analyticsData.pageViews.change} isPositive={analyticsData.pageViews.change > 0} />
          </div>
          <p className="mt-3 text-2xl font-bold">{analyticsData.pageViews.today.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Page Views</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <TrendingUp className="h-5 w-5 text-primary" />
            <StatChange value={analyticsData.conversions.change} isPositive={analyticsData.conversions.change > 0} />
          </div>
          <p className="mt-3 text-2xl font-bold">{analyticsData.conversions.today}</p>
          <p className="text-sm text-muted-foreground">Conversions</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Traffic Chart */}
        <div className="stat-card lg:col-span-2">
          <div className="mb-6">
            <h3 className="section-header">Visitors Today</h3>
            <p className="text-sm text-muted-foreground">Hourly breakdown</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="visitors" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="stat-card">
          <div className="mb-6">
            <h3 className="section-header">Device Breakdown</h3>
            <p className="text-sm text-muted-foreground">Sessions by device type</p>
          </div>
          <div className="space-y-6">
            {deviceBreakdown.map((device) => {
              const Icon = deviceIcons[device.device as keyof typeof deviceIcons];
              return (
                <div key={device.device}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{device.device}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{device.percentage}%</span>
                  </div>
                  <Progress value={device.percentage} className="h-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {device.sessions.toLocaleString()} sessions
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="stat-card">
        <div className="mb-6">
          <h3 className="section-header">Top Pages</h3>
          <p className="text-sm text-muted-foreground">Most visited pages today</p>
        </div>
        <div className="space-y-4">
          {topPages.map((page, index) => (
            <div key={page.page} className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
              <div className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-foreground">{page.page}</p>
                  <p className="text-sm text-muted-foreground">Avg. time: {page.avgTime}</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-foreground">{page.views.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
