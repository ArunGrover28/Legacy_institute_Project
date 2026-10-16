
const express = require("express");

const {
    enrollInCourse,
    getMyEnrollments
} = require("../controllers/enrollmentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Student enrollment requires student authentication
router.post("/", authMiddleware, enrollInCourse);

// Student can see their own enrollments
router.get("/my", authMiddleware, getMyEnrollments);

module.exports = router;
