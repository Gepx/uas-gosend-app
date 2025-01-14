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

  // Apply voucher
  applyVoucher: async (req, res) => {
    try {
      const { voucherId, deliveryCost } = req.body;

      // Get voucher from database
      const voucher = await db.Voucher.findByPk(voucherId);

      if (!voucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }

      // Validate expiry
      const currentDate = new Date();
      const validUntil = new Date(voucher.validUntil);

      if (currentDate > validUntil) {
        return res.status(400).json({ message: "Voucher has expired" });
      }

      // Validate minimum purchase
      if (deliveryCost < voucher.minPurchase) {
        return res.status(400).json({
          message: `Minimum purchase required: Rp ${voucher.minPurchase.toLocaleString(
            "id-ID"
          )}`,
        });
      }

      // Calculate final cost
      const finalCost = Math.max(0, deliveryCost - voucher.price);

      return res.status(200).json({
        success: true,
        appliedVoucher: voucher,
        finalCost,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = voucherController;
