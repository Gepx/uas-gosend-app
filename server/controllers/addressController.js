const { Address } = require("../models");

const addressController = {
  // Get all addresses
  getAllAddresses: async (req, res) => {
    try {
      const addresses = await Address.findAll();
      res.json(addresses);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching addresses", error: error.message });
    }
  },

  // Create new address
  createAddress: async (req, res) => {
    try {
      const newAddress = await Address.create(req.body);
      res.status(201).json(newAddress);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error creating address", error: error.message });
    }
  },

  // Update address
  updateAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Address.update(req.body, {
        where: { id: id },
      });
      if (updated[0] === 0) {
        return res.status(404).json({ message: "Address not found" });
      }
      const updatedAddress = await Address.findByPk(id);
      res.json(updatedAddress);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error updating address", error: error.message });
    }
  },

  // Delete address
  deleteAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Address.destroy({
        where: { id: id },
      });
      if (!deleted) {
        return res.status(404).json({ message: "Address not found" });
      }
      res.json({ message: "Address deleted successfully" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error deleting address", error: error.message });
    }
  },
};

module.exports = addressController;
