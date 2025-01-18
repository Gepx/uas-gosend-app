const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");
const upload = require("../middleware/uploadMiddleware");

router.get("/", driverController.getAllDrivers);
router.get("/:id", driverController.getDriver);
router.post("/", upload.single("profileImage"), driverController.createDriver);
router.put(
  "/:id",
  upload.single("profileImage"),
  driverController.updateDriver
);
router.delete("/:id", driverController.deleteDriver);

module.exports = router;
