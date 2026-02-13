import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchOrderById } from "@/redux/actions/orderActions";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { singleOrder, loading, error } = useSelector((state: any) => state.orders);
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Error loading order: {error}
      </div>
    );
  }

  if (!singleOrder) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Order not found
      </div>
    );
  }

  const order = singleOrder;

  // Define all possible order stages with dynamic timestamps
  const orderStages = [
    { status: "New Order", label: "Order Received", time: order.received_at ? new Date(order.received_at).toLocaleString() : '' },
    { status: "Under Process", label: "Processing", time: order.accepted_at ? new Date(order.accepted_at).toLocaleString() : '' },
    { status: "Ready for Delivery", label: "Ready for Delivery", time: order.prepared_at ? new Date(order.prepared_at).toLocaleString() : '' },
    { status: "Out for Delivery", label: "Out for Delivery", time: order.dispatched ? new Date(order.dispatched).toLocaleString() : '' },
    { status: "Delivered", label: "Delivered", time: order.delivered_at ? new Date(order.delivered_at).toLocaleString() : '' },
  ];

  // Map status names to match between order statuses
  const statusMapping: Record<string, string> = {
    "New Order": "New Order",
    "Under Process": "Under Process",
    "Processing": "Under Process",
    "Ready for Dispatch": "Ready for Delivery",
    "Ready for Delivery": "Ready for Delivery",
    "Dispatch": "Out for Delivery",
    "Out for Delivery": "Out for Delivery",
    "Delivered": "Delivered",
  };

  const normalizedStatus = statusMapping[order.order_status] || order.order_status;
  
  // Get current stage index
  const currentStageIndex = orderStages.findIndex(stage => stage.status === normalizedStatus);
  
  // Function to determine stage state
  const getStageState = (index: number) => {
    if (currentStageIndex === -1) return "pending";
    if (index < currentStageIndex) return "completed";
    if (index === currentStageIndex) return "current";
    return "pending";
  };

  // Function to get badge styling based on status
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "New Order":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Ready for Delivery":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "Out for Delivery":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "On Hold":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const handleDownload = (documentName: string) => {
    // In a real app, this would download the actual file
    toast.success(`Downloading ${documentName}...`);
  };

  return (
    <div className="space-y-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Order No: {`#${order.order_id_internal}`}
            </h1>
            <p className="text-sm text-muted-foreground">
              Received: {new Date(order.date_added).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={getBadgeStyle(order.order_status)} variant="secondary">
            {order.order_status}
          </Badge>
          <Button variant="destructive" size="sm" className="h-9">Cancel</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {/* Customer & Delivery Information - Combined */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-base">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 px-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                {/* Personal Information Column */}
                <div className="space-y-2.5">
                  <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Personal Information</h3>
                  <div className="space-y-1.5">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm font-medium">{`${order.firstname} ${order.lastname}`}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{order.telephone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Delivery Time</p>
                      <p className="text-sm font-medium">{order.delivery_time ? new Date(order.delivery_time).toLocaleString() : 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Payment Method</p>
                      <p className="text-sm font-medium">{order.payment_method}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Information Column */}
                <div className="space-y-2.5">
                  <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Delivery Information</h3>
                  <div className="space-y-1.5">
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="text-sm font-medium text-amber-600">{order.address || 'Delivery address not yet set!'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Agent Name</p>
                      <p className="text-sm font-medium">{order.agent_name || "Not assigned"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Comments</p>
                      <p className="text-sm font-medium">{order.comment}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products - will grow to align with timeline */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-base">Products</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 px-5 flex flex-col flex-1">
              <div className="flex-1 flex flex-col justify-between">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-8 text-xs py-1.5">Product Name</TableHead>
                      <TableHead className="text-right h-8 text-xs py-1.5">Qty</TableHead>
                      <TableHead className="text-right h-8 text-xs py-1.5">Price</TableHead>
                      <TableHead className="text-right h-8 text-xs py-1.5">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground text-sm h-12">
                          No products added yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      order.products.map((product: any) => (
                        <TableRow key={product.id} className="h-10">
                          <TableCell className="text-sm py-1.5">{product.name}</TableCell>
                          <TableCell className="text-right text-sm py-1.5">{product.quantity}</TableCell>
                          <TableCell className="text-right text-sm py-1.5">{product.price}</TableCell>
                          <TableCell className="text-right text-sm py-1.5">{product.total}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
                  <span className="font-semibold text-base">Total</span>
                  <span className="font-bold text-xl">{Number(order.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Documents & Timeline */}
        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 px-5">
              <div className="space-y-2.5">
                <div 
                  className="flex items-center gap-3 p-2.5 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => setPreviewDocument("Prescription.pdf")}
                >
                  <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">Prescription.pdf</p>
                    <p className="text-xs text-muted-foreground">2.4 MB</p>
                  </div>
                </div>
                
                {order.order_status === "Delivered" && (
                  <div 
                    className="flex items-center gap-3 p-2.5 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => setPreviewDocument("Consent Form.pdf")}
                  >
                    <div className="h-9 w-9 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">Consent Form.pdf</p>
                      <p className="text-xs text-muted-foreground">1.2 MB</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="flex-1">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-base">Order Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 px-5">
              <div className="space-y-1.5">
                {orderStages.map((stage, index) => {
                  const stageState = getStageState(index);
                  const isLast = index === orderStages.length - 1;
                  
                  return (
                    <div key={stage.status} className="relative">
                      <div className="flex gap-2.5">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                            stageState === "completed" && "bg-green-500 text-white",
                            stageState === "current" && "bg-primary text-primary-foreground",
                            stageState === "pending" && "bg-muted text-muted-foreground"
                          )}>
                            {index + 1}
                          </div>
                          {!isLast && (
                            <div className={cn(
                              "w-0.5 h-8 mt-0.5 transition-colors",
                              index < currentStageIndex ? "bg-green-500" : "bg-muted"
                            )} />
                          )}
                        </div>
                        <div className="flex-1 pb-1.5">
                          <p className={cn(
                            "text-sm font-medium leading-tight",
                            stageState === "pending" && "text-muted-foreground"
                          )}>
                            {stage.label}
                          </p>
                          {stage.time && (
                            <p className="text-xs text-muted-foreground mt-0.5">{stage.time}</p>
                          )}
                          {stageState === "pending" && !stage.time && (
                            <p className="text-xs text-muted-foreground mt-0.5">Pending</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{previewDocument}</DialogTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => previewDocument && handleDownload(previewDocument)}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-muted rounded-lg">
            {previewDocument && (
              <iframe
                src="/placeholder.svg"
                className="w-full h-full min-h-[600px]"
                title={previewDocument}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
