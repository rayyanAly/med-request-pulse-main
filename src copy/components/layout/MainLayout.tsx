import { ReactNode, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={cn("flex flex-1 flex-col transition-all duration-300", collapsed ? "ml-16" : "ml-52")}>
        <Header />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
