const express = require("express");
const cors = require("cors");
const db = require("./models");
const addressRoutes = require("./routes/addressRoutes");
const driverRoutes = require("./routes/driverRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
const routeRoutes = require("./routes/routeRoutes");
const historyRoutes = require("./routes/historyRoutes");
const seedUser = require("./seeders/userSeeder");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

// Test connection and sync database
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
    return db.sequelize.sync({ force: false });
  })
  .then(async () => {
    console.log("Database synchronized successfully");
    // Run seeders
    await seedUser();
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// Routes
app.use("/api/addresses", addressRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/history", historyRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
