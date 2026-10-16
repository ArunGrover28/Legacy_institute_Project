
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// Student enrolls in a course
const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const studentId = req.studentId;

        if (!courseId) {
            return res.status(400).json({
                message: "Course ID is required"
            });
        }

        // Check if course exists and is published
        const course = await Course.findOne({
            _id: courseId,
            isPublished: true
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or not available for enrollment"
            });
        }

        // Prevent duplicate enrollment
        const existingEnrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId
        });

        if (existingEnrollment) {
            return res.status(409).json({
                message: "You are already enrolled in this course"
            });
        }

        const enrollment = await Enrollment.create({
            student: studentId,
            course: courseId
        });

        return res.status(201).json({
            message: "Successfully enrolled in course",
            enrollment
        });

    } catch (error) {
        console.error("Enrollment error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "You are already enrolled in this course"
            });
        }

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        return res.status(500).json({
            message: "Failed to enroll in course"
        });
    }
};

// Get courses enrolled by the logged-in student
const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            student: req.studentId
        })
        .populate("course")
        .sort({ enrolledAt: -1 });

        return res.status(200).json({
            count: enrollments.length,
            enrollments
        });

    } catch (error) {
        console.error("Fetch enrollments error:", error);

        return res.status(500).json({
            message: "Failed to fetch enrollments"
        });
    }
};

module.exports = {
    enrollInCourse,
    getMyEnrollments
};
