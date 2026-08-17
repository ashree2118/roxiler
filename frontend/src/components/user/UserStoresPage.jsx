import { useCallback, useEffect, useState } from "react";
import { MapPin, Search, Store } from "lucide-react";
import api from "../../api/axios.js";
import StarRating, { RatingDisplay } from "../StarRating.jsx";

export default function UserStoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [sort, setSort] = useState({ sortBy: "name", sortOrder: "asc" });
  const [ratingStoreId, setRatingStoreId] = useState(null);
  const [error, setError] = useState("");

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = { ...filters, ...sort };
      Object.keys(params).forEach((key) => {
        if (!params[key]) {
          delete params[key];
        }
      });

      const { data } = await api.get("/stores", { params });
      setStores(data.stores);
    } catch (fetchError) {
      setError(
        fetchError.response?.data?.message || "Failed to load stores."
      );
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRate = async (storeId, rating) => {
    setRatingStoreId(storeId);

    try {
      await api.post(`/stores/${storeId}/rate`, { rating });
      await fetchStores();
    } catch (rateError) {
      setError(rateError.response?.data?.message || "Failed to save rating.");
    } finally {
      setRatingStoreId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by store name"
                value={filters.name}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm outline-none ring-indigo-500 focus:ring-2"
              />
            </div>

            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by address"
                value={filters.address}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm outline-none ring-indigo-500 focus:ring-2"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={sort.sortBy}
              onChange={(event) =>
                setSort((current) => ({
                  ...current,
                  sortBy: event.target.value,
                }))
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            >
              <option value="name">Sort by Name</option>
              <option value="address">Sort by Address</option>
              <option value="averageRating">Sort by Rating</option>
              <option value="createdAt">Sort by Created</option>
            </select>

            <select
              value={sort.sortOrder}
              onChange={(event) =>
                setSort((current) => ({
                  ...current,
                  sortOrder: event.target.value,
                }))
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </section>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center text-sm text-slate-500">
          Loading stores...
        </div>
      ) : stores.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center text-sm text-slate-500">
          No stores match your search.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {stores.map((store) => (
            <article
              key={store.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 inline-flex rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <Store className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {store.name}
                  </h3>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                  {store.ratingsCount} ratings
                </span>
              </div>

              <p className="mb-4 text-sm leading-6 text-slate-600">
                {store.address}
              </p>

              <div className="mb-5 space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Overall Rating
                </p>
                <RatingDisplay value={store.averageRating} />
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Your Rating
                </p>
                <StarRating
                  value={store.userRating || 0}
                  disabled={ratingStoreId === store.id}
                  onChange={(rating) => handleRate(store.id, rating)}
                />
                <p className="mt-2 text-xs text-slate-500">
                  {store.userRating
                    ? "Tap a star to update your rating."
                    : "Tap a star to submit your rating."}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
