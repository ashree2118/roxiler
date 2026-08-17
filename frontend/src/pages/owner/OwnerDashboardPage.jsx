import Layout from "../../components/Layout.jsx";
import OwnerDashboard from "../../components/owner/OwnerDashboard.jsx";

export default function OwnerDashboardPage() {
  return (
    <Layout
      title="Owner Dashboard"
      subtitle="View your store performance and customer ratings"
    >
      <OwnerDashboard />
    </Layout>
  );
}
