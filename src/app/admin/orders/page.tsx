import { Search, Filter, Download } from "lucide-react";

export default function AdminOrders() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold mb-2">Orders</h1>
          <p className="text-sm text-foreground/60">Manage and track customer orders</p>
        </div>
        <button className="border border-border bg-white dark:bg-black text-foreground px-4 py-2 font-medium flex items-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <Download size={16} /> Export
        </button>
      </div>

      <div className="bg-white dark:bg-black border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-2.5 text-foreground/50" />
            <input 
              type="text" 
              placeholder="Search by Order ID, Customer, or Email" 
              className="w-full border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-foreground"
            />
          </div>
          <button className="border border-border rounded-lg px-4 py-2 flex items-center gap-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-foreground/60 uppercase bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment Status</th>
                <th className="px-6 py-4 font-medium">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { id: "#ORD-001", customer: "Elena R.", date: "Today at 2:30 PM", status: "Unfulfilled", payment: "Paid", amount: "$149.00" },
                { id: "#ORD-002", customer: "Michael T.", date: "Yesterday at 10:15 AM", status: "Fulfilled", payment: "Paid", amount: "$189.00" },
                { id: "#ORD-003", customer: "Sarah K.", date: "May 09, 2026", status: "Fulfilled", payment: "Refunded", amount: "$249.00" },
                { id: "#ORD-004", customer: "David L.", date: "May 08, 2026", status: "Unfulfilled", payment: "Pending", amount: "$149.00" },
                { id: "#ORD-005", customer: "James W.", date: "May 07, 2026", status: "Fulfilled", payment: "Paid", amount: "$89.00" },
              ].map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">{order.id}</td>
                  <td className="px-6 py-4 text-foreground/60">{order.date}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4 font-medium">{order.amount}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-xs font-medium ${
                       order.payment === 'Paid' ? 'bg-green-100 text-green-700' :
                       order.payment === 'Refunded' ? 'bg-neutral-200 text-neutral-700' :
                       'bg-orange-100 text-orange-700'
                     }`}>
                       {order.payment}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-xs font-medium ${
                       order.status === 'Fulfilled' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                       'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                     }`}>
                       {order.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
