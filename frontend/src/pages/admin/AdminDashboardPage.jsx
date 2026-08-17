import Layout from "../../components/Layout.jsx";
import AdminDashboard from "../../components/admin/AdminDashboard.jsx";

export default function AdminDashboardPage() {
  return (
    <Layout
      title="Admin Dashboard"
      subtitle="Overview of users, stores, and ratings"
    >
      <AdminDashboard />
    </Layout>
  );
}
