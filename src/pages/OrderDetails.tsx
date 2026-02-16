import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download, Image as ImageIcon } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchOrderById, cancelOrderById } from "@/redux/actions/orderActions";

interface Attachment {
  attachment_url: string;
  attachment_type: string;
}

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { singleOrder, loading, error, cancelOrderLoading, cancelOrderSuccess } = useSelector((state: any) => state.orders);
  const [previewDocument, setPreviewDocument] = useState<{ url: string; name: string; type: string } | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  // Refresh order after successful cancellation
  useEffect(() => {
    if (cancelOrderSuccess && orderId) {
      toast.success("Order cancelled successfully");
      setShowCancelDialog(false);
      dispatch(fetchOrderById(orderId));
    }
  }, [cancelOrderSuccess, dispatch, orderId]);

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

  // Format date to dd-mm-yyyy hh:mm:ss AM/PM
  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  // Define all possible order stages with dynamic timestamps
  const orderStages = [
    { status: "New Order", label: "Order Received", time: order.activities?.received_at ? formatDateTime(order.activities.received_at) : '' },
    { status: "Under Process", label: "Processing", time: order.activities?.accepted_at ? formatDateTime(order.activities.accepted_at) : '' },
    { status: "Ready for Delivery", label: "Ready for Delivery", time: order.activities?.prepared_at ? formatDateTime(order.activities.prepared_at) : '' },
    { status: "Out for Delivery", label: "Out for Delivery", time: order.activities?.dispatched ? formatDateTime(order.activities.dispatched) : '' },
    { status: "Delivered", label: "Delivered", time: order.activities?.delivered_at ? formatDateTime(order.activities.delivered_at) : '' },
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

  const handleDownload = (attachment: Attachment) => {
    // Open the attachment URL in a new tab for download
    window.open(attachment.attachment_url, '_blank');
    toast.success(`Downloading ${attachment.attachment_type}...`);
  };

  // Get attachments from order
  const attachments: Attachment[] = order.attachments || [];
  
  // Separate prescriptions and other attachments
  const prescriptions = attachments.filter(a => a.attachment_type === 'prescription');
  const otherAttachments = attachments.filter(a => a.attachment_type !== 'prescription');

  // Get total value from total array
  const getTotalValue = (code: string) => {
    const totalItem = order.total?.find((t: any) => t.code === code);
    return totalItem?.value || 0;
  };

  // Check if order can be cancelled (order_status_id < 3)
  const canCancelOrder = () => {
    const statusId = parseInt(order.order_status_id || '0', 10);
    return statusId < 3 && order.cancel_key && order.order_status !== 'Cancelled';
  };

  // Clean comment by converting <br /> tags to newlines (backend adds ERX with br tag)
  const cleanComment = (comment: string | undefined) => {
    if (!comment) return '-';
    // Replace <br /> tags with newline character
    return comment.replace(/<br\s*\/?>/gi, '\n').trim();
  };

  // Handle cancel order
  const handleCancelOrder = () => {
    if (!order.cancel_key || !orderId) {
      toast.error("Cannot cancel order: missing cancel key");
      return;
    }
    
    dispatch(cancelOrderById(orderId, order.cancel_key));
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
              Received: {formatDateTime(order.date_added)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={getBadgeStyle(order.order_status)} variant="secondary">
            {order.order_status}
          </Badge>
          <Button 
            variant="destructive" 
            size="sm" 
            className="h-9"
            disabled={!canCancelOrder() || cancelOrderLoading}
            onClick={() => setShowCancelDialog(true)}
          >
            {cancelOrderLoading ? 'Cancelling...' : 'Cancel'}
          </Button>
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
                      <p className="text-xs text-muted-foreground">Delivery Date</p>
                      <p className="text-sm font-medium">{order.delivery_date ? new Date(order.delivery_date).toLocaleDateString('en-GB') : 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Delivery Time</p>
                      <p className="text-sm font-medium">{order.delivery_time || 'Not set'}</p>
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
                       <p className="text-xs text-muted-foreground">Agent Notes</p>
                       <p className="text-sm font-medium">{order.a_notes || "-"}</p>
                     </div>
                     <div>
                       <p className="text-xs text-muted-foreground">ERX Number</p>
                       <p className="text-sm font-medium">{order.erx || "-"}</p>
                     </div>
                      <div>
                         <p className="text-xs text-muted-foreground">Comments</p>
                         <p className="text-sm font-medium whitespace-pre-line">{cleanComment(order.comment)}</p>
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

                <div className="space-y-1 pt-2 border-t border-border mt-2">
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Subtotal</span>
                     <span>AED {getTotalValue('sub_total').toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Shipping</span>
                     <span>AED {getTotalValue('shipping').toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between font-bold text-base pt-1">
                     <span>Total</span>
                     <span>AED {getTotalValue('total').toFixed(2)}</span>
                   </div>
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
              {attachments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No documents attached</p>
              ) : (
                <div className="space-y-2.5">
                  {/* Prescriptions */}
                  {prescriptions.map((attachment, index) => (
                    <div 
                      key={`prescription-${index}`}
                      className="flex items-center gap-3 p-2.5 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => setPreviewDocument({ 
                        url: attachment.attachment_url, 
                        name: `Prescription ${index + 1}`,
                        type: attachment.attachment_type
                      })}
                    >
                      <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        {attachment.attachment_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                          <img 
                            src={attachment.attachment_url} 
                            alt="Prescription" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">Prescription {index + 1}</p>
                        <p className="text-xs text-muted-foreground capitalize">{attachment.attachment_type}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(attachment);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Other Attachments */}
                  {otherAttachments.map((attachment, index) => (
                    <div 
                      key={`attachment-${index}`}
                      className="flex items-center gap-3 p-2.5 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => setPreviewDocument({ 
                        url: attachment.attachment_url, 
                        name: attachment.attachment_type.charAt(0).toUpperCase() + attachment.attachment_type.slice(1),
                        type: attachment.attachment_type
                      })}
                    >
                      <div className="h-9 w-9 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        {attachment.attachment_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                          <img 
                            src={attachment.attachment_url} 
                            alt="Attachment" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate capitalize">{attachment.attachment_type}</p>
                        <p className="text-xs text-muted-foreground">Attachment</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(attachment);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <DialogTitle>{previewDocument?.name}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => previewDocument && window.open(previewDocument.url, '_blank')}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-white bg-red-500 hover:bg-red-600 hover:text-white"
                onClick={() => setPreviewDocument(null)}
              >
                Close
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-muted rounded-lg">
            {previewDocument && (
              previewDocument.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img
                  src={previewDocument.url}
                  alt={previewDocument.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={previewDocument.url}
                  className="w-full h-full min-h-[600px]"
                  title={previewDocument.name}
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel order #{order.order_id_internal}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelOrderLoading}>No, Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={cancelOrderLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelOrderLoading ? 'Cancelling...' : 'Yes, Cancel Order'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
