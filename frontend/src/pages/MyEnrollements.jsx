import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthProvider";

function MyEnrollements() {
  const { studentToken, studentLogout } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!studentToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/enrollments/my", {
          headers: {
            Authorization: `Bearer ${studentToken}`,
          },
        });

        // Supports either an array response or { enrollments: [...] }
        const data = response.data;
        const enrollmentList = Array.isArray(data)
          ? data
          : data.enrollments || [];

        setEnrollments(enrollmentList);
      } catch (err) {
        if (err.response?.status === 401) {
          studentLogout();
          navigate("/login");
        } else {
          setError(
            err.response?.data?.message ||
              "Unable to load your enrolled courses. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [studentToken, navigate, studentLogout]);

  const getCourse = (enrollment) =>
    enrollment.courseId ||
    enrollment.course ||
    enrollment.courseDetails ||
    {};

  const getImage = (course) =>
    course.thumbnail || course.image || "";

  const handleLogout = () => {
    studentLogout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              L
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              LearnSpace
            </span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-6">
            <Link
              to="/courses"
              className="hidden text-sm font-medium text-slate-600 transition hover:text-blue-600 sm:inline"
            >
              Browse Courses
            </Link>
            <Link
              to="/my-enrollments"
              className="text-sm font-semibold text-blue-600"
            >
              My Learning
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Page heading */}
        <div className="mb-9">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Student Dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            My Enrolled Courses
          </h1>
          <p className="mt-3 max-w-2xl text-slate-500">
            Pick up where you left off and keep moving toward your learning
            goals.
          </p>
        </div>

        {!loading && !error && enrollments.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              You are enrolled in{" "}
              <span className="font-bold text-slate-900">
                {enrollments.length}
              </span>{" "}
              {enrollments.length === 1 ? "course" : "courses"}
            </p>
            <Link
              to="/courses"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Explore more courses →
            </Link>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-44 bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="h-6 w-3/4 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-10 rounded-lg bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No enrolled courses */}
        {!loading && !error && enrollments.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.7}
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75v10.5m-5.25-5.25h10.5M3.75 5.25h16.5v13.5H3.75z"
                />
              </svg>
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No courses yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't enrolled in any courses. Explore our available
              courses and start learning today.
            </p>
            <Link
              to="/courses"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Browse Courses
            </Link>
          </div>
        )}

        {/* Enrolled course cards */}
        {!loading && !error && enrollments.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => {
              const course = getCourse(enrollment);
              const image = getImage(course);
              const completed =
                enrollment.status === "completed" ||
                enrollment.status === "complete";

              return (
                <article
                  key={enrollment._id || enrollment.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Course thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                    {image ? (
                      <img
                        src={image}
                        alt={course.title || "Course"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-5xl font-bold text-blue-300">
                          L
                        </span>
                      </div>
                    )}

                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                        completed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-white/95 text-blue-700"
                      }`}
                    >
                      {completed ? "Completed" : "Enrolled"}
                    </span>
                  </div>

                  {/* Course information */}
                  <div className="p-5">
                    {course.category && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                        {course.category}
                      </p>
                    )}

                    <h2 className="mt-2 line-clamp-2 text-xl font-bold text-slate-900">
                      {course.title || "Untitled Course"}
                    </h2>

                    <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-500">
                      {course.description ||
                        "Continue learning and build your skills with this course."}
                    </p>

                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
                      {course.instructor && (
                        <p>
                          <span className="font-medium text-slate-700">
                            Instructor:
                          </span>{" "}
                          {course.instructor}
                        </p>
                      )}

                      {course.duration && (
                        <p>
                          <span className="font-medium text-slate-700">
                            Duration:
                          </span>{" "}
                          {course.duration}
                        </p>
                      )}

                      {enrollment.enrolledAt && (
                        <p>
                          <span className="font-medium text-slate-700">
                            Enrolled on:
                          </span>{" "}
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="mt-5">
                      <Link
                        to="/my-certificates"
                        className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        View My Certificates
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 text-center text-sm text-slate-500 sm:px-8">
          © {new Date().getFullYear()} LearnSpace. Keep learning, keep growing.
        </div>
      </footer>
    </div>
  );
}

export default MyEnrollements;
