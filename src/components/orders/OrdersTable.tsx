import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Order as ApiOrder, OrderTotal, OrderListItem, OrdersTableProps } from "@/api/types";

const mapApiOrderToOrder = (apiOrder: ApiOrder): OrderListItem => {
  // Calculate total from OrderTotal array
  const totalValue =
    apiOrder.total && Array.isArray(apiOrder.total)
      ? apiOrder.total.reduce((sum: number, item: OrderTotal) => sum + item.value, 0)
      : 0;

  return {
    id: `#${apiOrder.order_id_internal}`,
    customerName: `${apiOrder.firstname} ${apiOrder.lastname}`,
    customerPhone: apiOrder.telephone,
    value: totalValue,
    status: apiOrder.order_status,
    dateTime: apiOrder.date_added,
    preparedBy: apiOrder.agent_name || undefined,
    preparedAt: apiOrder.activities?.prepared_at || undefined,
    dispatchedAt: apiOrder.activities?.dispatched || undefined,
    deliveredAt: apiOrder.activities?.delivered_at || undefined,
  };
};

const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    "New Order": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "Under Process": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    "Ready for Dispatch": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    "Dispatch": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    "Delivered": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    "Canceled": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    "On Hold": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  };
  return statusMap[status] || "bg-gray-100 text-gray-800";
};

export function OrdersTable({ statusFilter }: OrdersTableProps) {
  const { orders } = useSelector((state: any) => state.orders);
  const mappedOrders = orders.map(mapApiOrderToOrder);

  const filteredOrders =
    statusFilter === "all"
      ? mappedOrders
      : mappedOrders.filter((order) =>
          statusFilter === "new"
            ? order.status === "New Order"
            : statusFilter === "process"
            ? order.status === "Under Process"
            : statusFilter === "ready"
            ? order.status === "Ready for Dispatch"
            : statusFilter === "dispatch"
            ? order.status === "Dispatch"
            : statusFilter === "delivered"
            ? order.status === "Delivered"
            : statusFilter === "canceled"
            ? order.status === "Canceled"
            : statusFilter === "hold"
            ? order.status === "On Hold"
            : true
        );

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date / Time</TableHead>
            <TableHead>Prepared by</TableHead>
            <TableHead>Prepared at</TableHead>
            <TableHead>Dispatched at</TableHead>
            <TableHead>Delivered at</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.customerPhone}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {typeof order.value === "number"
                  ? order.value.toFixed(2)
                  : order.value}
              </TableCell>
              <TableCell>
                <Badge
                  className={getStatusColor(order.status)}
                  variant="secondary"
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{order.dateTime}</TableCell>
              <TableCell>{order.preparedBy || "-"}</TableCell>
              <TableCell>{order.preparedAt || "-"}</TableCell>
              <TableCell>{order.dispatchedAt || "-"}</TableCell>
              <TableCell>{order.deliveredAt || "-"}</TableCell>
              <TableCell className="text-right">
                <Link to={`/orders/${order.id.replace("#", "")}`}>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No orders found for this filter
        </div>
      )}
    </div>
  );
}
