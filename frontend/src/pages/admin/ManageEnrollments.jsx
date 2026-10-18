
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthProvider";

export default function ManageEnrollments() {
  const { adminToken, adminLogout } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState("");

  const fetchEnrollments = useCallback(async () => {
    if (!adminToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/enrollments", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const data = response.data;
      setEnrollments(
        Array.isArray(data) ? data : data.enrollments || []
      );
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) {
        adminLogout();
        navigate("/admin/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message || "Failed to load enrollments."
      );
    } finally {
      setLoading(false);
    }
  }, [adminToken, adminLogout, navigate]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const getStudentName = (student) => {
    if (!student) return "Unknown student";
    if (typeof student === "string") return "Student ID: " + student;

    if (student.name) return student.name;

    const fullName = [student.firstName, student.lastName]
      .filter(Boolean)
      .join(" ");

    return fullName || student.email || "Unknown student";
  };

  const getCourseName = (course) => {
    if (!course) return "Unknown course";
    if (typeof course === "string") return "Course ID: " + course;

    return course.title || "Unknown course";
  };

  const getStatus = (enrollment) => {
    return String(enrollment.status || "enrolled").toLowerCase();
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const markCompleted = async (enrollment) => {
    const enrollmentId = enrollment._id || enrollment.id;

    if (!enrollmentId) {
      setError("This enrollment does not have a valid ID.");
      return;
    }

    const confirmed = window.confirm(
      `Mark "${getCourseName(enrollment.course)}" as completed for ${getStudentName(enrollment.student)}?`
    );

    if (!confirmed) return;

    try {
      setActionId(enrollmentId);
      setError("");
      setMessage("");

      const response = await api.patch(
        `/admin/enrollments/${enrollmentId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setMessage(
        response.data?.message || "Enrollment marked as completed."
      );

      await fetchEnrollments();
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) {
        adminLogout();
        navigate("/admin/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message || "Failed to complete enrollment."
      );
    } finally {
      setActionId("");
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const studentName = getStudentName(enrollment.student).toLowerCase();
    const studentEmail = (
      typeof enrollment.student === "object"
        ? enrollment.student?.email || ""
        : ""
    ).toLowerCase();

    const courseName = getCourseName(enrollment.course).toLowerCase();
    const status = getStatus(enrollment);
    const query = search.trim().toLowerCase();

    return (
      studentName.includes(query) ||
      studentEmail.includes(query) ||
      courseName.includes(query) ||
      status.includes(query)
    );
  });

  const completedCount = enrollments.filter(
    (item) => getStatus(item) === "completed"
  ).length;

  const pendingCount = enrollments.length - completedCount;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              to="/admin/dashboard"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              Manage Enrollments
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View student enrollments and track course completion.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setMessage("");
              fetchEnrollments();
            }}
            disabled={loading}
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Enrollments</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {enrollments.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {completedCount}
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">All Enrollments</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredEnrollments.length} record(s)
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, course, status..."
              aria-label="Search enrollments"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-sm"
            />
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading enrollments...
            </div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="font-semibold text-slate-800">
                {enrollments.length === 0
                  ? "No enrollments found"
                  : "No matching enrollments"}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Enrollments will appear here when students join courses.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Student</th>
                    <th className="px-5 py-4 font-semibold">Course</th>
                    <th className="px-5 py-4 font-semibold">Enrolled On</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredEnrollments.map((enrollment, index) => {
                    const enrollmentId =
                      enrollment._id || enrollment.id || index;
                    const status = getStatus(enrollment);
                    const isCompleted = status === "completed";

                    return (
                      <tr
                        key={enrollmentId}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900">
                            {getStudentName(enrollment.student)}
                          </p>
                          {typeof enrollment.student === "object" &&
                            enrollment.student?.email && (
                              <p className="mt-1 text-xs text-slate-500">
                                {enrollment.student.email}
                              </p>
                            )}
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-700">
                          {getCourseName(enrollment.course)}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {formatDate(
                            enrollment.enrolledAt ||
                              enrollment.createdAt ||
                              enrollment.created_at
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              isCompleted
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {isCompleted ? "Completed" : status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {isCompleted ? (
                            <span className="font-medium text-green-700">
                              Done
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => markCompleted(enrollment)}
                              disabled={actionId === enrollmentId}
                              className="rounded-lg bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {actionId === enrollmentId
                                ? "Updating..."
                                : "Mark Completed"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
