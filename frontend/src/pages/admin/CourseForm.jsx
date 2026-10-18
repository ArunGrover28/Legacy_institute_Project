
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthProvider";

const initialForm = {
  title: "",
  description: "",
  category: "",
  instructor: "",
  duration: "",
  fee: "",
  thumbnail: "",
};

export default function CourseForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { adminToken } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isEditing || !adminToken) return;

    const fetchCourse = async () => {
      try {
        const response = await api.get("/courses/admin/all", {
          headers: { Authorization: `Bearer ${adminToken}` },
        });

        const courses = response.data.courses || [];
        const course = courses.find((item) => item._id === id);

        if (!course) {
          setError("Course not found.");
          return;
        }

        setForm({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",
          instructor: course.instructor || "",
          duration: course.duration || "",
          fee: String(course.fee ?? ""),
          thumbnail: course.thumbnail || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load course."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, isEditing, adminToken]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Course title and description are required.");
      return;
    }

    if (Number(form.fee) < 0 || form.fee === "") {
      setError("Please enter a valid course fee.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        fee: Number(form.fee),
      };

      const config = {
        headers: { Authorization: `Bearer ${adminToken}` },
      };

      if (isEditing) {
        await api.put(`/courses/${id}`, payload, config);
        setMessage("Course updated successfully.");
      } else {
        await api.post("/courses", payload, config);
        setMessage("Course created successfully.");
      }

      navigate("/admin/courses", {
        state: {
          message: isEditing
            ? "Course updated successfully."
            : "Course created successfully.",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save course."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-600">Loading course...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/admin/courses"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Courses
        </Link>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? "Edit Course" : "Add New Course"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter the course information below.
          </p>

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Course Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={150}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Full Stack Web Development"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Describe what students will learn..."
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Development"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Instructor
                </label>
                <input
                  name="instructor"
                  value={form.instructor}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Instructor name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Duration
                </label>
                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="6 months"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Fee (₹) *
                </label>
                <input
                  type="number"
                  name="fee"
                  value={form.fee}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="15000"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Thumbnail URL (optional)
              </label>
              <input
                type="url"
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="https://example.com/course-image.jpg"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Course"}
              </button>

              <Link
                to="/admin/courses"
                className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
