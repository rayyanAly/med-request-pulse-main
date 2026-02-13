import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Customer } from '@/redux/types';

interface CustomerOrderDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomerOrderDialog: React.FC<CustomerOrderDialogProps> = ({ customer, open, onOpenChange }) => {
  if (!customer || !customer.crm_data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details for {customer.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Customer Info</h3>
              <p>Name: {customer.crm_data.firstname} {customer.crm_data.lastname}</p>
              <p>Email: {customer.crm_data.email}</p>
              <p>Phone: {customer.crm_data.telephone}</p>
              <p>Registered: {new Date(customer.crm_data.registered_date).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Order Summary</h3>
              <p>Total Orders: {customer.crm_data.order_count}</p>
              <p>Completed Orders: {customer.crm_data.order_completed_count}</p>
              <p>Total Spent: AED {customer.crm_data.order_total.toFixed(2)}</p>
              <p>Completed Total: AED {customer.crm_data.order_completed_total.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Addresses</h3>
            <div className="space-y-2">
              {customer.crm_data.addresses.map((address) => (
                <div key={address.address_id} className="p-3 border rounded">
                  <p className="font-medium">{address.title}</p>
                  <p className="text-sm text-muted-foreground">{address.address}</p>
                  {address.lat && address.lng && (
                    <p className="text-sm">Lat: {address.lat}, Lng: {address.lng}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Orders</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...customer.crm_data.orders].sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime()).map((order) => (
                  <TableRow key={order.order_id}>
                    <TableCell>{order.order_id}</TableCell>
                    <TableCell>{new Date(order.date_added).toLocaleDateString()}</TableCell>
                    <TableCell>{order.delivery_date}</TableCell>
                    <TableCell>AED {parseFloat(order.total).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={order.order_status_name === 'Complete' ? 'default' : 'secondary'}>
                        {order.order_status_name}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerOrderDialog;