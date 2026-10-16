
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthProvider";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { studentLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      const token = response.data.token;

      if (!token) {
        throw new Error("Login response did not contain a token.");
      }

      studentLogin(token);
      navigate("/courses");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              L
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                LearnSpace
              </h1>
              <p className="text-xs text-slate-500">
                Institute Learning Portal
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Back to Home
          </Link>
        </nav>
      </header>

      {/* Login Content */}
      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:px-8">
        {/* Left side */}
        <section className="hidden lg:block">
          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Welcome back
          </span>

          <h2 className="mt-6 max-w-lg text-5xl font-bold leading-tight tracking-tight text-slate-950">
            Your learning journey continues here.
          </h2>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Sign in to explore your enrolled courses, track your
            progress, and access certificates provided by your institute.
          </p>

          <div className="mt-10 space-y-5">
            {[
              "Access your enrolled courses",
              "Keep track of your learning",
              "Find your available certificates",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  ✓
                </span>
                <span className="font-medium text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-10">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                👋
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Student Login
              </h2>

              <p className="mt-3 leading-6 text-slate-500">
                Enter your details to access your learning portal.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>
                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="my-7 border-t border-slate-100" />

            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create an account
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            By signing in, you access your personal student account.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Login;
