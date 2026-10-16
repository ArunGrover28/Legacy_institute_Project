import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthProvider";

function MyCertificates() {
  const { studentToken, studentLogout } = useAuth();
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!studentToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/certificates/my", {
          headers: {
            Authorization: `Bearer ${studentToken}`,
          },
        });

        const data = response.data;
        const list = Array.isArray(data)
          ? data
          : data.certificates || [];

        setCertificates(list);
      } catch (err) {
        if (err.response?.status === 401) {
          studentLogout();
          navigate("/login");
        } else {
          setError(
            err.response?.data?.message ||
              "Unable to load your certificates. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [studentToken, navigate, studentLogout]);

  const handleDownload = async (certificate) => {
    try {
      const response = await api.get(
        `/certificates/${certificate._id}/download`,
        {
          headers: {
            Authorization: `Bearer ${studentToken}`,
          },
          responseType: "blob",
        }
      );

      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `LearnSpace-Certificate-${certificate._id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(fileURL);
    } catch (err) {
      setError(
        "Unable to download this certificate. Please try again later."
      );
    }
  };

  const handleLogout = () => {
    studentLogout();
    navigate("/login");
  };

  const getCourseTitle = (certificate) =>
    certificate.course?.title ||
    certificate.courseId?.title ||
    certificate.courseName ||
    "Course Completion Certificate";

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
              className="hidden text-sm font-medium text-slate-600 hover:text-blue-600 sm:inline"
            >
              Browse Courses
            </Link>

            <Link
              to="/my-enrollments"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              My Learning
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Heading */}
        <div className="mb-9">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Your Achievements
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            My Certificates
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            All your earned course certificates in one place. Download and
            keep them for your records.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="h-40 rounded-xl bg-slate-200" />
                <div className="mt-5 h-5 w-3/4 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
                <div className="mt-5 h-10 rounded-lg bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && certificates.length === 0 && (
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
                  d="M8 4.75h8l3 3v11.5H5V4.75h3Zm2 5h4m-4 3h4m-4 3h2"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No certificates yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your certificates will appear here once the institute issues
              them after course completion.
            </p>

            <Link
              to="/my-enrollments"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View My Courses
            </Link>
          </div>
        )}

        {/* Certificate cards */}
        {!loading && !error && certificates.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">
                  {certificates.length}
                </span>{" "}
                {certificates.length === 1
                  ? "certificate available"
                  : "certificates available"}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((certificate) => (
                <article
                  key={certificate._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Certificate preview */}
                  <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-4">
                    <div className="relative flex aspect-[1.4/1] flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-amber-400 bg-white px-4 text-center shadow-inner">
                      <div className="absolute inset-1.5 border border-amber-200" />

                      <div className="relative">
                        <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                          L
                        </div>

                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                          LearnSpace
                        </p>

                        <h2 className="mt-2 font-serif text-xl font-bold text-slate-800 sm:text-2xl">
                          Certificate
                        </h2>

                        <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">
                          Of Completion
                        </p>

                        <div className="mx-auto mt-3 h-0.5 w-16 bg-amber-400" />

                        <p className="mt-3 line-clamp-2 text-sm font-semibold text-slate-700">
                          {getCourseTitle(certificate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Certificate details */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {getCourseTitle(certificate)}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Issued certificate
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Available
                      </span>
                    </div>

                    {certificate.issuedAt && (
                      <p className="mt-4 text-sm text-slate-500">
                        Issued on:{" "}
                        {new Date(
                          certificate.issuedAt
                        ).toLocaleDateString()}
                      </p>
                    )}

                    <button
                      onClick={() => handleDownload(certificate)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3.75v11.5m0 0 4-4m-4 4-4-4M4.75 16.5v3h14.5v-3"
                        />
                      </svg>
                      Download Certificate
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
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

export default MyCertificates;
