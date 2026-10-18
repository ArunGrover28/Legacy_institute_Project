
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthProvider";

export default function ManageCourse() {
  const { adminToken, adminLogout } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionId, setActionId] = useState("");

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/courses/admin/all", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      setCourses(response.data.courses || []);
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) {
        adminLogout();
        return;
      }

      setError(
        err.response?.data?.message || "Failed to load courses."
      );
    } finally {
      setLoading(false);
    }
  }, [adminToken, adminLogout]);

  useEffect(() => {
    if (adminToken) {
      fetchCourses();
    }
  }, [adminToken, fetchCourses]);

  const togglePublish = async (course) => {
    try {
      setActionId(course._id);
      setError("");
      setMessage("");

      await api.patch(
        `/courses/${course._id}/status`,
        { isPublished: !course.isPublished },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setMessage(
        `Course ${course.isPublished ? "unpublished" : "published"} successfully.`
      );

      await fetchCourses();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update course status."
      );
    } finally {
      setActionId("");
    }
  };

  const deleteCourse = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"?`
    );

    if (!confirmed) return;

    try {
      setActionId(course._id);
      setError("");
      setMessage("");

      await api.delete(`/courses/${course._id}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      setCourses((current) =>
        current.filter((item) => item._id !== course._id)
      );

      setMessage("Course deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete course. It may have existing enrollments."
      );
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <Link
              to="/admin/dashboard"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Manage Courses
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage your institute's courses.
            </p>
          </div>

          <button
            onClick={fetchCourses}
            disabled={loading}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50"
          >
            Refresh
          </button>
                    <Link
            to="/admin/courses/new"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
            + Add Course
            </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-5 sm:p-8">
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            {message}
          </div>
        )}

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Courses</p>
            <p className="mt-2 text-3xl font-bold">
              {loading ? "..." : courses.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Published</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {loading
                ? "..."
                : courses.filter((course) => course.isPublished).length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Unpublished</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {loading
                ? "..."
                : courses.filter((course) => !course.isPublished).length}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold">All Courses</h2>
            <span className="text-sm text-slate-500">
              {courses.length} course(s)
            </span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading courses...
            </div>
          ) : courses.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-lg font-semibold">No courses found</p>
              <p className="mt-2 text-sm text-slate-500">
                Once courses are added, they will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Course</th>
                    <th className="px-5 py-4 font-semibold">Instructor</th>
                    <th className="px-5 py-4 font-semibold">Duration</th>
                    <th className="px-5 py-4 font-semibold">Fee</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {course.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {course.category}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {course.instructor || "—"}
                      </td>

                      <td className="px-5 py-4">
                        {course.duration || "—"}
                      </td>

                      <td className="px-5 py-4">
                        ₹{Number(course.fee || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            course.isPublished
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => togglePublish(course)}
                            disabled={actionId === course._id}
                            className="font-semibold text-blue-600 hover:underline disabled:opacity-50"
                          >
                            {actionId === course._id
                              ? "Working..."
                              : course.isPublished
                                ? "Unpublish"
                                : "Publish"}
                          </button>

                          <button
                            onClick={() => deleteCourse(course)}
                            disabled={actionId === course._id}
                            className="font-semibold text-red-600 hover:underline disabled:opacity-50"
                          >
                            Delete
                          </button>
                          <Link
                            to={`/admin/courses/edit/${course._id}`}
                            className="mr-3 font-medium text-blue-600 hover:text-blue-800"
                            >
                            Edit
                            </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
