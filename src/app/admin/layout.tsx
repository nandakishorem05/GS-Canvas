'use client';

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, ShoppingCart, Image as ImageIcon, 
  Users, Settings, Package, Tags, LayoutTemplate,
  LogOut
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== '/admin/login') {
      const loggedIn = localStorage.getItem("admin_logged_in");
      const hasCookie = document.cookie.includes("admin_token");
      if (!loggedIn && !hasCookie) {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  // Don't wrap the login page in the dashboard layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Products", icon: Package, href: "/admin/products" },
    { name: "Categories", icon: Tags, href: "/admin/categories" },
    { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
    { name: "Custom Orders", icon: ImageIcon, href: "/admin/custom-orders" },
    { name: "Customers", icon: Users, href: "/admin/customers" },
    { name: "Homepage", icon: LayoutTemplate, href: "/admin/homepage" },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  const handleLogout = async () => {
    document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("admin_logged_in");
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-zinc-800">
          <span className="font-heading text-xl font-bold tracking-wider text-white">GS ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-zinc-950">
        {children}
      </main>
    </div>
  );
}
