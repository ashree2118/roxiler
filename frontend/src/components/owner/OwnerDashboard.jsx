import { useEffect, useState } from "react";
import { Building2, Mail, MapPin, Star } from "lucide-react";
import api from "../../api/axios.js";
import { RatingDisplay } from "../../components/StarRating.jsx";

export default function OwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get("/owner/dashboard");
        setDashboard(data);
      } catch (fetchError) {
        setError(
          fetchError.response?.data?.message ||
            "Failed to load owner dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center text-sm text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-700">
        {error}
      </div>
    );
  }

  const { store, ratings } = dashboard;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {store.name}
              </h2>
              <p className="text-sm text-slate-600">Store details</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-700">
            <DetailRow icon={Mail} label="Email" value={store.email} />
            <DetailRow icon={MapPin} label="Address" value={store.address} />
            <DetailRow
              icon={Star}
              label="Total ratings"
              value={store.ratingsCount}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-2 text-sm font-medium text-slate-600">
            Average Rating
          </p>
          <div className="mb-4 text-4xl font-semibold text-slate-900">
            {store.averageRating != null
              ? store.averageRating.toFixed(1)
              : "N/A"}
          </div>
          <RatingDisplay value={store.averageRating} />
          <p className="mt-4 text-sm text-slate-500">
            Based on {store.ratingsCount} customer rating
            {store.ratingsCount === 1 ? "" : "s"}.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Customer Ratings
          </h2>
          <p className="text-sm text-slate-600">
            Users who submitted ratings for your store
          </p>
        </div>

        {ratings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
            No ratings submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">
                    User
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">
                    Rated On
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {ratings.map((item) => (
                  <tr key={`${item.user.id}-${item.ratedAt}`} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {item.user.name}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {item.user.email}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {item.user.address}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                        {item.rating} / 5
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {new Date(item.ratedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-slate-400" />
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-1">{value}</p>
      </div>
    </div>
  );
}
