import { useState } from "react";
import {
  MessageCircle,
  Mail,
  BarChart3,
  Clock,
  Shield,
  Globe,
  Save,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-normal text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Configure your marketing panel
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2 gradient-primary text-primary-foreground">
          {saved ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="whatsapp" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
        </TabsList>

        {/* WhatsApp Settings */}
        <TabsContent value="whatsapp" className="space-y-6">
          <div className="stat-card">
            <h3 className="section-header mb-4">WhatsApp Business API</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="wa-phone">Phone Number ID</Label>
                  <Input id="wa-phone" placeholder="Enter phone number ID" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wa-token">Access Token</Label>
                  <Input id="wa-token" type="password" placeholder="Enter access token" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wa-webhook">Webhook URL</Label>
                <Input id="wa-webhook" placeholder="https://your-domain.com/webhook" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <h3 className="section-header mb-4">Rate Limiting</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="wa-rate">Messages per second</Label>
                  <Input id="wa-rate" type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wa-daily">Daily limit</Label>
                  <Input id="wa-daily" type="number" defaultValue="10000" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable rate limiting</Label>
                  <p className="text-sm text-muted-foreground">Prevent API throttling</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <div className="stat-card">
            <h3 className="section-header mb-4">Email Provider</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select defaultValue="sendgrid">
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="smtp">Custom SMTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-api">API Key</Label>
                <Input id="email-api" type="password" placeholder="Enter API key" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email-from">From Email</Label>
                  <Input id="email-from" placeholder="noreply@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-name">From Name</Label>
                  <Input id="email-name" placeholder="Company Name" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Settings */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="stat-card">
            <h3 className="section-header mb-4">Google Analytics (GA4)</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ga-property">Property ID</Label>
                  <Input id="ga-property" placeholder="G-XXXXXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ga-stream">Data Stream ID</Label>
                  <Input id="ga-stream" placeholder="Enter stream ID" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ga-credentials">Service Account JSON</Label>
                <Input id="ga-credentials" type="file" accept=".json" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <h3 className="section-header mb-4">Data Sync</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-sync analytics data</Label>
                  <p className="text-sm text-muted-foreground">Sync every hour</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Real-time data</Label>
                  <p className="text-sm text-muted-foreground">Enable real-time dashboard</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="stat-card">
            <h3 className="section-header mb-4">Timezone & Language</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select defaultValue="asia-dubai">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asia-dubai">Asia/Dubai (GMT+4)</SelectItem>
                    <SelectItem value="europe-london">Europe/London (GMT+0)</SelectItem>
                    <SelectItem value="america-ny">America/New York (GMT-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Default Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية (Arabic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <h3 className="section-header mb-4">Consent & Privacy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require consent for marketing</Label>
                  <p className="text-sm text-muted-foreground">Only message opted-in customers</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Unsubscribe link in emails</Label>
                  <p className="text-sm text-muted-foreground">Add unsubscribe footer automatically</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Data retention</Label>
                  <p className="text-sm text-muted-foreground">Auto-delete old logs</p>
                </div>
                <Select defaultValue="90">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <h3 className="section-header mb-4">Abandoned Cart Rules</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Abandonment threshold</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-value">Minimum cart value ($)</Label>
                  <Input id="min-value" type="number" defaultValue="50" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Exclude logged-in users</Label>
                  <p className="text-sm text-muted-foreground">Don't track member carts</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
