const db = require("../models");
const Driver = db.Driver;

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
      const driver = await Driver.create(req.body);
      res.status(201).json(driver);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update driver
  updateDriver: async (req, res) => {
    try {
      const driver = await Driver.findByPk(req.params.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      await driver.update(req.body);
      res.json(driver);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete driver
  deleteDriver: async (req, res) => {
    try {
      const driver = await Driver.findByPk(req.params.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      await driver.destroy();
      res.json({ message: "Driver deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = driverController;
