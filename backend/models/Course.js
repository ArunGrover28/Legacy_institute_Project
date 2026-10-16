
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        instructor: {
            type: String,
            required: true,
            trim: true
        },

        duration: {
            type: String,
            required: true,
            trim: true
        },

        fee: {
            type: Number,
            required: true,
            min: 0
        },

        thumbnail: {
            type: String,
            default: ""
        },

        isPublished: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
