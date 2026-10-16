
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// Add a course
const createCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            instructor,
            duration,
            fee,
            thumbnail,
            isPublished
        } = req.body || {};

        if (
            !title ||
            !description ||
            !category ||
            !instructor ||
            !duration ||
            fee === undefined ||
            fee === null ||
            fee === ""
        ) {
            return res.status(400).json({
                message: "Please provide all required course fields"
            });
        }

        const course = await Course.create({
            title,
            description,
            category,
            instructor,
            duration,
            fee,
            thumbnail,
            isPublished
        });

        return res.status(201).json({
            message: "Course created successfully",
            course
        });

    } catch (error) {
        console.error("Create course error:", error);

        return res.status(500).json({
            message: "Failed to create course"
        });
    }
};

// Get all published courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: courses.length,
            courses
        });

    } catch (error) {
        console.error("Get courses error:", error);

        return res.status(500).json({
            message: "Failed to fetch courses"
        });
    }
};


const getAllCoursesForAdmin = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });

        return res.status(200).json({
            count: courses.length,
            courses
        });
    } catch (error) {
        console.error("Get admin courses error:", error);

        return res.status(500).json({
            message: "Failed to fetch courses"
        });
    }
};

// Update course details
const updateCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      instructor,
      duration,
      fee,
      thumbnail,
      isPublished,
    } = req.body || {};

    const allowedFields = {
      title,
      description,
      category,
      instructor,
      duration,
      fee,
      thumbnail,
      isPublished,
    };

    // Only update fields that were actually provided.
    const updates = Object.fromEntries(
      Object.entries(allowedFields).filter(
        ([key, value]) => value !== undefined
      )
    );

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    // Validate required text fields if provided.
    const requiredTextFields = [
      "title",
      "description",
      "category",
      "instructor",
      "duration",
    ];

    for (const field of requiredTextFields) {
      if (
        field in updates &&
        (typeof updates[field] !== "string" ||
          !updates[field].trim())
      ) {
        return res.status(400).json({
          message: `${field} cannot be empty`,
        });
      }

      if (field in updates) {
        updates[field] = updates[field].trim();
      }
    }

    if (
      "fee" in updates &&
      (updates.fee === "" ||
        !Number.isFinite(Number(updates.fee)) ||
        Number(updates.fee) < 0)
    ) {
      return res.status(400).json({
        message: "Fee must be a valid non-negative number",
      });
    }

    if ("fee" in updates) {
      updates.fee = Number(updates.fee);
    }

    if (
      "isPublished" in updates &&
      typeof updates.isPublished !== "boolean"
    ) {
      return res.status(400).json({
        message: "isPublished must be true or false",
      });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    return res.status(500).json({
      message: "Failed to update course",
    });
  }
};

// Delete a course if no students are enrolled
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const enrollmentCount = await Enrollment.countDocuments({
      course: course._id,
    });

    if (enrollmentCount > 0) {
      return res.status(409).json({
        message:
          "This course has student enrollments and cannot be deleted. Unpublish it instead.",
        enrollmentCount,
      });
    }

    await Course.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    return res.status(500).json({
      message: "Failed to delete course",
    });
  }
};


const updateCourseStatus = async (req, res) => {
    try {
        const { isPublished } = req.body;

        if (typeof isPublished !== "boolean") {
            return res.status(400).json({
                message: "isPublished must be true or false"
            });
        }

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { isPublished },
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        return res.status(200).json({
            message: `Course ${isPublished ? "published" : "unpublished"} successfully`,
            course
        });
    } catch (error) {
        console.error("Update course status error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        return res.status(500).json({
            message: "Failed to update course status"
        });
    }
};



module.exports = {
  createCourse,
  getCourses,
  getAllCoursesForAdmin,
  updateCourseStatus,
  updateCourse,
  deleteCourse,
};
