import { useState } from "react";
import {
  Search,
  Plus,
  MessageCircle,
  Mail,
  Play,
  Pause,
  Copy,
  MoreHorizontal,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react";
import { campaigns } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const statusStyles = {
  active: "status-success",
  scheduled: "status-info",
  completed: "status-neutral",
  draft: "status-warning",
};

export default function Campaigns() {
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (typeFilter !== "all" && campaign.type !== typeFilter) return false;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-normal text-foreground">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your marketing campaigns
          </p>
        </div>
        <Button className="gap-2 gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Play className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <Calendar className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">26.8K</p>
              <p className="text-sm text-muted-foreground">Total Reached</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">4.2%</p>
              <p className="text-sm text-muted-foreground">Avg. Conversion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search campaigns..." className="input-search pl-10" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns.map((campaign) => {
          const deliveryRate = campaign.sent > 0
            ? Math.round((campaign.delivered / campaign.sent) * 100)
            : 0;
          const openRate = campaign.delivered > 0
            ? Math.round((campaign.opened / campaign.delivered) * 100)
            : 0;
          const conversionRate = campaign.opened > 0
            ? Math.round((campaign.converted / campaign.opened) * 100)
            : 0;

          return (
            <div key={campaign.id} className="stat-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    campaign.type === 'whatsapp' ? "bg-success/10" : "bg-info/10"
                  )}>
                    {campaign.type === 'whatsapp' ? (
                      <MessageCircle className="h-5 w-5 text-success" />
                    ) : (
                      <Mail className="h-5 w-5 text-info" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{campaign.type}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {campaign.status === 'active' && (
                      <DropdownMenuItem>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </DropdownMenuItem>
                    )}
                    {campaign.status === 'draft' && (
                      <DropdownMenuItem>
                        <Play className="mr-2 h-4 w-4" />
                        Launch
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className={cn("status-badge", statusStyles[campaign.status])}>
                  {campaign.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Audience</span>
                    <span className="font-medium">{campaign.audience.toLocaleString()}</span>
                  </div>
                </div>

                {campaign.sent > 0 && (
                  <>
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">Delivery Rate</span>
                        <span className="font-medium">{deliveryRate}%</span>
                      </div>
                      <Progress value={deliveryRate} className="h-1.5" />
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">Open Rate</span>
                        <span className="font-medium">{openRate}%</span>
                      </div>
                      <Progress value={openRate} className="h-1.5" />
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">Conversion Rate</span>
                        <span className="font-medium">{conversionRate}%</span>
                      </div>
                      <Progress value={conversionRate} className="h-1.5" />
                    </div>
                  </>
                )}
              </div>

              {campaign.converted > 0 && (
                <div className="mt-4 rounded-lg bg-success/10 p-3">
                  <p className="text-center text-sm font-medium text-success">
                    {campaign.converted} conversions
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
