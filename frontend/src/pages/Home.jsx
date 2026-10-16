
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        const data = response.data;

        setCourses(
          Array.isArray(data) ? data : data.courses || []
        );
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              L
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Legacy INT
              </h1>
              <p className="text-xs text-slate-500">
                Institute Learning Portal
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#home"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Home
            </a>
            <a
              href="#courses"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Courses
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section id="home" className="overflow-hidden">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:py-28 lg:grid-cols-2 lg:px-8">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Your journey to new skills starts here
              </div>

              <h2 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Learn new skills.
                <span className="block text-blue-600">
                  Build your future.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Explore courses offered by our institute, learn at your
                own pace, track your progress, and access your course
                certificates in one convenient place.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Explore Courses
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  Create Free Account
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  Explore available courses
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  Track your learning
                </span>
              </div>
            </div>

            {/* Decorative learning dashboard */}
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -left-8 top-12 h-40 w-40 rounded-full bg-blue-200/60 blur-3xl" />
              <div className="absolute -right-8 bottom-8 h-40 w-40 rounded-full bg-indigo-200/60 blur-3xl" />

              <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/40 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Your learning space
                    </p>
                    <h3 className="mt-1 text-xl font-bold">
                      Keep growing
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                    📚
                  </div>
                </div>

                <div className="mt-7 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
                  <p className="text-sm text-blue-100">
                    Every expert starts somewhere
                  </p>
                  <h4 className="mt-3 text-2xl font-bold">
                    Start learning today.
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-blue-100">
                    Discover a course that matches your goals.
                  </p>

                  <Link
                    to="/courses"
                    className="mt-5 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    Find a course →
                  </Link>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                      🎯
                    </div>
                    <p className="mt-3 font-semibold">Your Goals</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Learn with purpose
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-xl">
                      🏆
                    </div>
                    <p className="mt-3 font-semibold">Your Success</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Celebrate progress
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="about" className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Why LearnSpace?
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to keep learning
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                One convenient place to discover courses and manage your
                learning journey.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  📖
                </div>
                <h3 className="mt-5 text-lg font-bold">
                  Explore Courses
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Browse courses published by your institute and find
                  learning opportunities that interest you.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                  📈
                </div>
                <h3 className="mt-5 text-lg font-bold">
                  Track Your Progress
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Keep your enrolled courses organized and follow your
                  learning progress from your student account.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                  📜
                </div>
                <h3 className="mt-5 text-lg font-bold">
                  Access Certificates
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Access certificates provided by your institute when
                  they are available for your completed courses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section id="courses" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Find your next course
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Explore our courses
              </h2>
              <p className="mt-3 text-slate-600">
                Discover the courses currently available at our institute.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all courses <span aria-hidden="true">→</span>
            </Link>
          </div>

          {loading ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="mt-5 h-6 w-3/4 rounded bg-slate-200" />
                  <div className="mt-4 h-4 rounded bg-slate-100" />
                  <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <p className="text-lg font-semibold">
                Courses are coming soon
              </p>
              <p className="mt-2 text-slate-500">
                Please check back later for available courses.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 3).map((course) => (
                <article
                  key={course._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
                >
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-slate-100">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                        📘
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {course.category || "Course"}
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        {course.fee === 0 ? "Free" : `₹${course.fee}`}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold transition group-hover:text-blue-600">
                      {course.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
                      {course.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                      <span>{course.instructor}</span>
                      <span>{course.duration}</span>
                    </div>

                    <Link
                      to="/courses"
                      className="mt-5 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Course
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Call to action */}
        <section className="px-6 pb-20 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to start your learning journey?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100">
              Create your student account to explore courses, manage
              enrollments, and access your course certificates.
            </p>
            <Link
              to="/signup"
              className="mt-8 inline-flex rounded-xl bg-white px-6 py-3.5 font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              Join the Learning Portal
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link to="/" className="font-bold text-slate-800">
            LearnSpace
          </Link>

          <p>
            Learn, grow, and move forward — one course at a time.
          </p>

          <div className="flex gap-5">
            <Link
              to="/login"
              className="transition hover:text-blue-600"
            >
              Student Login
            </Link>
            <Link
              to="/signup"
              className="transition hover:text-blue-600"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
