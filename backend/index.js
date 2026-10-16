const express = require("express");
require("dotenv").config();
const connectDB = require("./config");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const cors = require('cors');


const app = express();

// Middleware — must come before routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin", adminRoutes);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses",courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/certificates", certificateRoutes);

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

const startServer = async () => {
    await connectDB();

    app.listen(process.env.PORT || 5000, () => {
        console.log("Server running");
    });
};

startServer();