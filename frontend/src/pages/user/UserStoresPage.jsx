import { useAuth } from "../../context/AuthContext.jsx";
import { PageShell } from "../admin/AdminDashboardPage.jsx";

export default function UserStoresPage() {
  const { user, logout } = useAuth();

  return (
    <PageShell
      title="Browse Stores"
      subtitle="Search stores and submit your ratings"
      user={user}
      logout={logout}
    />
  );
}
