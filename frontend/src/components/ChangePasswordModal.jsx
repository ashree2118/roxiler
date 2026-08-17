import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { validateLoginPassword, validatePassword } from "../utils/validation.js";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm({ currentPassword: "", newPassword: "" });
      setErrors({});
      setSubmitError("");
      setSuccessMessage("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const validateForm = () => {
    const nextErrors = {
      currentPassword: validateLoginPassword(form.currentPassword),
      newPassword: validatePassword(form.newPassword),
    };

    setErrors(nextErrors);
    return Object.values(nextErrors).every((error) => !error);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccessMessage("Password changed successfully.");
      setForm({ currentPassword: "", newPassword: "" });
      setTimeout(() => onClose(), 1200);
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Failed to change password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Field
            label="Current password"
            name="currentPassword"
            type="password"
            value={form.currentPassword}
            error={errors.currentPassword}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                currentPassword: event.target.value,
              }))
            }
          />

          <Field
            label="New password"
            name="newPassword"
            type="password"
            value={form.newPassword}
            error={errors.newPassword}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                newPassword: event.target.value,
              }))
            }
          />

          <p className="text-xs text-slate-500">
            8-16 characters, at least one uppercase letter and one special
            character (!@#$%^&*).
          </p>

          {submitError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
            </p>
          )}

          {successMessage && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              {successMessage}
            </p>
          )}

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
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", value, error, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
