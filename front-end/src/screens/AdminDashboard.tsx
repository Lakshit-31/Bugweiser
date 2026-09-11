import { useState, useEffect } from 'react';
import {
  Sprout, LogOut, Users, TrendingUp, TrendingDown, Search, ShieldCheck,
  ShoppingBag, Loader2, MapPin, Phone,
} from 'lucide-react';
import type { AdminUserRow, AdminPlatformStat } from '@/data/mockData';
import { getAdminUser, getAllUsers, getPlatformStats } from '@/data/api';
import StatusPill from '@/components/StatusPill';

interface AdminDashboardProps {
  onLogout: () => void;
}

type RoleFilter = 'all' | 'farmer' | 'buyer';

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [admin, setAdmin] = useState<{ name: string; phone: string; email: string } | null>(null);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [stats, setStats] = useState<AdminPlatformStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  useEffect(() => {
    Promise.all([getAdminUser(), getAllUsers(), getPlatformStats()]).then(([adminData, userData, statsData]) => {
      setAdmin(adminData);
      setUsers(userData);
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.location.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const farmerCount = users.filter((u) => u.role === 'farmer').length;
  const buyerCount = users.filter((u) => u.role === 'buyer').length;
  const activeCount = users.filter((u) => u.status === 'Active').length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Loader2 size={32} className="animate-spin text-leaf-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Admin navbar */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-dusk-500/95 backdrop-blur-md">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-dusk-400">
                <ShieldCheck size={20} className="text-paper" />
              </div>
              <div>
                <span className="font-serif text-xl font-semibold text-paper">Moolya</span>
                <span className="ml-2 rounded-full bg-dusk-400/40 px-2 py-0.5 text-xs font-semibold text-paper">
                  Admin
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-paper">{admin?.name}</p>
                <p className="text-xs text-dusk-100">{admin?.email}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dusk-400 text-paper">
                <ShieldCheck size={16} />
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-lg border border-dusk-300 px-3 py-1.5 text-sm font-medium text-paper transition-colors hover:bg-dusk-400"
              >
                <LogOut size={15} /> <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-content px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-semibold text-ink">Platform Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Monitor users, orders, and platform activity.</p>
        </div>

        {/* Stats grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="card">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="mt-1 font-serif text-2xl font-bold text-ink">{stat.value}</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                {stat.trendUp ? (
                  <TrendingUp size={13} className="text-leaf-500" />
                ) : (
                  <TrendingDown size={13} className="text-rust-500" />
                )}
                <span className={stat.trendUp ? 'text-leaf-600' : 'text-rust-500'}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick summary cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-leaf-100 bg-leaf-50 px-5 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-leaf-500 text-paper">
              <Sprout size={20} />
            </div>
            <div>
              <p className="font-serif text-xl font-bold text-leaf-700">{farmerCount}</p>
              <p className="text-sm text-leaf-600">Farmers</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-dusk-100 bg-dusk-50 px-5 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-dusk-500 text-paper">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="font-serif text-xl font-bold text-dusk-700">{buyerCount}</p>
              <p className="text-sm text-dusk-600">Buyers</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-leaf-100 bg-leaf-50 px-5 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-leaf-400 text-paper">
              <Users size={20} />
            </div>
            <div>
              <p className="font-serif text-xl font-bold text-leaf-700">{activeCount}</p>
              <p className="text-sm text-leaf-600">Active users</p>
            </div>
          </div>
        </div>

        {/* User management table */}
        <div className="rounded-2xl border border-black/5 bg-white shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-serif text-lg font-semibold text-ink">User Management</h2>
            <p className="mt-0.5 text-sm text-gray-500">All registered farmers and buyers on the platform.</p>
          </div>

          {/* Search + filter */}
          <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, or location..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-ink placeholder:text-gray-400 focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100 sm:w-72"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'farmer', 'buyer'] as RoleFilter[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                    roleFilter === r
                      ? 'bg-dusk-500 text-paper'
                      : 'border border-gray-200 bg-white text-gray-500 hover:border-dusk-200 hover:text-dusk-500'
                  }`}
                >
                  {r === 'all' ? 'All Users' : r === 'farmer' ? 'Farmers' : 'Buyers'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 transition-colors hover:bg-leaf-50/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                          user.role === 'farmer' ? 'bg-leaf-100 text-leaf-600' : 'bg-dusk-100 text-dusk-600'
                        }`}>
                          {user.role === 'farmer' ? <Sprout size={14} /> : <ShoppingBag size={14} />}
                        </div>
                        <span className="font-medium text-ink">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Phone size={12} className="text-gray-400" />
                        +91 {user.phone}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        user.role === 'farmer'
                          ? 'bg-leaf-50 text-leaf-600'
                          : 'bg-dusk-50 text-dusk-600'
                      }`}>
                        {user.role === 'farmer' ? <Sprout size={11} /> : <ShoppingBag size={11} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin size={12} className="text-gray-400" />
                        {user.location}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <StatusPill status={user.status} />
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {new Date(user.joinedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-gray-400">
              No users found matching your search.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
