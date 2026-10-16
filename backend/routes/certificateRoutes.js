
const express = require("express");
const {
    getMyCertificates,
    downloadMyCertificate
} = require("../controllers/certificateController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my", authMiddleware, getMyCertificates);
router.get("/:id/download", authMiddleware, downloadMyCertificate);

module.exports = router;
