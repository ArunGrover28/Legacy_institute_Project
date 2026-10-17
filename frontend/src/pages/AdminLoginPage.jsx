
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLoginApi } from "../api/adminApi";
import { useAuth } from "../context/AuthProvider";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { adminToken, adminLogin } = useAuth();
  const navigate = useNavigate();

  // If the admin is already logged in, open the dashboard.
  if (adminToken) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const data = await adminLoginApi(username.trim(), password);

      if (!data.token) {
        throw new Error("Login succeeded, but no token was returned.");
      }

      adminLogin(data.token);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Admin login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            L
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">LearnSpace</h1>
            <p className="text-sm text-slate-500">Administrator portal</p>
          </div>
        </Link>

        <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to manage courses, students, and certificates.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="admin-username"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in as Admin"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Return to{" "}
          <Link to="/" className="font-semibold text-blue-600 hover:underline">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
