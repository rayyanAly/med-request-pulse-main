import { useState } from "react";
import {
  Search,
  Download,
  MessageCircle,
  Mail,
  Eye,
  MoreHorizontal,
  Crown,
  User,
  UserPlus,
} from "lucide-react";
import { customers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CustomerMessageDialog } from "@/components/customers/CustomerMessageDialog";

const segmentConfig = {
  vip: { icon: Crown, class: "bg-warning/10 text-warning", label: "VIP" },
  regular: { icon: User, class: "bg-primary/10 text-primary", label: "Regular" },
  new: { icon: UserPlus, class: "bg-success/10 text-success", label: "New" },
};

export default function Customers() {
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  const filteredCustomers = customers.filter((customer) => {
    if (segmentFilter !== "all" && customer.segment !== segmentFilter) return false;
    return true;
  });

  const handleMessage = (customer: typeof customers[0]) => {
    setSelectedCustomer(customer);
    setMessageDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-normal text-foreground">Customers</h1>
          <p className="text-muted-foreground">
            Manage customer profiles and messaging
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{customers.length}</p>
              <p className="text-sm text-muted-foreground">Total Customers</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Crown className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {customers.filter(c => c.segment === 'vip').length}
              </p>
              <p className="text-sm text-muted-foreground">VIP Customers</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <UserPlus className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {customers.filter(c => c.segment === 'new').length}
              </p>
              <p className="text-sm text-muted-foreground">New This Month</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="mt-1 text-2xl font-bold">
            ${customers.reduce((acc, c) => acc + c.totalSpent, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name, email, or phone..." className="input-search pl-10" />
          </div>
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="new">New</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => {
              const SegmentIcon = segmentConfig[customer.segment].icon;
              return (
                <TableRow key={customer.id} className="table-row-hover border-border">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "status-badge",
                      segmentConfig[customer.segment].class
                    )}>
                      <SegmentIcon className="h-3 w-3" />
                      {segmentConfig[customer.segment].label}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{customer.totalOrders}</TableCell>
                  <TableCell className="font-medium">
                    ${customer.totalSpent.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{customer.lastOrder}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleMessage(customer)}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleMessage(customer)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>View Orders</DropdownMenuItem>
                          <DropdownMenuItem>Message History</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Message Dialog */}
      <CustomerMessageDialog
        customer={selectedCustomer}
        open={messageDialogOpen}
        onOpenChange={setMessageDialogOpen}
      />
    </div>
  );
}
