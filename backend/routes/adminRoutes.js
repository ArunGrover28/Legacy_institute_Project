const express = require("express");
const {
  adminLogin,
  getAllEnrollments,
  getAllStudents,
  markEnrollmentCompleted,
  inspectCertificateAsset
} = require("../controllers/adminController");
const adminAuthMiddleware = require("../middleware/adminMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { uploadCertificate } = require("../controllers/adminController");
const { getDashboardStats } = require("../controllers/adminDashboardController");

const router = express.Router();

router.post("/login", adminLogin);

// Temporary protected test route
router.get("/test", adminAuthMiddleware, (req, res) => {
  res.status(200).json({
    message: "Admin authentication successful",
  });
});

// Admin-only endpoints
router.get("/dashboard/stats", adminAuthMiddleware, getDashboardStats);
router.get("/students", adminAuthMiddleware, getAllStudents);
router.get("/enrollments", adminAuthMiddleware, getAllEnrollments);
router.post(
    "/certificates",
    adminAuthMiddleware,
    uploadMiddleware.single("certificate"),
    uploadCertificate
);
router.patch(
    "/enrollments/:id/complete",
    adminAuthMiddleware,
    markEnrollmentCompleted
);
router.get(
    "/certificates/inspect/:publicId",
    adminAuthMiddleware,
    inspectCertificateAsset
);
module.exports = router;
