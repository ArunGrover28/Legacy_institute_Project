
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthProvider";

export default function ManageStudents() {
  const { adminToken, adminLogout } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    if (!adminToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/students", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      // Supports either { students: [...] } or a direct array response.
      const data = response.data;
      setStudents(Array.isArray(data) ? data : data.students || []);
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) {
        adminLogout();
        navigate("/admin/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message || "Failed to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // Fetch when the authenticated admin token changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken]);

  const getStudentName = (student) => {
    if (student.name) return student.name;

    const fullName = [student.firstName, student.lastName]
      .filter(Boolean)
      .join(" ");

    return fullName || "Unnamed student";
  };

  const filteredStudents = students.filter((student) => {
    const name = getStudentName(student).toLowerCase();
    const email = (student.email || "").toLowerCase();
    const query = search.trim().toLowerCase();

    return name.includes(query) || email.includes(query);
  });

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
              Manage Students
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage students registered with your institute.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchStudents}
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

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Students</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {students.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Search Results</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {filteredStudents.length}
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">All Students</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredStudents.length} student(s)
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              aria-label="Search students by name or email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-sm"
            />
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading students...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="font-semibold text-slate-800">
                {students.length === 0
                  ? "No students registered yet"
                  : "No matching students"}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {students.length === 0
                  ? "Registered students will appear here."
                  : "Try searching with another name or email."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Student</th>
                    <th className="px-5 py-4 font-semibold">Email</th>
                    <th className="px-5 py-4 font-semibold">Registered</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student._id || student.id || student.email || index}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                            {getStudentName(student)
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span className="font-medium text-slate-900">
                            {getStudentName(student)}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {student.email || "—"}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {formatDate(student.createdAt || student.created_at)}
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
