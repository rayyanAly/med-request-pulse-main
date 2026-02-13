import { Megaphone, MessageCircle, Mail } from "lucide-react";
import { campaigns } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const statusStyles = {
  active: "status-success",
  scheduled: "status-info",
  completed: "status-neutral",
  draft: "status-warning",
};

export function CampaignsList() {
  const recentCampaigns = campaigns.slice(0, 4);

  return (
    <div className="stat-card animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="section-header font-light text-2xl">Active Campaigns</h3>
          <p className="font-light text-lg text-muted-foreground">Current marketing activities</p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {recentCampaigns.map((campaign) => {
          const deliveryRate = campaign.sent > 0 
            ? Math.round((campaign.delivered / campaign.sent) * 100) 
            : 0;
          
          return (
            <div
              key={campaign.id}
              className="rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
            >
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
                    <p className="font-medium text-lg tracking-tight text-foreground">{campaign.name}</p>
                    <p className="text-sm font-light tracking-wide text-muted-foreground">
                      {campaign.audience.toLocaleString()} recipients
                    </p>
                  </div>
                </div>
                <span className={cn("status-badge", statusStyles[campaign.status])}>
                  {campaign.status}
                </span>
              </div>
              {campaign.sent > 0 && (
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-sm font-light tracking-wide text-muted-foreground">
                    <span>Delivery Rate</span>
                    <span>{deliveryRate}%</span>
                  </div>
                  <Progress value={deliveryRate} className="h-1.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
