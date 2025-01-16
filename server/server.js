const express = require("express");
const cors = require("cors");
const db = require("./models");
const addressRoutes = require("./routes/addressRoutes");
const driverRoutes = require("./routes/driverRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
const routeRoutes = require("./routes/routeRoutes");
const historyRoutes = require("./routes/historyRoutes");
const authRoutes = require("./routes/authRoutes");

const PORT = 5000;

const app = express();

// Middleware
app.use(cors()); // Simplified CORS for now
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// Initialize server function
const initializeServer = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync database
    await db.sequelize.sync({ force: false });
    console.log("Database synchronized successfully");

    // Routes (after DB is connected)
    app.use("/api/auth", authRoutes);
    app.use("/api/addresses", addressRoutes);
    app.use("/api/drivers", driverRoutes);
    app.use("/api/vouchers", voucherRoutes);
    app.use("/api/routes", routeRoutes);
    app.use("/api/history", historyRoutes);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
};

// Start the server
initializeServer();
