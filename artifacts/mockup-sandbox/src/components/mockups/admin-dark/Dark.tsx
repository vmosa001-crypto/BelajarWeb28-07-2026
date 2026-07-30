import { Search, ShoppingBag, Package, Users, FileText, Settings, TrendingUp, Clock, CheckCircle2, ShoppingCart } from "lucide-react";

export function Dark() {
  const stats = [
    { label: "Total Pesanan", value: "248", icon: ShoppingCart, change: "+12%" },
    { label: "Pendapatan Bulan Ini", value: "Rp 45.200.000", icon: TrendingUp, change: "+8%" },
    { label: "Pesanan Pending", value: "12", icon: Clock, change: "-3%" },
    { label: "Produk Aktif", value: "24", icon: Package, change: "+2%" },
  ];

  const orders = [
    { id: "ORD-2847", customer: "Siti Nurhaliza", product: "Kemeja Batik Modern", total: "Rp 485.000", status: "Selesai", date: "12 Jan 2025" },
    { id: "ORD-2846", customer: "Budi Santoso", product: "Dress Tenun Ikat", total: "Rp 1.250.000", status: "Pending", date: "12 Jan 2025" },
    { id: "ORD-2845", customer: "Dewi Lestari", product: "Jaket Bomber Klasik", total: "Rp 890.000", status: "Diproses", date: "11 Jan 2025" },
    { id: "ORD-2844", customer: "Ahmad Fauzi", product: "Celana Kulot Premium", total: "Rp 420.000", status: "Selesai", date: "11 Jan 2025" },
    { id: "ORD-2843", customer: "Rina Wijaya", product: "Blouse Linen Kasual", total: "Rp 365.000", status: "Selesai", date: "10 Jan 2025" },
    { id: "ORD-2842", customer: "Hendra Gunawan", product: "Kemeja Batik Modern", total: "Rp 485.000", status: "Pending", date: "10 Jan 2025" },
  ];

  const topProducts = [
    { name: "Kemeja Batik Modern", category: "Kemeja", stock: 85, total: 120, price: "Rp 485.000" },
    { name: "Dress Tenun Ikat", category: "Dress", stock: 42, total: 60, price: "Rp 1.250.000" },
    { name: "Jaket Bomber Klasik", category: "Outerwear", stock: 28, total: 45, price: "Rp 890.000" },
    { name: "Celana Kulot Premium", category: "Celana", stock: 64, total: 80, price: "Rp 420.000" },
    { name: "Blouse Linen Kasual", category: "Blouse", stock: 51, total: 75, price: "Rp 365.000" },
  ];

  const navItems = [
    { icon: ShoppingBag, label: "Dashboard", active: true },
    { icon: Package, label: "Produk", active: false },
    { icon: FileText, label: "Pesanan", active: false },
    { icon: Users, label: "Pelanggan", active: false },
    { icon: TrendingUp, label: "Laporan", active: false },
    { icon: Settings, label: "Pengaturan", active: false },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Pending": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Diproses": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] border-r border-slate-700/50 flex flex-col fixed left-0 top-0 h-full">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Agas Collection</h1>
              <p className="text-xs text-amber-400 font-medium tracking-wide">LOMBOK</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                item.active
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-sm font-bold">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin Store</p>
              <p className="text-xs text-slate-400 truncate">admin@agas.co.id</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-[#1e293b] border-b border-slate-700/50 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari pesanan, produk..."
                  className="pl-10 pr-4 py-2 bg-[#0f172a] border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-64"
                />
              </div>
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-sm font-bold text-white ring-2 ring-slate-700/50">
                AS
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6 hover:border-amber-500/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Recent Orders Table */}
            <div className="col-span-2 bg-[#1e293b] border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-lg font-bold text-white">Pesanan Terbaru</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">ID Pesanan</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Pelanggan</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Produk</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4 text-sm font-mono text-amber-400">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-slate-200">{order.customer}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{order.product}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-white">{order.total}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {order.status === "Selesai" && <CheckCircle2 className="w-3 h-3" />}
                            {order.status === "Pending" && <Clock className="w-3 h-3" />}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-lg font-bold text-white">Produk Terlaris</h3>
              </div>
              <div className="p-6 space-y-5">
                {topProducts.map((product) => (
                  <div key={product.name} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">{product.name}</h4>
                        <p className="text-xs text-slate-400">{product.category}</p>
                      </div>
                      <span className="text-sm font-bold text-amber-400 whitespace-nowrap ml-2">{product.price}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Stok</span>
                        <span className="text-slate-300 font-medium">{product.stock}/{product.total}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                          style={{ width: `${(product.stock / product.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
