import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Star,
  Store,
  Users,
  X,
} from "lucide-react";
import api from "../../api/axios.js";
import {
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
} from "../../utils/validation.js";

const roleOptions = ["ADMIN", "USER", "STORE_OWNER"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingStores, setLoadingStores] = useState(true);
  const [userFilters, setUserFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [storeFilters, setStoreFilters] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [userSort, setUserSort] = useState({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [storeSort, setStoreSort] = useState({
    sortBy: "averageRating",
    sortOrder: "desc",
  });
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const { data } = await api.get("/admin/dashboard");
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const params = {
        ...userFilters,
        ...userSort,
      };

      Object.keys(params).forEach((key) => {
        if (!params[key]) {
          delete params[key];
        }
      });

      const { data } = await api.get("/admin/users", { params });
      setUsers(data.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUsers(false);
    }
  }, [userFilters, userSort]);

  const fetchStores = useCallback(async () => {
    setLoadingStores(true);
    try {
      const params = {
        ...storeFilters,
        ...storeSort,
      };

      Object.keys(params).forEach((key) => {
        if (!params[key]) {
          delete params[key];
        }
      });

      const { data } = await api.get("/admin/stores", { params });
      setStores(data.stores);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStores(false);
    }
  }, [storeFilters, storeSort]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleUserCreated = () => {
    setShowAddUser(false);
    fetchStats();
    fetchUsers();
  };

  const handleStoreCreated = () => {
    setShowAddStore(false);
    fetchStats();
    fetchStores();
    fetchUsers();
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats?.usersCount}
          loading={loadingStats}
          icon={Users}
          accent="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Total Stores"
          value={stats?.storesCount}
          loading={loadingStats}
          icon={Store}
          accent="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Total Ratings"
          value={stats?.ratingsCount}
          loading={loadingStats}
          icon={Star}
          accent="bg-amber-50 text-amber-700"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Users</h2>
            <p className="text-sm text-slate-600">
              Filter, sort, and manage platform users
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddUser(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add New User
          </button>
        </div>

        <FilterBar
          filters={userFilters}
          onChange={setUserFilters}
          fields={[
            { key: "name", label: "Name", placeholder: "Search name" },
            { key: "email", label: "Email", placeholder: "Search email" },
            { key: "address", label: "Address", placeholder: "Search address" },
          ]}
          selectField={{
            key: "role",
            label: "Role",
            options: [{ value: "", label: "All roles" }, ...roleOptions.map((role) => ({ value: role, label: role }))],
          }}
          sort={userSort}
          onSortChange={setUserSort}
          sortOptions={[
            { value: "name", label: "Name" },
            { value: "email", label: "Email" },
            { value: "address", label: "Address" },
            { value: "role", label: "Role" },
            { value: "createdAt", label: "Created" },
          ]}
        />

        <DataTable
          loading={loadingUsers}
          columns={[
            "Name",
            "Email",
            "Address",
            "Role",
            "Store Rating",
            "Created",
          ]}
          rows={users.map((user) => [
            user.name,
            user.email,
            user.address,
            user.role,
            user.role === "STORE_OWNER"
              ? user.storeRating != null
                ? user.storeRating.toFixed(1)
                : "No store"
              : "-",
            new Date(user.createdAt).toLocaleDateString(),
          ])}
          emptyMessage="No users found."
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Stores</h2>
            <p className="text-sm text-slate-600">
              View store performance and owner assignments
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddStore(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add New Store
          </button>
        </div>

        <FilterBar
          filters={storeFilters}
          onChange={setStoreFilters}
          fields={[
            { key: "name", label: "Name", placeholder: "Search name" },
            { key: "email", label: "Email", placeholder: "Search email" },
            { key: "address", label: "Address", placeholder: "Search address" },
          ]}
          sort={storeSort}
          onSortChange={setStoreSort}
          sortOptions={[
            { value: "name", label: "Name" },
            { value: "email", label: "Email" },
            { value: "address", label: "Address" },
            { value: "averageRating", label: "Average Rating" },
            { value: "createdAt", label: "Created" },
          ]}
        />

        <DataTable
          loading={loadingStores}
          columns={[
            "Name",
            "Email",
            "Address",
            "Owner",
            "Avg Rating",
            "Ratings",
          ]}
          rows={stores.map((store) => [
            store.name,
            store.email,
            store.address,
            store.owner?.name || "Unassigned",
            store.averageRating != null ? store.averageRating.toFixed(1) : "N/A",
            store.ratingsCount,
          ])}
          emptyMessage="No stores found."
        />
      </section>

      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onSuccess={handleUserCreated}
        />
      )}

      {showAddStore && (
        <AddStoreModal
          users={users}
          onClose={() => setShowAddStore(false)}
          onSuccess={handleStoreCreated}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, loading, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {loading ? "..." : (value ?? 0)}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${accent}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function FilterBar({
  filters,
  onChange,
  fields,
  selectField,
  sort,
  onSortChange,
  sortOptions,
}) {
  return (
    <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto]">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {fields.map((field) => (
          <input
            key={field.key}
            type="text"
            value={filters[field.key]}
            placeholder={field.placeholder}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                [field.key]: event.target.value,
              }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
          />
        ))}

        {selectField && (
          <select
            value={filters[selectField.key]}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                [selectField.key]: event.target.value,
              }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
          >
            {selectField.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex gap-2">
        <select
          value={sort.sortBy}
          onChange={(event) =>
            onSortChange((current) => ({
              ...current,
              sortBy: event.target.value,
            }))
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              Sort by {option.label}
            </option>
          ))}
        </select>

        <select
          value={sort.sortOrder}
          onChange={(event) =>
            onSortChange((current) => ({
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
  );
}

function DataTable({ columns, rows, loading, emptyMessage }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 text-left font-medium text-slate-600"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-slate-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      address: validateAddress(form.address),
    };

    setErrors(nextErrors);
    return Object.values(nextErrors).every((error) => !error);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/admin/users", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        address: form.address.trim(),
        role: form.role,
      });
      onSuccess();
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Failed to create user."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell title="Add New User" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <ModalField
          label="Full name"
          value={form.name}
          error={errors.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
        />
        <ModalField
          label="Email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
        />
        <ModalField
          label="Password"
          type="password"
          value={form.password}
          error={errors.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Address
          </label>
          <textarea
            rows={3}
            value={form.address}
            onChange={(event) =>
              setForm((current) => ({ ...current, address: event.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Role
          </label>
          <select
            value={form.role}
            onChange={(event) =>
              setForm((current) => ({ ...current, role: event.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </p>
        )}

        <ModalActions
          onClose={onClose}
          submitLabel={isSubmitting ? "Creating..." : "Create User"}
          disabled={isSubmitting}
        />
      </form>
    </ModalShell>
  );
}

function AddStoreModal({ users, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableOwners = users.filter(
    (user) => user.role === "STORE_OWNER" && !user.ownedStore
  );

  const validateForm = () => {
    const nextErrors = {
      name: form.name.trim() ? "" : "Store name is required",
      email: validateEmail(form.email),
      address: validateAddress(form.address),
    };

    setErrors(nextErrors);
    return Object.values(nextErrors).every((error) => !error);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/admin/stores", {
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        ...(form.ownerId && { ownerId: form.ownerId }),
      });
      onSuccess();
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Failed to create store."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell title="Add New Store" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <ModalField
          label="Store name"
          value={form.name}
          error={errors.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
        />
        <ModalField
          label="Store email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Address
          </label>
          <textarea
            rows={3}
            value={form.address}
            onChange={(event) =>
              setForm((current) => ({ ...current, address: event.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Owner (optional)
          </label>
          <select
            value={form.ownerId}
            onChange={(event) =>
              setForm((current) => ({ ...current, ownerId: event.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
          >
            <option value="">No owner assigned</option>
            {availableOwners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
        </div>

        {submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </p>
        )}

        <ModalActions
          onClose={onClose}
          submitLabel={isSubmitting ? "Creating..." : "Create Store"}
          disabled={isSubmitting}
        />
      </form>
    </ModalShell>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalField({ label, value, error, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function ModalActions({ onClose, submitLabel, disabled }) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </div>
  );
}
