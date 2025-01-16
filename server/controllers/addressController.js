const { Address } = require("../models");

const addressController = {
  // Get all addresses for the current user
  getAllAddresses: async (req, res) => {
    try {
      const addresses = await Address.findAll({
        where: { userId: req.user.id },
      });
      res.json(addresses);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching addresses", error: error.message });
    }
  },

  // Create new address for the current user
  createAddress: async (req, res) => {
    try {
      const newAddress = await Address.create({
        ...req.body,
        userId: req.user.id,
      });
      res.status(201).json(newAddress);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error creating address", error: error.message });
    }
  },

  // Update address for the current user
  updateAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const address = await Address.findOne({
        where: { id: id, userId: req.user.id },
      });

      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }

      await address.update(req.body);
      res.json(address);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error updating address", error: error.message });
    }
  },

  // Delete address for the current user
  deleteAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Address.destroy({
        where: { id: id, userId: req.user.id },
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
