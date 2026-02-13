import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Megaphone,
  FileText,
  Users,
  Image,
  Settings,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Zap,
  Tag,
  Plug,
  Package,
  Box,
  AlertCircle,
  Building,
  FolderTree,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Abandoned Carts", icon: ShoppingCart, path: "/abandoned-carts" },
  { title: "Analytics", icon: BarChart3, path: "/analytics" },
  { title: "Campaigns", icon: Megaphone, path: "/campaigns" },
  { title: "Templates", icon: FileText, path: "/templates" },
  { title: "Customers", icon: Users, path: "/customers" },
  { title: "Promotions", icon: Tag, path: "/promotions" },
  { title: "Banners", icon: Image, path: "/banners" },
  { title: "Integrations", icon: Plug, path: "/integrations" },
  { title: "Logs", icon: ScrollText, path: "/logs" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const catalogItems = [
  { title: "Products", icon: Box, path: "/products" },
  { title: "Manufacturers", icon: Building, path: "/manufacturers" },
  { title: "Categories", icon: FolderTree, path: "/categories" },
  { title: "Broken Images", icon: AlertCircle, path: "/products/broken-images" },
];

interface AppSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function AppSidebar({ collapsed, setCollapsed }: AppSidebarProps) {
  const location = useLocation();
  const [catalogOpen, setCatalogOpen] = useState(true);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-41"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src="https://800pharmacy.ae/assets/images/logo.svg" alt="Logo" className="h-28 w-28" />
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-10 w-10 items-center justify-center">
            <img src="https://800pharmacy.ae/assets/images/logo.svg" alt="Logo" className="h-10 w-10" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "nav-item",
                isActive && "nav-item-active",
                collapsed && "justify-center px-2"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
        
        {/* Catalog Dropdown */}
        <div>
          <button
            onClick={() => !collapsed && setCatalogOpen(!catalogOpen)}
            className={cn(
              "nav-item w-full",
              (location.pathname.startsWith("/products") || 
               location.pathname.startsWith("/manufacturers") || 
               location.pathname.startsWith("/categories")) && "nav-item-active",
              collapsed && "justify-center px-2"
            )}
          >
            <Package className="h-5 w-5 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Catalog</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", catalogOpen && "rotate-180")} />
              </>
            )}
          </button>
          {!collapsed && catalogOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {catalogItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "nav-item text-sm",
                      isActive && "nav-item-active"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full justify-center text-muted-foreground hover:text-foreground",
            !collapsed && "justify-start"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
