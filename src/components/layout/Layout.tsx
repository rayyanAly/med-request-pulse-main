import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Search,
  ChevronDown,
  LogOut,
  Menu,
  User as UserIcon,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { logout } from "@/redux/actions/loginActions";
import { Outlet } from "react-router-dom";

const LOGO_URL = "https://800pharmacy.ae/assets/images/logo.svg";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Products", href: "/products", icon: Package },
  { name: "Users", href: "/users", icon: Users },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useSelector((state: any) => state.login);

  const getDisplayName = () => {
    if (user?.store_name) return user.store_name;
    if (user?.user_name) return user.user_name;
    return "User";
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card border-r border-border transform transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "w-[60px]" : "w-[160px]"
        )}
      >
        {/* Logo Header */}
        <div className="h-14 flex items-center justify-center border-b border-border px-2">
          <img
            src={LOGO_URL}
            alt="800 Pharmacy"
            className={cn(
              "object-contain transition-all duration-300",
              sidebarCollapsed ? "h-8" : "h-10"
            )}
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-2 px-1.5 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center rounded-lg transition-all duration-150 group",
                  "h-9",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  sidebarCollapsed ? "justify-center px-2" : "gap-2.5 px-2.5"
                )}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    !isActive && "group-hover:scale-105 transition-transform"
                  )}
                />
                {!sidebarCollapsed && (
                  <span className="text-sm whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle Button */}
        <div className="border-t border-border p-1.5">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "flex items-center w-full rounded-lg transition-colors",
              "h-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              sidebarCollapsed ? "justify-center px-2" : "gap-2.5 px-2.5"
            )}
          >
            {sidebarCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4 shrink-0" />
                <span className="text-sm whitespace-nowrap">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "lg:ml-[60px]" : "lg:ml-[160px]"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-14 bg-card/95 backdrop-blur-sm border-b border-border flex items-center px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 h-9 bg-muted/50"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 h-9">
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">
                      {getDisplayName()}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" onClick={() => navigate("/auth")}>
                Login
              </Button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
