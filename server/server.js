const express = require("express");
const cors = require("cors");
const db = require("./models");
const addressRoutes = require("./routes/addressRoutes");
const driverRoutes = require("./routes/driverRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
const routeRoutes = require("./routes/routeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test connection and sync database
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
    return db.sequelize.sync({ force: false });
  })
  .then(() => {
    console.log("Database synchronized successfully");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// Route
app.use("/api/addresses", addressRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/routes", routeRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
