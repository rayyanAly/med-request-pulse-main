import { useState } from "react";
import {
  MessageCircle,
  Mail,
  Send,
  Clock,
  CheckCircle2,
  CheckCheck,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface CustomerMessageDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock message history
const mockMessages = [
  {
    id: "1",
    type: "whatsapp",
    direction: "outgoing",
    content: "Hi! Your cart is waiting. Complete your purchase and get 10% off!",
    status: "read",
    timestamp: "2024-01-10 14:30",
  },
  {
    id: "2",
    type: "whatsapp",
    direction: "incoming",
    content: "Thanks! I'll check it out.",
    status: "delivered",
    timestamp: "2024-01-10 14:35",
  },
  {
    id: "3",
    type: "email",
    direction: "outgoing",
    content: "Subject: Your order has been shipped!\n\nDear Customer, your order #12345 is on its way...",
    status: "opened",
    timestamp: "2024-01-08 10:00",
  },
];

// Mock templates
const templates = [
  { id: "1", name: "Abandoned Cart Reminder", content: "Hi {{name}}! You left items in your cart. Complete your purchase now!" },
  { id: "2", name: "Order Confirmation", content: "Thank you {{name}}! Your order #{{order_id}} has been confirmed." },
  { id: "3", name: "Special Offer", content: "Hi {{name}}! Here's an exclusive 15% discount just for you: {{coupon_code}}" },
];

export function CustomerMessageDialog({
  customer,
  open,
  onOpenChange,
}: CustomerMessageDialogProps) {
  const [messageType, setMessageType] = useState<"whatsapp" | "email">("whatsapp");
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [sending, setSending] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template && customer) {
      setMessage(template.content.replace("{{name}}", customer.name));
    }
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setMessage("");
      setSelectedTemplate("");
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle2 className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "read":
      case "opened":
        return <CheckCheck className="h-3 w-3 text-success" />;
      default:
        return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Message {customer.name}</span>
            <Badge variant="outline">{customer.phone}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="compose" className="space-y-4">
          <TabsList>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="history">Message History</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            {/* Channel Selection */}
            <div className="flex gap-2">
              <Button
                variant={messageType === "whatsapp" ? "default" : "outline"}
                className={cn(
                  "gap-2 flex-1",
                  messageType === "whatsapp" && "bg-success hover:bg-success/90"
                )}
                onClick={() => setMessageType("whatsapp")}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                variant={messageType === "email" ? "default" : "outline"}
                className="gap-2 flex-1"
                onClick={() => setMessageType("email")}
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Use Template</label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder={`Type your ${messageType} message...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Variables: {"{{name}}"}, {"{{order_id}}"}, {"{{cart_value}}"}, {"{{coupon_code}}"}
              </p>
            </div>

            {/* Send Button */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={!message || sending}
                className={cn(
                  "gap-2",
                  messageType === "whatsapp"
                    ? "bg-success hover:bg-success/90"
                    : "gradient-primary"
                )}
              >
                {sending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send via {messageType === "whatsapp" ? "WhatsApp" : "Email"}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            {mockMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No messages sent to this customer yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "rounded-lg p-3 border",
                      msg.direction === "outgoing"
                        ? "bg-muted/50 ml-8"
                        : "bg-primary/5 mr-8"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {msg.type === "whatsapp" ? (
                          <MessageCircle className="h-4 w-4 text-success" />
                        ) : (
                          <Mail className="h-4 w-4 text-info" />
                        )}
                        <span className="text-xs text-muted-foreground capitalize">
                          {msg.direction}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(msg.status)}
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
