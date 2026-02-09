import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import { AdminSidebar, AdminTab } from "./components/AdminSidebar";
import { OverviewTab } from "./components/OverviewTab";
import { DataTable } from "./components/DataTable";
import { SystemTab } from "./components/SystemTab";
import { BugsTab } from "./components/BugsTab";
import { FinanceTab } from "./components/FinanceTab";

/* ================= TYPES ================= */

interface Booking {
  _id: string;
  service?: string;
  customer?: string;
  total_price?: number | string;
  status?: "pending" | "matched" | "in_progress" | "completed";
}

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalWorkers: number;
  totalRevenue: number;
  activeBookings: number;
  completedBookings: number;
  pendingBookings: number;
  systemHealth: "healthy" | "warning" | "critical";
}

/* ================= COMPONENT ================= */

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalWorkers: 0,
    totalRevenue: 0,
    activeBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    systemHealth: "healthy",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  /* ================= AUTH ================= */

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const handleLogin = () => {
    setError("");
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      setError("Invalid admin credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  /* ================= DATA FETCH ================= */

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, bookingsRes, workersRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/bookings"),
        fetch("/api/admin/workers"),
      ]);

      const users = await usersRes.json();
      const bookings: Booking[] = await bookingsRes.json();
      const workers = await workersRes.json();

      const completed = bookings.filter(b => b.status === "completed");
      const active = bookings.filter(
        b => b.status === "pending" || b.status === "matched" || b.status === "in_progress"
      );

      const totalRevenue = completed.reduce(
        (sum, b) => sum + Number(b.total_price ?? 0),
        0
      );

      setStats({
        totalUsers: users.length,
        totalBookings: bookings.length,
        totalWorkers: workers.length,
        totalRevenue,
        activeBookings: active.length,
        completedBookings: completed.length,
        pendingBookings:
          bookings.length - completed.length - active.length,
        systemHealth: "healthy",
      });
    } catch (err) {
      console.error(err);
      setStats(prev => ({ ...prev, systemHealth: "critical" }));
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIN UI ================= */

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <BarChart3 className="text-white w-8 h-8" />
            </div>
          </div>

          <h2 className="text-center text-3xl font-black text-white mb-8">
            RAHI Admin
          </h2>

          <input
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
            placeholder="Admin Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />

          {error && (
            <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            Login <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="flex-1 lg:ml-72">
        <header className="sticky top-0 bg-white/80 backdrop-blur border-b px-8 py-4 flex justify-between">
          <div>
            <h2 className="text-2xl font-black capitalize">
              {activeTab.replace("-", " ")}
            </h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest">
              Real-time platform data
            </p>
          </div>
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
            <Settings size={18} />
          </div>
        </header>

        <div className="p-8">
          {activeTab === "overview" && (
            <OverviewTab stats={stats} loading={loading} setActiveTab={setActiveTab} />
          )}
          {activeTab === "finance" && <FinanceTab />}
          {activeTab === "system" && <SystemTab />}
          {activeTab === "bugs" && <BugsTab />}

          {(activeTab === "audit" || activeTab === "settings") && (
            <div className="py-20 bg-white rounded-2xl border border-dashed text-center">
              <ShieldCheck className="mx-auto text-slate-400 mb-4" />
              <h3 className="font-black">Module Initializing</h3>
              <p className="text-slate-500 text-sm">
                Security systems syncing…
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
