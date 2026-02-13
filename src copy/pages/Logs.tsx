import { useState } from "react";
import {
  Search,
  Download,
  Filter,
  Megaphone,
  Zap,
  Image,
  FileText,
  AlertCircle,
  User,
} from "lucide-react";
import { activityLogs } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const typeConfig = {
  campaign: { icon: Megaphone, class: "bg-primary/10 text-primary" },
  automation: { icon: Zap, class: "bg-success/10 text-success" },
  content: { icon: Image, class: "bg-info/10 text-info" },
  template: { icon: FileText, class: "bg-warning/10 text-warning" },
  error: { icon: AlertCircle, class: "bg-destructive/10 text-destructive" },
  customer: { icon: User, class: "bg-muted text-muted-foreground" },
};

export default function Logs() {
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredLogs = activityLogs.filter((log) => {
    if (typeFilter !== "all" && log.type !== typeFilter) return false;
    return true;
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-normal text-foreground">Activity Logs</h1>
          <p className="text-muted-foreground">
            System activity and audit trail
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Today's Events</p>
          <p className="mt-1 text-2xl font-bold">156</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Campaigns</p>
          <p className="mt-1 text-2xl font-bold">24</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Automations</p>
          <p className="mt-1 text-2xl font-bold text-success">89</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Errors</p>
          <p className="mt-1 text-2xl font-bold text-destructive">3</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search logs..." className="input-search pl-10" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="campaign">Campaigns</SelectItem>
              <SelectItem value="automation">Automations</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="template">Templates</SelectItem>
              <SelectItem value="error">Errors</SelectItem>
              <SelectItem value="customer">Customers</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Logs List */}
      <div className="glass-card rounded-xl divide-y divide-border">
        {filteredLogs.map((log) => {
          const TypeIcon = typeConfig[log.type as keyof typeof typeConfig]?.icon || Zap;
          const typeClass = typeConfig[log.type as keyof typeof typeConfig]?.class || "bg-muted text-muted-foreground";

          return (
            <div key={log.id} className="flex items-start gap-4 p-4 transition-colors hover:bg-muted/30">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", typeClass)}>
                <TypeIcon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground">{log.action}</h4>
                  <Badge variant="outline" className="text-xs capitalize">
                    {log.type}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{log.details}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {log.user}
                  </span>
                  <span>{formatTime(log.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
