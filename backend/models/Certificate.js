
const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        enrollment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enrollment",
            required: true,
            unique: true,
        },
        cloudinaryPublicId: {
            type: String,
            required: true,
        },
        certificateUrl: {
            type: String,
            required: true,
        },
        originalFileName: {
            type: String,
            required: true,
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
