import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessageTotals } from '@/redux/actions/whatsappActions';
import { RootState, AppDispatch } from '@/redux/store';
import {
  Settings,
  Activity,
  Server,
  Wifi,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import IntegrationCard from "@/components/integrations/IntegrationCard";
import { cn } from "@/lib/utils";

const recentActivity = [
  { action: "Cart synced", source: "CRM", time: "2 min ago", type: "sync" },
  { action: "WhatsApp message sent", source: "WhatsApp", time: "5 min ago", type: "message" },
  { action: "New customer imported", source: "CRM", time: "10 min ago", type: "customer" },
  { action: "Order status updated", source: "CRM", time: "15 min ago", type: "order" },
  { action: "Campaign delivered", source: "WhatsApp", time: "20 min ago", type: "campaign" },
  { action: "Analytics data synced", source: "GA4", time: "1 hour ago", type: "sync" },
];

export default function Integrations() {
  const [syncing, setSyncing] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { messageTotals, totalsLoading } = useSelector((state: RootState) => state.whatsapp);

  // Integration data
  const integrations = {
    crm: {
      name: "CRM / E-commerce Database",
      description: "Connected to your existing CRM for customers, carts, and orders",
      status: "connected",
      lastSync: "2 minutes ago",
      stats: {
        customers: 12847,
        carts: 342,
        orders: 8956,
      },
      health: 98,
    },
    whatsapp: {
      name: "WhatsApp Business Panel",
      description: "Integration with your existing WhatsApp Business API",
      status: "connected",
      lastSync: "Just now",
      stats: messageTotals ? {
        messagesSent: messageTotals.total_sent,
        delivered: messageTotals.total_delivered,
        read: messageTotals.total_read,
      } : {
        messagesSent: 0,
        delivered: 0,
        read: 0,
      },
      health: 95,
      dailyLimit: 500,
      used: messageTotals ? messageTotals.today_total_sent : 0,
      todaySent: messageTotals ? messageTotals.today_total_sent : 0,
      todayDelivered: messageTotals ? messageTotals.today_total_delivered : 0,
      todayRead: messageTotals ? messageTotals.today_total_read : 0,
    },
    email: {
      name: "Email Provider (SendGrid)",
      description: "SMTP integration for email campaigns",
      status: "connected",
      lastSync: "5 minutes ago",
      stats: {
        sent: 28450,
        opened: 18230,
        clicked: 5420,
      },
      health: 100,
    },
    analytics: {
      name: "Google Analytics (GA4)",
      description: "Web and mobile app analytics",
      status: "connected",
      lastSync: "1 hour ago",
      stats: {
        pageViews: 156780,
        sessions: 45230,
        users: 28450,
      },
      health: 100,
    },
  };

  useEffect(() => {
    if (!messageTotals) {
      dispatch(fetchMessageTotals());
    }
  }, [dispatch, messageTotals]);

  const handleSync = (integration: string) => {
    setSyncing(integration);
    if (integration === 'whatsapp') {
      dispatch(fetchMessageTotals());
    }
    setTimeout(() => setSyncing(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-normal text-foreground">Integrations</h1>
          <p className="text-muted-foreground">
            Manage your CRM, WhatsApp, Email, and Analytics connections
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Configure
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Wifi className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">4/4</p>
              <p className="text-sm text-muted-foreground">Connected</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">98%</p>
              <p className="text-sm text-muted-foreground">Avg. Health</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <Server className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">2.3K</p>
              <p className="text-sm text-muted-foreground">API Calls Today</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">2m</p>
              <p className="text-sm text-muted-foreground">Last Sync</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <IntegrationCard integration={integrations.crm} type="crm" syncing={syncing} onSync={handleSync} />
        <IntegrationCard integration={integrations.whatsapp} type="whatsapp" syncing={syncing} onSync={handleSync} />
        <IntegrationCard integration={integrations.email} type="email" syncing={syncing} onSync={handleSync} />
        <IntegrationCard integration={integrations.analytics} type="analytics" syncing={syncing} onSync={handleSync} />
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Recent Integration Activity</h3>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            View All <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  activity.type === "sync" && "bg-primary",
                  activity.type === "message" && "bg-success",
                  activity.type === "customer" && "bg-info",
                  activity.type === "order" && "bg-warning",
                  activity.type === "campaign" && "bg-chart-1"
                )} />
                <span className="text-foreground">{activity.action}</span>
                <Badge variant="outline" className="text-xs">{activity.source}</Badge>
              </div>
              <span className="text-sm text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
