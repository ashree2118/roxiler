import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validation.js";

const initialForm = {
  name: "",
  email: "",
  password: "",
  address: "",
};

export default function RegisterPage() {
  const { register, isAuthenticated, user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated && user) {
    return <Navigate to="/user/stores" replace />;
  }

  const validators = {
    name: validateName,
    email: validateEmail,
    password: validatePassword,
    address: validateAddress,
  };

  const validateField = (name, value) => validators[name]?.(value) ?? "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));

    if (touched[name]) {
      setErrors((current) => ({
        ...current,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => ({
      ...current,
      [name]: validateField(name, value),
    }));
  };

  const validateForm = () => {
    const nextErrors = Object.keys(validators).reduce((accumulator, key) => {
      accumulator[key] = validateField(key, form[key]);
      return accumulator;
    }, {});

    setErrors(nextErrors);
    setTouched(
      Object.keys(validators).reduce((accumulator, key) => {
        accumulator[key] = true;
        return accumulator;
      }, {})
    );

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
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        address: form.address.trim(),
      });

      setSuccessMessage("Registration successful. You can now sign in.");
      setForm(initialForm);
      setTouched({});
      setErrors({});
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Register as a normal user to browse and rate stores
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <Field
            label="Full name"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : ""}
            placeholder="At least 20 characters"
          />

          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : ""}
            placeholder="you@example.com"
          />

          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : ""}
            placeholder="8-16 chars, 1 uppercase, 1 special"
          />

          <div>
            <label
              htmlFor="address"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
              placeholder="Your address (max 400 characters)"
            />
            {touched.address && errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
}) {
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
        onBlur={onBlur}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
