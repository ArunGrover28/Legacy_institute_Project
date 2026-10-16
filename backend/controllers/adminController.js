
const jwt = require("jsonwebtoken");
const Certificate = require("../models/Certificate");
const Enrollment = require("../models/Enrollment");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const Student = require("../models/Student");

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    }

    const token = jwt.sign(
      { role: "admin" },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        username: process.env.ADMIN_USERNAME,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error.message);

    return res.status(500).json({
      message: "Server error during admin login",
    });
  }
};


// Admin views all student enrollments
const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate("student", "name email")
            .populate("course", "title category instructor duration fee")
            .sort({ enrolledAt: -1 });

        return res.status(200).json({
            count: enrollments.length,
            enrollments
        });
    } catch (error) {
        console.error("Get enrollments error:", error);

        return res.status(500).json({
            message: "Failed to fetch student enrollments"
        });
    }
};

// Admin views all registered students
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: students.length,
            students
        });
    } catch (error) {
        console.error("Get students error:", error);

        return res.status(500).json({
            message: "Failed to fetch students"
        });
    }
};
// cloudaniry

const uploadCertificate = async (req, res) => {
    let uploadedPublicId;
    console.log("Request body:", req.body);
console.log("Uploaded file:", req.file?.originalname);

    try {
        const { enrollmentId } = req.body;

        if (!enrollmentId) {
            return res.status(400).json({
                message: "Enrollment ID is required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a PDF certificate",
            });
        }

        // Check that the enrollment exists and is completed.
        const enrollment = await Enrollment.findById(enrollmentId);

        if (!enrollment) {
            return res.status(404).json({
                message: "Enrollment not found",
            });
        }

        if (enrollment.status !== "completed") {
            return res.status(400).json({
                message: "Mark the enrollment as completed before uploading a certificate",
            });
        }

        // Prevent duplicate certificates for one enrollment.
        const existingCertificate = await Certificate.findOne({
            enrollment: enrollment._id,
        });

        if (existingCertificate) {
            return res.status(409).json({
                message: "A certificate already exists for this enrollment",
            });
        }

        // Upload PDF to Cloudinary as a raw file.
        const publicId = `certificate_${enrollment._id}_${Date.now()}`;

        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    type: "private",
                    public_id: publicId,
                    folder: "lms-certificates",
                    format: "pdf",
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            Readable.from(req.file.buffer).pipe(uploadStream);
        });

        uploadedPublicId = uploadResult.public_id;

        const certificate = await Certificate.create({
            student: enrollment.student,
            course: enrollment.course,
            enrollment: enrollment._id,
            cloudinaryPublicId: uploadResult.public_id,
            certificateUrl: uploadResult.secure_url,
            originalFileName: req.file.originalname,
        });

        return res.status(201).json({
            message: "Certificate uploaded successfully",
            certificate,
        });
    } catch (error) {
        // Clean up the Cloudinary file if the database write fails.
        if (uploadedPublicId) {
            try {
                await cloudinary.uploader.destroy(uploadedPublicId, {
                    resource_type: "raw",
                });
            } catch (cleanupError) {
                console.error("Cloudinary cleanup failed:", cleanupError.message);
            }
        }

        console.error("Certificate upload error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid enrollment ID",
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: "A certificate already exists for this enrollment",
            });
        }

        return res.status(500).json({
            message: "Failed to upload certificate",
        });
    }
};


const markEnrollmentCompleted = async (req, res) => {
    try {
        const { id } = req.params;

        const enrollment = await Enrollment.findById(id);

        if (!enrollment) {
            return res.status(404).json({
                message: "Enrollment not found",
            });
        }

        if (enrollment.status === "completed") {
            return res.status(200).json({
                message: "Enrollment is already completed",
                enrollment,
            });
        }

        enrollment.status = "completed";
        enrollment.completedAt = new Date();

        await enrollment.save();

        return res.status(200).json({
            message: "Enrollment marked as completed",
            enrollment,
        });
    } catch (error) {
        console.error("Mark enrollment completed error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid enrollment ID",
            });
        }

        return res.status(500).json({
            message: "Failed to complete enrollment",
        });
    }
};

const inspectCertificateAsset = async (req, res) => {
    try {
        const { publicId } = req.params;
        const cloudinary = require("../config/cloudinary");

        const result = await cloudinary.api.resource(publicId, {
            resource_type: "raw",
            type:"upload"
        });

        return res.status(200).json({
            publicId: result.public_id,
            resourceType: result.resource_type,
            deliveryType: result.type,
            accessMode: result.access_mode || null,
            format: result.format,
            secureUrl: result.secure_url,
        });
    } catch (error) {
    console.error("Inspect Cloudinary asset error:", error);

    return res.status(500).json({
        message: "Could not inspect Cloudinary asset",
        error: error.message,
        http_code: error.http_code || null,
    });
}
};



module.exports = { 
  adminLogin,
  getAllEnrollments,
  getAllStudents
    ,uploadCertificate,
    inspectCertificateAsset
 };

 module.exports.markEnrollmentCompleted = markEnrollmentCompleted;
