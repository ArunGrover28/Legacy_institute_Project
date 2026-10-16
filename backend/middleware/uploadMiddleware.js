
const multer = require("multer");

const uploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB maximum
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype !== "application/pdf" ||
            !file.originalname.toLowerCase().endsWith(".pdf")
        ) {
            return cb(new Error("Only PDF files are allowed"));
        }

        cb(null, true);
    },
});

module.exports = uploadMiddleware;
