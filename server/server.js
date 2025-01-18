const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
const ensureUploadsDir = require("./utils/ensureUploadsDir");
const errorHandler = require("./middleware/errorMiddleware");
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

// Ensure uploads directory exists
ensureUploadsDir();

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/history", historyRoutes);

// Error handling middleware (should be after routes)
app.use(errorHandler);

// Initialize server function
const initializeServer = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync database with force:false to preserve data
    await db.sequelize.sync({ force: false });
    console.log("Database synchronized successfully");

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
