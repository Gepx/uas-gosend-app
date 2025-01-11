const db = require("../models");
const Voucher = db.Voucher;

const voucherController = {
  // Get all vouchers
  getAllVouchers: async (req, res) => {
    try {
      const vouchers = await Voucher.findAll();
      res.json(vouchers);
    } catch (error) {
      console.error("Error in getAllVouchers:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get voucher by ID
  getVoucher: async (req, res) => {
    try {
      const voucher = await Voucher.findByPk(req.params.id);
      if (!voucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }
      res.json(voucher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create voucher
  createVoucher: async (req, res) => {
    try {
      const voucher = await Voucher.create(req.body);
      res.status(201).json(voucher);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update voucher
  updateVoucher: async (req, res) => {
    try {
      const voucher = await Voucher.findByPk(req.params.id);
      if (!voucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }
      await voucher.update(req.body);
      res.json(voucher);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete voucher
  deleteVoucher: async (req, res) => {
    try {
      const voucher = await Voucher.findByPk(req.params.id);
      if (!voucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }
      await voucher.destroy();
      res.json({ message: "Voucher deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = voucherController;
