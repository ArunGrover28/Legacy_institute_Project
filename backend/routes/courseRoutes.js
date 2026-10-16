
const express = require("express");
const {
    createCourse,
    getCourses,
    getAllCoursesForAdmin,
    updateCourseStatus,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

const adminAuthMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Admin routes
router.get("/admin/all", adminAuthMiddleware, getAllCoursesForAdmin);
router.patch("/:id/status", adminAuthMiddleware, updateCourseStatus);
router.post("/", adminAuthMiddleware, createCourse);
router.put("/:id", adminAuthMiddleware, updateCourse);
router.delete("/:id", adminAuthMiddleware, deleteCourse);
// Public route
router.get("/", getCourses);

module.exports = router;
