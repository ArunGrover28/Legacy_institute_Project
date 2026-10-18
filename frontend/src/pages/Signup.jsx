
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
  setSuccess("");

  const email = formData.email.trim();

  const emailPattern =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;

  if (!emailPattern.test(email)) {
    setError("Please enter a valid email address, such as arun@gmail.com.");
    return;
  }

  setLoading(true);

  try {
    const response = await api.post("/auth/signup", {
      ...formData,
      email,
    });

    setSuccess(
      response.data.message || "Account created successfully!"
    );

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Unable to create your account. Please try again."
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

      {/* Signup Content */}
      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:px-8">
        {/* Left side */}
        <section className="hidden lg:block">
          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Start learning today
          </span>

          <h2 className="mt-6 max-w-lg text-5xl font-bold leading-tight tracking-tight text-slate-950">
            Take the first step toward your goals.
          </h2>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Create your student account to discover institute courses,
            manage enrollments, and access your course certificates.
          </p>

          <div className="mt-10 grid max-w-lg grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-2xl">📚</div>
              <h3 className="mt-3 font-bold">Discover</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Explore courses that match your interests.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-2xl">🎯</div>
              <h3 className="mt-3 font-bold">Achieve</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Organize your learning journey in one place.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-10">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                ✨
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Create an Account
              </h2>

              <p className="mt-3 leading-6 text-slate-500">
                Fill in your details to join the learning portal.
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

            {success && (
              <div
                role="status"
                className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              >
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

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
                pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+"
                title="Enter a valid email address, such as arun@gmail.com"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Use at least 6 characters.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="my-7 border-t border-slate-100" />

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Your learning journey starts with one simple step.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Signup;
