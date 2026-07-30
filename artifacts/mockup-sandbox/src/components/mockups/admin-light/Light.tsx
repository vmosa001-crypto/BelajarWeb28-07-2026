import { Bell, Package, ShoppingCart, Users, TrendingUp, TrendingDown, FileText, Settings, Search, MoreVertical, AlertCircle } from 'lucide-react';

export function Light() {
  const stats = [
    { label: 'Total Pesanan', value: '248', trend: '+12%', trendUp: true, icon: ShoppingCart, color: 'text-amber-700' },
    { label: 'Pendapatan Bulan Ini', value: 'Rp 45.200.000', trend: '+8%', trendUp: true, icon: TrendingUp, color: 'text-emerald-700' },
    { label: 'Pesanan Pending', value: '12', trend: '-3%', trendUp: false, icon: Package, color: 'text-orange-700' },
    { label: 'Produk Aktif', value: '24', trend: '+2', trendUp: true, icon: Package, color: 'text-blue-700' },
  ];

  const orders = [
    { id: '#AGS-1847', customer: 'Siti Nurhaliza', product: 'Kemeja Linen Putih', total: 'Rp 450.000', status: 'Selesai', date: '12 Jan 2024' },
    { id: '#AGS-1846', customer: 'Rina Wijaya', product: 'Dress Batik Modern', total: 'Rp 850.000', status: 'Diproses', date: '12 Jan 2024' },
    { id: '#AGS-1845', customer: 'Ahmad Fauzi', product: 'Outer Tenun Lombok', total: 'Rp 1.200.000', status: 'Pending', date: '11 Jan 2024' },
    { id: '#AGS-1844', customer: 'Dewi Kartika', product: 'Rok Midi Cream', total: 'Rp 380.000', status: 'Selesai', date: '11 Jan 2024' },
    { id: '#AGS-1843', customer: 'Budi Santoso', product: 'Kemeja Tenun Navy', total: 'Rp 520.000', status: 'Selesai', date: '10 Jan 2024' },
    { id: '#AGS-1842', customer: 'Maya Putri', product: 'Atasan Songket Gold', total: 'Rp 950.000', status: 'Pending', date: '10 Jan 2024' },
  ];

  const categories = [
    { name: 'Atasan', percentage: 35, color: 'bg-amber-600' },
    { name: 'Bawahan', percentage: 28, color: 'bg-orange-500' },
    { name: 'Outer', percentage: 22, color: 'bg-rose-500' },
    { name: 'Dress', percentage: 15, color: 'bg-amber-700' },
  ];

  const lowStock = [
    { name: 'Kemeja Linen Putih', stock: 3 },
    { name: 'Dress Batik Modern', stock: 2 },
    { name: 'Rok Midi Cream', stock: 4 },
  ];

  const navItems = [
    { icon: TrendingUp, label: 'Dashboard', active: true },
    { icon: Package, label: 'Produk', active: false },
    { icon: ShoppingCart, label: 'Pesanan', active: false },
    { icon: Users, label: 'Pelanggan', active: false },
    { icon: FileText, label: 'Laporan', active: false },
    { icon: Settings, label: 'Pengaturan', active: false },
  ];

  return (
    <div className="flex h-screen bg-white font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-64 bg-[#faf8f5] border-r border-[#e8e4dd] flex flex-col">
        <div className="p-6 border-b border-[#e8e4dd]">
          <h1 className="text-2xl font-serif font-bold text-[#2d2520] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Agas Collection
          </h1>
          <p className="text-[10px] tracking-[0.15em] uppercase text-[#8b7963] font-medium mt-0.5">
            Lombok
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'bg-white text-[#c2714f] shadow-sm border border-[#e8e4dd]'
                  : 'text-[#6b5d52] hover:bg-white/50 hover:text-[#c2714f]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#e8e4dd]">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c2714f] to-[#a85d3f] flex items-center justify-center text-white text-sm font-semibold">
              AD
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2d2520]">Admin</p>
              <p className="text-xs text-[#8b7963]">admin@agas.id</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#2d2520]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Selamat datang, Admin
            </h2>
            <p className="text-sm text-[#8b7963] mt-0.5">Jumat, 12 Januari 2024</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b7963]" />
              <input
                type="text"
                placeholder="Cari..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c2714f]/20 focus:border-[#c2714f]"
              />
            </div>
            <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-[#6b5d52]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c2714f] rounded-full"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c2714f] to-[#a85d3f] flex items-center justify-center text-white text-sm font-semibold">
              AD
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* KPI Stats */}
          <div className="grid grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color === 'text-amber-700' ? 'from-amber-50 to-orange-50' : stat.color === 'text-emerald-700' ? 'from-emerald-50 to-teal-50' : stat.color === 'text-orange-700' ? 'from-orange-50 to-amber-50' : 'from-blue-50 to-indigo-50'}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  {stat.trendUp ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-rose-600">
                      <TrendingDown className="w-3 h-3" />
                      {stat.trend}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-[#2d2520] mb-1">{stat.value}</p>
                <p className="text-sm text-[#8b7963]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-[#2d2520]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Pesanan Terbaru
              </h3>
              <button className="text-sm text-[#c2714f] font-medium hover:underline">
                Lihat Semua
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#faf8f5] border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#6b5d52] uppercase tracking-wider">ID Pesanan</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#6b5d52] uppercase tracking-wider">Pelanggan</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#6b5d52] uppercase tracking-wider">Produk</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#6b5d52] uppercase tracking-wider">Total</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#6b5d52] uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#6b5d52] uppercase tracking-wider">Tanggal</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#6b5d52] uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-[#2d2520]">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-[#4a3f35]">{order.customer}</td>
                      <td className="px-6 py-4 text-sm text-[#6b5d52]">{order.product}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#2d2520]">{order.total}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Selesai'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#8b7963]">{order.date}</td>
                      <td className="px-6 py-4">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <MoreVertical className="w-4 h-4 text-[#8b7963]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="text-lg font-serif font-bold text-[#2d2520] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Kategori Produk
              </h3>

              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#4a3f35]">{cat.name}</span>
                      <span className="text-sm font-semibold text-[#2d2520]">{cat.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="w-5 h-5 text-[#c2714f]" />
                <h3 className="text-lg font-serif font-bold text-[#2d2520]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Produk Low Stock
                </h3>
              </div>

              <div className="space-y-3">
                {lowStock.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-lg"
                  >
                    <span className="text-sm font-medium text-[#4a3f35]">{item.name}</span>
                    <span className="px-2.5 py-1 bg-white border border-amber-200 rounded-md text-xs font-semibold text-amber-700">
                      {item.stock} unit
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 px-4 py-2.5 bg-[#c2714f] hover:bg-[#a85d3f] text-white font-medium rounded-lg transition-colors text-sm">
                Kelola Stok
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
