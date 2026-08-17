import { useAuth } from "../../context/AuthContext.jsx";
import { PageShell } from "./AdminDashboardPage.jsx";

export default function AdminUsersPage() {
  const { user, logout } = useAuth();

  return (
    <PageShell
      title="Admin Users"
      subtitle="Manage platform users and roles"
      user={user}
      logout={logout}
      links={[
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/stores", label: "Manage Stores" },
      ]}
    />
  );
}
