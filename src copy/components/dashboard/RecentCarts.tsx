import { ShoppingCart, Mail, MessageCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RootState, AppDispatch } from "@/redux/store";
import { useState, useEffect } from "react";
import SendTemplateDialog from "@/components/SendTemplateDialog";
import { fetchTemplates } from "@/redux/actions/templateActions";

const statusStyles = {
  pending: "status-warning",
  contacted: "status-info",
  recovered: "status-success",
  failed: "status-error",
};

export function RecentCarts() {
  const dispatch = useDispatch<AppDispatch>();
  const { carts } = useSelector((state: RootState) => state.abandonedCarts);
  const templates = useSelector((state: RootState) => state.template?.templates);
  const templatesArray = templates || [];

  const [sendTemplateOpen, setSendTemplateOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<any>(null);

  useEffect(() => {
    if (!templates || templates.length === 0) {
      dispatch(fetchTemplates());
    }
  }, [dispatch, templates]);

  // Group items by cart_id to show per cart
  const cartGroups: { [key: string]: any } = {};

  carts.forEach((cart) => {
    const isRegistered = cart.type === 'registered';
    const customer = isRegistered ? `${cart.customer?.firstname} ${cart.customer?.lastname}` : (cart.guest?.name || 'Guest');
    const phone = isRegistered ? cart.customer?.telephone : cart.guest?.mobile;
    const countryCode = isRegistered ? '' : (cart.guest?.country_code || '');
    const fullPhone = phone ? `${countryCode} ${phone}`.trim() : '';
    const status = 'pending';

    cart.items.forEach((item) => {
      const cartId = item.cart_id || item.id;
      if (!cartGroups[cartId]) {
        cartGroups[cartId] = {
          id: cartId,
          customer,
          phone: fullPhone,
          items: [],
          totalValue: 0,
          status,
        };
      }
      cartGroups[cartId].items.push(item);
      cartGroups[cartId].totalValue += parseFloat(item.final_price) * item.quantity;
    });
  });

  const transformedCarts = Object.values(cartGroups).map((group: any) => ({
    ...group,
    itemCount: group.items.length,
  }));

  const recentCarts = transformedCarts.slice(0, 4);

  return (
    <div className="stat-card animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="section-header font-light text-2xl">Recent Abandoned Carts</h3>
          <p className="font-light text-lg text-muted-foreground">Carts awaiting recovery</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/abandoned-carts">View All</Link>
        </Button>
      </div>
      <div className="space-y-4">
        {recentCarts.map((cart) => (
          <div
            key={cart.id}
            className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <ShoppingCart className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-light text-lg text-foreground">{cart.customer}</p>
                <p className="text-sm text-muted-foreground">{cart.phone}</p>
                <p className="text-sm font-medium text-muted-foreground">
                  Cart ID: {cart.id} · {cart.itemCount} items · {cart.totalValue.toFixed(2)} AED
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn("status-badge", statusStyles[cart.status])}>
                {cart.status}
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                  // Handle guest vs registered customers
                  const customerName = cart.customer.trim();
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
                  
                  const phoneStr = cart.phone;
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
              </div>
            </div>
          </div>
        ))}
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
