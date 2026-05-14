import { mockProducts } from "@/lib/mock-data";
import Image from "next/image";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminProducts() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold mb-2">Products</h1>
          <p className="text-sm text-foreground/60">Manage your product catalog</p>
        </div>
        <button className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 font-medium flex items-center gap-2 hover:opacity-90">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-black border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-foreground/60 uppercase bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded bg-neutral-100 overflow-hidden">
                       <Image src={product.image} alt={product.title} fill className="object-cover" />
                    </div>
                    <span className="font-medium">{product.title}</span>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">${product.price}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-foreground/60 hover:text-foreground mr-3"><Edit2 size={16} /></button>
                    <button className="text-red-500/60 hover:text-red-500"><Trash2 size={16} /></button>
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
