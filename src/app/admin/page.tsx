import { mockProducts } from "@/lib/mock-data";
import { ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import Image from "next/image";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-foreground/60">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Revenue", value: "$45,231.89", icon: DollarSign, trend: "+20.1%" },
          { title: "Active Orders", value: "124", icon: ShoppingCart, trend: "+5.4%" },
          { title: "Custom Requests", value: "32", icon: Package, trend: "+12.5%" },
          { title: "Total Customers", value: "2,845", icon: Users, trend: "+18.2%" },
        ].map((metric) => (
          <div key={metric.title} className="bg-white dark:bg-black border border-border p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
                <metric.icon size={20} className="text-foreground" />
              </div>
              <span className="flex items-center text-green-500 text-xs font-medium">
                {metric.trend} <ArrowUpRight size={14} className="ml-1" />
              </span>
            </div>
            <div>
              <p className="text-sm text-foreground/60 font-medium mb-1">{metric.title}</p>
              <h3 className="text-2xl font-bold font-heading">{metric.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-black border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="font-heading text-xl font-bold">Recent Orders</h2>
            <button className="text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-foreground/60 uppercase bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { id: "#ORD-001", customer: "Elena R.", product: "Custom Sketch", date: "Today", status: "Processing", amount: "$149.00" },
                  { id: "#ORD-002", customer: "Michael T.", product: "Abstract Noir", date: "Yesterday", status: "Shipped", amount: "$189.00" },
                  { id: "#ORD-003", customer: "Sarah K.", product: "Golden Hour Bloom", date: "May 09, 2026", status: "Delivered", amount: "$249.00" },
                  { id: "#ORD-004", customer: "David L.", product: "Graphite Elegance", date: "May 08, 2026", status: "Processing", amount: "$149.00" },
                ].map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{order.id}</td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4">{order.product}</td>
                    <td className="px-6 py-4 text-foreground/60">{order.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-black border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="font-heading text-xl font-bold">Top Products</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-6">
            {mockProducts.filter(p => p.isBestSeller).slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-900">
                  <Image src={product.image} alt={product.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{product.title}</h4>
                  <p className="text-xs text-foreground/60">{product.category}</p>
                </div>
                <div className="font-semibold text-sm">
                  ${product.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
