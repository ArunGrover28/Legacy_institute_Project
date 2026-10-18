
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthProvider";

export default function ManageCertificates() {
  const { adminToken, adminLogout } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
      const allEnrollments = Array.isArray(data)
        ? data
        : data.enrollments || [];

      // Only completed enrollments can receive certificates.
      const completed = allEnrollments.filter(
        (item) => String(item.status || "").toLowerCase() === "completed"
      );

      setEnrollments(completed);
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) {
        adminLogout();
        navigate("/admin/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load completed enrollments."
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
    if (typeof student === "string") return `Student ID: ${student}`;

    if (student.name) return student.name;

    const fullName = [student.firstName, student.lastName]
      .filter(Boolean)
      .join(" ");

    return fullName || student.email || "Unknown student";
  };

  const getCourseName = (course) => {
    if (!course) return "Unknown course";
    if (typeof course === "string") return `Course ID: ${course}`;

    return course.title || "Unknown course";
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!selectedEnrollment) {
      setError("Please select a completed enrollment.");
      return;
    }

    if (!file) {
      setError("Please select a PDF certificate.");
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Only PDF certificate files are allowed.");
      return;
    }

    // Basic client-side size check: 10 MB.
    if (file.size > 10 * 1024 * 1024) {
      setError("The PDF must be 10 MB or smaller.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("enrollmentId", selectedEnrollment);
      formData.append("certificate", file);

      const response = await api.post(
        "/admin/certificates",
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setMessage(
        response.data?.message || "Certificate uploaded successfully."
      );

      setFile(null);
      event.target.reset();
      setSelectedEnrollment("");

      await fetchEnrollments();
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) {
        adminLogout();
        navigate("/admin/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Certificate upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/admin/dashboard"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              Manage Certificates
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Upload institute-issued PDF certificates for completed courses.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchEnrollments}
            disabled={loading}
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Refresh
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
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

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Completed Enrollments</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {enrollments.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Upload Format</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">PDF</p>
            <p className="mt-1 text-xs text-slate-500">
              Maximum file size: 10 MB
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">
            Upload a Certificate
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Select the student’s completed enrollment and attach the PDF
            provided by your institute.
          </p>

          {loading ? (
            <p className="mt-6 text-slate-500">
              Loading completed enrollments...
            </p>
          ) : enrollments.length === 0 ? (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              No completed enrollments are available. Mark a student's
              enrollment as completed before uploading a certificate.
            </div>
          ) : (
            <form onSubmit={handleUpload} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="enrollment"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Select Student and Course *
                </label>

                <select
                  id="enrollment"
                  value={selectedEnrollment}
                  onChange={(event) =>
                    setSelectedEnrollment(event.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Choose an enrollment</option>

                  {enrollments.map((enrollment, index) => (
                    <option
                      key={enrollment._id || enrollment.id || index}
                      value={enrollment._id || enrollment.id}
                    >
                      {getStudentName(enrollment.student)} —{" "}
                      {getCourseName(enrollment.course)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="certificate"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Certificate PDF *
                </label>

                <input
                  id="certificate"
                  type="file"
                  accept=".pdf,application/pdf"
                  required
                  onChange={(event) =>
                    setFile(event.target.files?.[0] || null)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                />

                {file && (
                  <p className="mt-2 text-sm text-slate-500">
                    Selected: {file.name} (
                    {(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading || !selectedEnrollment || !file}
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload Certificate"}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
