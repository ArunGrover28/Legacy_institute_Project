
const jwt = require("jsonwebtoken");

const adminAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Admin token required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.ADMIN_JWT_SECRET
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired admin token.",
    });
  }
};

module.exports = adminAuthMiddleware;
