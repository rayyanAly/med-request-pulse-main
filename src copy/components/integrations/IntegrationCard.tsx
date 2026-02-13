import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  MessageCircle,
  Mail,
  BarChart3,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Integration {
  name: string;
  description: string;
  status: string;
  lastSync: string;
  stats: Record<string, number>;
  health: number;
  dailyLimit?: number;
  used?: number;
  todaySent?: number;
  todayDelivered?: number;
  todayRead?: number;
}

interface IntegrationCardProps {
  integration: Integration;
  type: 'crm' | 'whatsapp' | 'email' | 'analytics';
  syncing: string | null;
  onSync: (type: string) => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ integration, type, syncing, onSync }) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (type) {
      case 'crm':
        return <Database className="h-6 w-6 text-primary" />;
      case 'whatsapp':
        return <MessageCircle className="h-6 w-6 text-success" />;
      case 'email':
        return <Mail className="h-6 w-6 text-info" />;
      case 'analytics':
        return <BarChart3 className="h-6 w-6 text-warning" />;
      default:
        return <Database className="h-6 w-6 text-primary" />;
    }
  };

  const getStatLabels = () => {
    switch (type) {
      case 'crm':
        return [
          { key: 'customers', label: 'Customers', icon: null },
          { key: 'carts', label: 'Active Carts', icon: null },
          { key: 'orders', label: 'Orders', icon: null },
        ];
      case 'whatsapp':
        return [
          { key: 'messagesSent', label: 'Messages Sent', icon: null },
          { key: 'delivered', label: 'Delivered', icon: null },
          { key: 'read', label: 'Read', icon: null },
        ];
      case 'email':
        return [
          { key: 'sent', label: 'Emails Sent', icon: null },
          { key: 'opened', label: 'Opened', icon: null },
          { key: 'clicked', label: 'Clicked', icon: null },
        ];
      case 'analytics':
        return [
          { key: 'pageViews', label: 'Page Views', icon: null },
          { key: 'sessions', label: 'Sessions', icon: null },
          { key: 'users', label: 'Users', icon: null },
        ];
      default:
        return [];
    }
  };

  const statLabels = getStatLabels();

  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${type === 'crm' ? 'bg-primary/10' : type === 'whatsapp' ? 'bg-success/10' : type === 'email' ? 'bg-info/10' : 'bg-warning/10'}`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{integration.name}</h3>
            <p className="text-sm text-muted-foreground">{integration.description}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "gap-1",
            integration.status === "connected"
              ? "border-success/50 bg-success/10 text-success"
              : "border-destructive/50 bg-destructive/10 text-destructive"
          )}
        >
          {integration.status === "connected" ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {integration.status === "connected" ? "Connected" : "Disconnected"}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {statLabels.map((stat, index) => (
          <div key={index} className="rounded-lg bg-muted/50 p-3 text-center">
            {stat.icon && <stat.icon className="h-5 w-5 mx-auto text-muted-foreground mb-1" />}
            <p className="text-lg font-semibold">{integration.stats[stat.key]?.toLocaleString() || 0}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {type === 'whatsapp' && integration.dailyLimit && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Daily Target: {integration.dailyLimit} messages</div>
          <div className="flex justify-between text-xs">
            <span>Sent: {integration.todaySent}</span>
            <span>Delivered: {integration.todayDelivered}</span>
            <span>Read: {integration.todayRead}</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: `${(integration.todaySent! / integration.dailyLimit!) * 100}%` }} />
            <div className="absolute top-0 left-0 h-full bg-green-500" style={{ width: `${(integration.todayDelivered! / integration.dailyLimit!) * 100}%` }} />
            <div className="absolute top-0 left-0 h-full bg-purple-500" style={{ width: `${(integration.todayRead! / integration.dailyLimit!) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Health</span>
          <span className={integration.health >= 90 ? "text-success" : integration.health >= 70 ? "text-warning" : "text-destructive"}>
            {integration.health}%
          </span>
        </div>
        <Progress value={integration.health} className="h-2" />
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-muted-foreground">
          Last sync: {integration.lastSync}
        </span>
        <div className="flex gap-2">
          {type === 'whatsapp' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/whatsapp-detail')}
            >
              View Details
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => onSync(type)}
            disabled={syncing === type}
          >
            <RefreshCw className={cn("h-4 w-4", syncing === type && "animate-spin")} />
            {syncing === type ? "Syncing..." : "Sync Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationCard;