
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Courses from "./pages/Courses";
import MyEnrollments from "./pages/MyEnrollements";
import MyCertificates from "./pages/MyCertificates";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/my-enrollments" element={<MyEnrollments />} />
      <Route path="/my-certificates" element={<MyCertificates />} />
     
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
