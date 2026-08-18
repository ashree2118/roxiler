import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Store, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import {
  getRoleHome,
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
  validateStoreAddress,
  validateStoreEmail,
  validateStoreName,
} from "../utils/validation.js";

const initialForm = {
  name: "",
  email: "",
  password: "",
  address: "",
  storeName: "",
  storeEmail: "",
  storeAddress: "",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [accountType, setAccountType] = useState("USER");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated && user) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  const isStoreOwner = accountType === "STORE_OWNER";

  const userValidators = {
    name: validateName,
    email: validateEmail,
    password: validatePassword,
    address: validateAddress,
  };

  const storeValidators = {
    storeName: validateStoreName,
    storeEmail: validateStoreEmail,
    storeAddress: validateStoreAddress,
  };

  const getValidators = () =>
    isStoreOwner
      ? { ...userValidators, ...storeValidators }
      : userValidators;

  const validateField = (name, value) => {
    const validators = getValidators();
    return validators[name]?.(value) ?? "";
  };

  const handleAccountTypeChange = (nextType) => {
    setAccountType(nextType);
    setSubmitError("");

    if (nextType === "USER") {
      setErrors((current) => {
        const next = { ...current };
        delete next.storeName;
        delete next.storeEmail;
        delete next.storeAddress;
        return next;
      });
    }
  };

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
    const validators = getValidators();
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        address: form.address.trim(),
        ...(isStoreOwner && {
          role: "STORE_OWNER",
          storeName: form.storeName.trim(),
          storeEmail: form.storeEmail.trim(),
          storeAddress: form.storeAddress.trim(),
        }),
      };

      const data = await register(payload);

      if (data.user.role === "STORE_OWNER") {
        showToast("Your store has been submitted and approved! Welcome.");
        navigate("/owner/dashboard", { replace: true });
      } else {
        showToast("Registration successful! Welcome.");
        navigate("/user/stores", { replace: true });
      }
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
            Choose your account type and complete the form below
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => handleAccountTypeChange("USER")}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              accountType === "USER"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserRound className="h-4 w-4" />
            Normal User
          </button>
          <button
            type="button"
            onClick={() => handleAccountTypeChange("STORE_OWNER")}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              accountType === "STORE_OWNER"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Store className="h-4 w-4" />
            Store Owner
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <Field
            label={isStoreOwner ? "Owner full name" : "Full name"}
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : ""}
            placeholder="At least 20 characters"
          />

          <Field
            label={isStoreOwner ? "Owner email" : "Email"}
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
              {isStoreOwner ? "Personal address" : "Address"}
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 ${
                touched.address && errors.address
                  ? "border-red-300"
                  : "border-slate-300"
              }`}
              placeholder="Your address (max 400 characters)"
            />
            {touched.address && errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          {isStoreOwner && (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
              <h2 className="mb-4 text-sm font-semibold text-indigo-900">
                Your Store Information
              </h2>

              <div className="space-y-4">
                <Field
                  label="Store name"
                  name="storeName"
                  value={form.storeName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.storeName ? errors.storeName : ""}
                  placeholder="At least 20 characters"
                />

                <Field
                  label="Store contact email"
                  name="storeEmail"
                  type="email"
                  value={form.storeEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.storeEmail ? errors.storeEmail : ""}
                  placeholder="store@example.com"
                />

                <div>
                  <label
                    htmlFor="storeAddress"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Store address
                  </label>
                  <textarea
                    id="storeAddress"
                    name="storeAddress"
                    rows={3}
                    value={form.storeAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 ${
                      touched.storeAddress && errors.storeAddress
                        ? "border-red-300"
                        : "border-slate-300"
                    }`}
                    placeholder="Store location (max 400 characters)"
                  />
                  {touched.storeAddress && errors.storeAddress && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.storeAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {submitError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
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
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 ${
          error ? "border-red-300" : "border-slate-300"
        }`}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
