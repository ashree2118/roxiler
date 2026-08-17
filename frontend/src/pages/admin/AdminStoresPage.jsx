import { useAuth } from "../../context/AuthContext.jsx";
import { PageShell } from "./AdminDashboardPage.jsx";

export default function AdminStoresPage() {
  const { user, logout } = useAuth();

  return (
    <PageShell
      title="Admin Stores"
      subtitle="Manage stores and owner assignments"
      user={user}
      logout={logout}
      links={[
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/users", label: "Manage Users" },
      ]}
    />
  );
}
