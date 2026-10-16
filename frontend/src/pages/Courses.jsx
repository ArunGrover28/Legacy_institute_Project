
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthProvider";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { studentToken, studentLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        const data = response.data;

        setCourses(
          Array.isArray(data) ? data : data.courses || []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load courses. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        courses
          .map((course) => course.category)
          .filter(Boolean)
      ),
    ];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        selectedCategory === "All" ||
        course.category === selectedCategory;

      const searchText = search.toLowerCase();

      const matchesSearch = [
        course.title,
        course.description,
        course.instructor,
        course.category,
      ].some((value) =>
        String(value || "").toLowerCase().includes(searchText)
      );

      return matchesCategory && matchesSearch;
    });
  }, [courses, search, selectedCategory]);

  const handleEnroll = async (courseId) => {
    if (!studentToken) {
      navigate("/login");
      return;
    }

    try {
      await api.post(
        "/enrollments",
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${studentToken}`,
          },
        }
      );

      alert("You have successfully enrolled in this course!");
    } catch (err) {
      if (err.response?.status === 401) {
        studentLogout();
        navigate("/login");
        return;
      }

      alert(
        err.response?.data?.message ||
          "Unable to enroll. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
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

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:inline-flex"
            >
              Home
            </Link>

            {studentToken ? (
              <>
                <Link
                  to="/my-enrollments"
                  className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:inline-flex"
                >
                  My Courses
                </Link>

                <Link
                  to="/my-certificates"
                  className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:inline-flex"
                >
                  Certificates
                </Link>

                <button
                  onClick={() => {
                    studentLogout();
                    navigate("/");
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Log in
                </Link>

                <Link
                  to="/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        {/* Page introduction */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                Learn something new
              </span>

              <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Explore our courses
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Discover courses offered by your institute and find
                the right opportunity to develop your skills and
                achieve your learning goals.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Available courses
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loading ? "—" : courses.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Course categories
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loading ? "—" : categories.length - 1}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Ready to learn?
                </p>
                <p className="mt-2 text-lg font-bold text-blue-700">
                  Start today
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Course catalog */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Course catalog
              </h2>
              <p className="mt-2 text-slate-500">
                Find a course that matches your interests.
              </p>
            </div>

            <div className="w-full md:max-w-sm">
              <label htmlFor="course-search" className="sr-only">
                Search courses
              </label>

              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>

                <input
                  id="course-search"
                  type="search"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </div>

          {/* Category filters */}
          <div className="mt-7 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {error && (
            <div
              role="alert"
              className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700"
            >
              {error}
            </div>
          )}

          {/* Loading placeholders */}
          {loading && (
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="h-48 bg-slate-200" />
                  <div className="space-y-4 p-6">
                    <div className="h-4 w-1/3 rounded bg-slate-200" />
                    <div className="h-6 w-3/4 rounded bg-slate-200" />
                    <div className="h-4 rounded bg-slate-100" />
                    <div className="h-4 w-2/3 rounded bg-slate-100" />
                    <div className="h-11 rounded-xl bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Course cards */}
          {!loading && !error && filteredCourses.length > 0 && (
            <>
              <p className="mt-8 text-sm text-slate-500">
                Showing {filteredCourses.length}{" "}
                {filteredCourses.length === 1 ? "course" : "courses"}
              </p>

              <div className="mt-5 grid items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <article
                    key={course._id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/70"
                  >
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-52 items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-slate-100">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                          📘
                        </div>
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {course.category || "Course"}
                        </span>

                        <span className="text-sm font-bold text-slate-800">
                          {Number(course.fee) === 0
                            ? "Free"
                            : `₹${course.fee}`}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold leading-7 tracking-tight text-slate-900 transition group-hover:text-blue-700">
                        {course.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {course.description}
                      </p>

                      <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-slate-500">
                            Instructor
                          </span>
                          <span className="text-right font-medium text-slate-800">
                            {course.instructor || "Not specified"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-500">
                            Duration
                          </span>
                          <span className="font-medium text-slate-800">
                            {course.duration || "Flexible"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                      >
                        {studentToken
                          ? "Enroll Now"
                          : "Log in to Enroll"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {!loading && !error && filteredCourses.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                🔎
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No courses found
              </h3>

              <p className="mt-2 text-slate-500">
                Try another search term or select a different category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Bottom call to action */}
        {!studentToken && (
          <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white sm:p-10 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Ready to begin learning?
                </h2>
                <p className="mt-3 max-w-xl leading-7 text-blue-100">
                  Create your student account to enroll in available
                  courses and keep your learning journey organized.
                </p>
              </div>

              <Link
                to="/signup"
                className="shrink-0 rounded-xl bg-white px-6 py-3.5 font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Create Account
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link to="/" className="font-bold text-slate-800">
            LearnSpace
          </Link>

          <p>Learn, grow, and move forward — one course at a time.</p>

          <div className="flex gap-5">
            <Link to="/login" className="hover:text-blue-600">
              Student Login
            </Link>
            <Link to="/signup" className="hover:text-blue-600">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Courses;
