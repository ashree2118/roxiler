import Layout from "../../components/Layout.jsx";
import UserStoresContent from "../../components/user/UserStoresPage.jsx";

export default function UserStoresPage() {
  return (
    <Layout
      title="Browse Stores"
      subtitle="Search stores and submit your ratings"
    >
      <UserStoresContent />
    </Layout>
  );
}
