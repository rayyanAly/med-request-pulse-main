import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  Search,
  Filter,
  Download,
  MessageCircle,
  Mail,
  MoreHorizontal,
} from "lucide-react";
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
import { fetchAbandonedCarts } from "@/redux/actions/abandonedCartsActions";
import { AbandonedCart } from "@/redux/types";
import SendTemplateDialog from "@/components/SendTemplateDialog";
import { fetchTemplates } from "@/redux/actions/templateActions";

const statusStyles = {
  pending: "status-warning",
  contacted: "status-info",
  recovered: "status-success",
  failed: "status-error",
};

export default function AbandonedCarts() {
  const dispatch = useDispatch<AppDispatch>();
  const { carts, loading, error } = useSelector((state: RootState) => state.abandonedCarts);
  const templates = useSelector((state: RootState) => state.template?.templates);
  const templatesArray = templates || [];

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sendTemplateOpen, setSendTemplateOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchAbandonedCarts());
  }, [dispatch]);
  
  useEffect(() => {
    if (!templates || templates.length === 0) {
      dispatch(fetchTemplates());
    }
  }, [dispatch, templates]);

  // Transform API data to table format (per item)
  const transformedItems = carts.flatMap((cart) => {
    const isRegistered = cart.type === 'registered';
    const customer = isRegistered ? `${cart.customer?.firstname} ${cart.customer?.lastname}` : (cart.guest?.name || 'Guest');
    const email = isRegistered ? cart.customer?.email : cart.guest?.email;
    const phone = isRegistered ? cart.customer?.telephone : cart.guest?.mobile;
    const source = 'website'; // Default, as API doesn't specify
    const status = 'pending'; // Default, as API doesn't have status

    return cart.items.map((item) => {
      const countryCode = isRegistered ? '' : (cart.guest?.country_code || '');
      const fullPhone = phone ? `${countryCode} ${phone}`.trim() : '';

      return {
        id: `${cart.type === 'registered' ? item.cart_id : item.id}-${item.product_id}`,
        customer,
        email: email || '',
        phone: fullPhone,
        cartId: item.cart_id || item.id,
        productId: item.product_id,
        quantity: item.quantity,
        finalPrice: parseFloat(item.final_price),
        source,
        abandonedAt: item.date_added || item.created_at,
        status,
      };
    });
  });

  const filteredCarts = transformedItems.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (sourceFilter !== "all" && item.source !== sourceFilter) return false;
    return true;
  });

  // Calculate stats
  // Count unique carts from filtered items
  const uniqueCartIds = new Set(filteredCarts.map(item => item.cartId));
  const totalAbandoned = uniqueCartIds.size;
  
  // Calculate total value from all filtered items using only final_price * quantity
  const totalValue = filteredCarts.reduce((sum, item) => {
    const finalPrice = Number(item.finalPrice) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + (finalPrice * quantity);
  }, 0);
  
  // Since API doesn't provide recovery data, we calculate contacted/recovered from status
  const totalContacted = filteredCarts.filter(c => c.status === 'contacted' || c.status === 'recovered').length;
  const totalRecovered = filteredCarts.filter(c => c.status === 'recovered').length;
  const recoveryRate = totalAbandoned > 0 ? ((totalRecovered / totalAbandoned) * 100) : 0;
  
  // Calculate recovered value from recovered items
  const recoveredValue = filteredCarts
    .filter(item => item.status === 'recovered')
    .reduce((sum, item) => {
      const finalPrice = Number(item.finalPrice) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + (finalPrice * quantity);
    }, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-normal text-foreground">Abandoned Carts</h1>
          <p className="text-muted-foreground">
            Manage and recover abandoned shopping carts
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Abandoned</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{totalAbandoned}</p>
          <p className="mt-1 text-xs text-muted-foreground">Last 30 days</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{totalValue.toFixed(2)} AED</p>
          <p className="mt-1 text-xs text-muted-foreground">Potential revenue</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Recovery Rate</p>
          <p className="mt-1 text-2xl font-bold text-success">{recoveryRate.toFixed(1)}%</p>
          <p className="mt-1 text-xs text-muted-foreground">{totalRecovered} of {totalAbandoned} recovered</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Recovered Value</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{recoveredValue.toFixed(2)} AED</p>
          <p className="mt-1 text-xs text-muted-foreground">{totalContacted} contacted</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by customer name or email..." className="input-search pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="recovered">Recovered</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="mobile">Mobile App</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Cart ID</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Abandoned At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCarts.map((item) => (
              <TableRow key={item.id} className="table-row-hover border-border">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{item.customer}</p>
                    <p className="text-sm text-muted-foreground">{item.email}</p>
                  </div>
                </TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.cartId}</TableCell>
                <TableCell>{item.productId}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="font-medium">{item.finalPrice.toFixed(2)} AED</TableCell>
                <TableCell className="font-semibold">{(item.finalPrice * item.quantity).toFixed(2)} AED</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {item.source}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(item.abandonedAt)}
                </TableCell>
                <TableCell>
                  <span className={cn("status-badge", statusStyles[item.status])}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                      // Handle guest vs registered customers
                      const customerName = item.customer.trim();
                      let firstName = '';
                      let lastName = '';
                      
                      if (!customerName || customerName === 'Guest' || customerName.startsWith('Contact ')) {
                        // For guest users or contacts without names
                        firstName = 'Guest';
                        lastName = 'User';
                      } else {
                        // For registered customers with names
                        const nameParts = customerName.split(' ');
                        firstName = nameParts[0] || '';
                        lastName = nameParts.slice(1).join(' ') || '';
                      }
                      
                      const phoneStr = item.phone;
                      let countryCode = '+971';
                      let phoneNumber = phoneStr;
                      if (phoneStr) {
                        const countryCodes = [
                          { code: '+971', country: 'AE', name: 'UAE' },
                          { code: '+966', country: 'SA', name: 'Saudi Arabia' },
                          { code: '+965', country: 'KW', name: 'Kuwait' },
                          { code: '+973', country: 'BH', name: 'Bahrain' },
                          { code: '+974', country: 'QA', name: 'Qatar' },
                          { code: '+968', country: 'OM', name: 'Oman' },
                          { code: '+1', country: 'US', name: 'United States' },
                          { code: '+44', country: 'GB', name: 'United Kingdom' },
                          { code: '+91', country: 'IN', name: 'India' },
                          { code: '+60', country: 'MY', name: 'Malaysia' }
                        ];
                        for (const cc of countryCodes) {
                          const codeDigits = cc.code.replace(/\D/g, '');
                          if (phoneStr.replace(/\D/g, '').startsWith(codeDigits)) {
                            countryCode = cc.code;
                            phoneNumber = phoneStr.replace(/\D/g, '').substring(codeDigits.length);
                            break;
                          }
                        }
                        if (phoneNumber.startsWith('0')) {
                          phoneNumber = phoneNumber.substring(1);
                        }
                      }
                      setSelectedCartItem({ firstName, lastName, phone: phoneNumber, countryCode });
                      setSendTemplateOpen(true);
                    }}>
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Mark as Recovered</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Failed</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SendTemplateDialog
        templates={templatesArray}
        open={sendTemplateOpen}
        onOpenChange={setSendTemplateOpen}
        initialFirstName={selectedCartItem?.firstName}
        initialLastName={selectedCartItem?.lastName}
        initialPhone={selectedCartItem?.phone}
        initialCountryCode={selectedCartItem?.countryCode}
      />

    </div>
  );
}
