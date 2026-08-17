import { useAuth } from "../../context/AuthContext.jsx";
import { PageShell } from "../admin/AdminDashboardPage.jsx";

export default function OwnerDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <PageShell
      title="Owner Dashboard"
      subtitle="View your store performance and customer ratings"
      user={user}
      logout={logout}
    />
  );
}
