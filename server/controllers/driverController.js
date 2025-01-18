const db = require("../models");
const Driver = db.Driver;
const fs = require("fs");
const path = require("path");

const driverController = {
  // Get all drivers
  getAllDrivers: async (req, res) => {
    try {
      const drivers = await Driver.findAll();
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single driver
  getDriver: async (req, res) => {
    try {
      const driver = await Driver.findByPk(req.params.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      res.json(driver);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create driver
  createDriver: async (req, res) => {
    try {
      // console.log("Request body:", req.body); console to get the driver data
      // console.log("Request file:", req.file); console to get file data information

      const driverData = { ...req.body };

      // If there's an uploaded file, add its path to driverData
      if (req.file) {
        const imagePath = `http://localhost:5000/uploads/drivers/${req.file.filename}`;
        // console.log("Setting image path:", imagePath); image url path yang diupload ke database
        driverData.profileImage = imagePath;
      }

      // Log the final data being sent to database
      // console.log("Data being sent to database:", driverData); informasi data yang dikirim ke database

      const driver = await Driver.create(driverData);
      // console.log("Created driver:", driver.toJSON());
      res.status(201).json(driver);
    } catch (error) {
      console.error("Detailed error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        validationError: error.errors,
      });

      // If there was an error and a file was uploaded, delete it
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
          console.log("Cleaned up uploaded file after error");
        } catch (unlinkError) {
          console.error("Error cleaning up file:", unlinkError);
        }
      }

      // Send more detailed error response
      res.status(400).json({
        message: error.message,
        type: error.name,
        validation: error.errors,
      });
    }
  },

  // Update driver
  updateDriver: async (req, res) => {
    try {
      const driver = await Driver.findByPk(req.params.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      const driverData = { ...req.body };

      // If there's a new file uploaded
      if (req.file) {
        // Delete old image if it exists and is not the default image
        if (
          driver.profileImage &&
          !driver.profileImage.includes("default-profile.png")
        ) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            "uploads",
            "drivers",
            path.basename(driver.profileImage)
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        // Add new image path
        driverData.profileImage = `http://localhost:5000/uploads/drivers/${req.file.filename}`;
      }

      await driver.update(driverData);
      res.json(driver);
    } catch (error) {
      // If there was an error and a file was uploaded, delete it
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
          console.log("Cleaned up uploaded file after error");
        } catch (unlinkError) {
          console.error("Error cleaning up file:", unlinkError);
        }
      }
      res.status(400).json({
        message: error.message,
        type: error.name,
        validation: error.errors,
      });
    }
  },

  // Delete driver
  deleteDriver: async (req, res) => {
    try {
      const driver = await Driver.findByPk(req.params.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      // Delete profile image if it exists and is not the default image
      if (
        driver.profileImage &&
        !driver.profileImage.includes("default-profile.png")
      ) {
        const imagePath = path.join(
          __dirname,
          "..",
          "uploads",
          "drivers",
          path.basename(driver.profileImage)
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await driver.destroy();
      res.json({ message: "Driver deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = driverController;
