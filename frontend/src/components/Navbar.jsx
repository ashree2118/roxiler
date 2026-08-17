import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import ChangePasswordModal from "./ChangePasswordModal.jsx";

const roleStyles = {
  ADMIN: "bg-purple-100 text-purple-700 ring-purple-200",
  USER: "bg-blue-100 text-blue-700 ring-blue-200",
  STORE_OWNER: "bg-amber-100 text-amber-700 ring-amber-200",
};

const roleLabels = {
  ADMIN: "Admin",
  USER: "User",
  STORE_OWNER: "Store Owner",
};

export default function Navbar({ title, subtitle }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            )}
            {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
              <span
                className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                  roleStyles[user?.role] || "bg-slate-100 text-slate-700 ring-slate-200"
                }`}
              >
                {roleLabels[user?.role] || user?.role}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <KeyRound className="h-4 w-4" />
              Change Password
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
