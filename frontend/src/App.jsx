
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Courses from "./pages/Courses";
import MyEnrollments from "./pages/MyEnrollements";
import MyCertificates from "./pages/MyCertificates";
import ManageCourse from "./pages/admin/ManageCourse";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CourseForm from "./pages/admin/CourseForm";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageEnrollments from "./pages/admin/ManageEnrollments";
import ManageCertificates from "./pages/admin/ManageCertificates";

function App() {
  return (
    <Routes>
      {/* Student routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/my-enrollments" element={<MyEnrollments />} />
      <Route path="/my-certificates" element={<MyCertificates />} />

      {/* Admin login is public */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* All routes inside this group require an admin token */}
      <Route element={<AdminProtectedRoute />}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
  <Route path="/admin/courses" element={<ManageCourse />} />
  <Route path="/admin/courses/new" element={<CourseForm />} />
  <Route path="/admin/courses/edit/:id" element={<CourseForm />} />
  <Route path="/admin/students" element={<ManageStudents />}/>
  <Route path="/admin/enrollments" element={<ManageEnrollments />}/>
  <Route path="/admin/certificates" element={<ManageCertificates />}/>
</Route>
    </Routes>
  );
}

export default App;
