import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminStoresPage from "./pages/admin/AdminStoresPage.jsx";
import UserStoresPage from "./pages/user/UserStoresPage.jsx";
import OwnerDashboardPage from "./pages/owner/OwnerDashboardPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { getRoleHome } from "./utils/validation.js";

function RootRedirect() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated && user) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminStoresPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/stores"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserStoresPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
            <OwnerDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
