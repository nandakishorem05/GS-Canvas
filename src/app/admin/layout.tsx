import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Image as ImageIcon, Users, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-black border-r border-border flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <span className="font-heading text-xl font-bold tracking-wider">GS ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
            { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
            { name: "Custom Artworks", icon: ImageIcon, href: "/admin/artworks" },
            { name: "Customers", icon: Users, href: "/admin/customers" },
            { name: "Settings", icon: Settings, href: "/admin/settings" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground/70 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-foreground rounded-lg transition-colors"
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
