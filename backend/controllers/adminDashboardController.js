const Student = require("../models/Student");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Certificate = require("../models/Certificate");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      completedEnrollments,
      totalCertificates,
    ] = await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      Course.countDocuments({ isPublished: true }),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ status: "completed" }),
      Certificate.countDocuments(),
    ]);

    return res.status(200).json({
      stats: {
        totalStudents,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        completedEnrollments,
        totalCertificates,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
};

module.exports = { getDashboardStats };
