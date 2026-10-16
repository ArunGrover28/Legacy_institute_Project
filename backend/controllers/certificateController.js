
const Certificate = require("../models/Certificate");
const cloudinary = require("../config/cloudinary");
// Get certificates belonging to the logged-in student
const getMyCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({
            student: req.studentId,
        })
            .populate("course", "title category instructor")
            .sort({ uploadedAt: -1 });

        return res.status(200).json({
            count: certificates.length,
            certificates,
        });
    } catch (error) {
        console.error("Get my certificates error:", error);

        return res.status(500).json({
            message: "Failed to fetch certificates",
        });
    }
};


const downloadMyCertificate = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the certificate owned by the logged-in student.
        const certificate = await Certificate.findOne({
            _id: id,
            student: req.studentId,
        });

        if (!certificate) {
            return res.status(404).json({
                message: "Certificate not found",
            });
        }

        // Generate a temporary signed download URL.
        const downloadUrl = cloudinary.utils.private_download_url(
            certificate.cloudinaryPublicId,
            "pdf",
            {
                resource_type: "raw",
                type: "private",
                expires_at: Math.floor(Date.now() / 1000) + 300,
                attachment: true,
            }
        );

        return res.status(200).json({
            message: "Download link generated successfully",
            downloadUrl,
            expiresInSeconds: 300,
        });
    } catch (error) {
        console.error("Download certificate error:", error);

        return res.status(500).json({
            message: "Failed to generate certificate download link",
        });
    }
};

module.exports = {
    getMyCertificates,
    downloadMyCertificate
};
