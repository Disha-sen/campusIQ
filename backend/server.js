// =====================================================
// CampusIQ - Campus Intelligence & Analytics Platform
// © 2026 Disha Sen | disha0204sen@gmail.com
// =====================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const analyticsRoutes = require("./routes/analytics");
const facultyRoutes = require("./routes/faculty");
const studentRoutes = require("./routes/student");
const placementRoutes = require("./routes/placement");
const xmlRoutes = require("./routes/xml");

const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARE
// =====================================================

// CORS configuration
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Parse JSON and URL-encoded data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "edu_analytics_secret_key_2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/placement", placementRoutes);
app.use("/api/xml", xmlRoutes);

// =====================================================
// PAGE ROUTES
// =====================================================

// Serve login page as default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Dashboard routes based on role
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/dashboard.html"));
});

app.get("/faculty/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/faculty/dashboard.html"));
});

app.get("/student/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/student/dashboard.html"));
});

app.get("/placement/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/placement/dashboard.html"));
});

// =====================================================
// ERROR HANDLING
// =====================================================

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     🎓  CampusIQ - Campus Intelligence & Analytics Platform      ║
║                                                                  ║
║     Server: http://localhost:${PORT}                                ║
║     Environment: ${(process.env.NODE_ENV || "development").padEnd(12)}                            ║
║                                                                  ║
║     © 2026 Disha Sen | disha0204sen@gmail.com                    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
