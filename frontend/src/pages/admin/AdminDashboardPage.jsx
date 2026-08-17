import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <PageShell
      title="Admin Dashboard"
      subtitle="Overview of users, stores, and ratings"
      user={user}
      logout={logout}
      links={[
        { to: "/admin/users", label: "Manage Users" },
        { to: "/admin/stores", label: "Manage Stores" },
      ]}
    />
  );
}

export function PageShell({ title, subtitle, user, logout, links = [] }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-600">{subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.email}</span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {links.length > 0 && (
          <nav className="mb-6 flex flex-wrap gap-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm ring-1 ring-slate-200 hover:bg-indigo-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Feature content will be implemented in the next step.
        </div>
      </main>
    </div>
  );
}
