
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardStatsApi } from "../../api/adminApi";
import { useAuth } from "../../context/AuthProvider";

const initialStats = {
  totalStudents: 0,
  totalCourses: 0,
  publishedCourses: 0,
  totalEnrollments: 0,
  completedEnrollments: 0,
  totalCertificates: 0,
};

const statCards = [
  {
    key: "totalStudents",
    title: "Total Students",
    icon: "👨‍🎓",
    color: "bg-blue-50 text-blue-700",
  },
  {
    key: "totalCourses",
    title: "Total Courses",
    icon: "📚",
    color: "bg-violet-50 text-violet-700",
  },
  {
    key: "publishedCourses",
    title: "Published Courses",
    icon: "🌐",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "totalEnrollments",
    title: "Total Enrollments",
    icon: "📝",
    color: "bg-amber-50 text-amber-700",
  },
  {
    key: "completedEnrollments",
    title: "Completed Enrollments",
    icon: "✅",
    color: "bg-green-50 text-green-700",
  },
  {
    key: "totalCertificates",
    title: "Certificates",
    icon: "🏆",
    color: "bg-pink-50 text-pink-700",
  },
];

export default function AdminDashboard() {
  const { adminToken, adminLogout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/login", { replace: true });
      return;
    }

    let cancelled = false;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardStatsApi(adminToken);

        if (!cancelled) {
          setStats({
            ...initialStats,
            ...(data.stats || {}),
          });
        }
      } catch (err) {
        if (cancelled) return;

        if ([401, 403].includes(err.response?.status)) {
          adminLogout();
          navigate("/admin/login", { replace: true });
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load dashboard statistics. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, [adminToken, adminLogout, navigate]);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login", { replace: true });
  };

  const publishedPercentage =
    stats.totalCourses > 0
      ? Math.min(
          100,
          (stats.publishedCourses / stats.totalCourses) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col bg-slate-900 text-white md:flex">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 border-b border-slate-700 px-6 py-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold">
              L
            </span>

            <div>
              <p className="text-lg font-bold">LearnSpace</p>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </Link>

          <nav className="flex-1 space-y-2 px-4 py-6">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 font-medium"
            >
              <span>▦</span>
              Dashboard
            </Link>

            <Link
              to="/admin/courses"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <span>📚</span>
              Courses
            </Link>

            <Link
              to="/admin/students"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <span>👨‍🎓</span>
              Students
            </Link>

            <Link
              to="/admin/enrollments"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <span>📝</span>
              Enrollments
            </Link>

            <Link
              to="/admin/certificates"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <span>🏆</span>
              Certificates
            </Link>
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="m-4 rounded-xl border border-slate-700 px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            ↪ Sign out
          </button>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
            <div>
              <p className="text-sm text-slate-500">
                LearnSpace / Admin
              </p>
              <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 sm:flex">
                A
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold">Administrator</p>
                <p className="text-xs text-slate-500">Admin account</p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold transition hover:bg-slate-100 md:hidden"
              >
                Sign out
              </button>
            </div>
          </header>

          <section className="p-5 sm:p-8">
            {/* Welcome */}
            <div className="mb-8">
              <h2 className="text-xl font-bold">
                Welcome back, Admin 👋
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Here's an overview of your learning platform.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <p>{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="font-semibold underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Statistics */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {statCards.map((card) => (
                <div
                  key={card.key}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${card.color}`}
                    >
                      {card.icon}
                    </span>
                  </div>

                  <p className="mt-5 text-3xl font-bold text-slate-900">
                    {loading
                      ? "..."
                      : Number(stats[card.key] ?? 0).toLocaleString()}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {loading ? "Loading statistics..." : "Current total"}
                  </p>
                </div>
              ))}
            </div>

            {/* Course overview and quick actions */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold">Course Overview</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Review your course publishing status.
                </p>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between gap-3 text-sm">
                    <span className="text-slate-600">
                      Published courses
                    </span>

                    <span className="font-semibold">
                      {loading
                        ? "..."
                        : `${stats.publishedCourses} / ${stats.totalCourses}`}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{
                        width: `${publishedPercentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {loading
                      ? "Calculating..."
                      : `${Math.round(publishedPercentage)}% of courses are published`}
                  </p>
                </div>

                <Link
                  to="/admin/courses"
                  className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Manage Courses →
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold">Quick Actions</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Navigate to common admin tasks.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Link
                    to="/admin/courses"
                    className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <span className="text-xl">📚</span>
                    <p className="mt-2 font-semibold">Manage Courses</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Create and publish courses
                    </p>
                  </Link>

                  <Link
                    to="/admin/students"
                    className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <span className="text-xl">👨‍🎓</span>
                    <p className="mt-2 font-semibold">View Students</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Browse registered students
                    </p>
                  </Link>

                  <Link
                    to="/admin/enrollments"
                    className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <span className="text-xl">📝</span>
                    <p className="mt-2 font-semibold">Enrollments</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Track student progress
                    </p>
                  </Link>

                  <Link
                    to="/admin/certificates"
                    className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <span className="text-xl">🏆</span>
                    <p className="mt-2 font-semibold">Certificates</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Manage course certificates
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
