const db = require("../models");
const GlobalVoucher = db.GlobalVoucher;
const UserVoucher = db.UserVoucher;
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

// Admin: Get all global vouchers
exports.getAllGlobalVouchers = async (req, res) => {
  try {
    const vouchers = await GlobalVoucher.findAll();
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: Get all available global vouchers and user's claimed vouchers
exports.getUserVouchers = async (req, res) => {
  try {
    const userId = req.user.id;
    const userVouchers = await UserVoucher.findAll({
      where: { userId },
      include: [{ model: GlobalVoucher }],
    });
    res.json(userVouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: Claim a voucher using code
exports.claimVoucher = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    // Find the global voucher with case-insensitive code comparison
    const globalVoucher = await GlobalVoucher.findOne({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        validUntil: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!globalVoucher) {
      return res
        .status(404)
        .json({ message: "Invalid or expired voucher code" });
    }

    // Check if user already claimed this voucher
    const existingClaim = await UserVoucher.findOne({
      where: {
        userId,
        globalVoucherId: globalVoucher.id,
      },
    });

    if (existingClaim) {
      return res
        .status(400)
        .json({ message: "You have already claimed this voucher" });
    }

    // Create user voucher
    const userVoucher = await UserVoucher.create({
      userId,
      globalVoucherId: globalVoucher.id,
    });

    res.status(201).json({
      message: "Voucher claimed successfully",
      voucher: {
        ...globalVoucher.toJSON(),
        claimedAt: userVoucher.claimedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Create a new global voucher
exports.createGlobalVoucher = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const voucher = await GlobalVoucher.create(req.body);
    res.status(201).json(voucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update a global voucher
exports.updateGlobalVoucher = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    const voucher = await GlobalVoucher.findByPk(id);

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    await voucher.update(req.body);
    res.json(voucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete a global voucher
exports.deleteGlobalVoucher = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    const voucher = await GlobalVoucher.findByPk(id);

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    await voucher.destroy();
    res.json({ message: "Voucher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: Use a claimed voucher
exports.useVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const userVoucher = await UserVoucher.findOne({
      where: {
        id,
        userId,
        isUsed: false,
      },
      include: [{ model: GlobalVoucher }],
    });

    if (!userVoucher) {
      return res
        .status(404)
        .json({ message: "Voucher not found or already used" });
    }

    // Check if voucher is still valid
    if (new Date(userVoucher.GlobalVoucher.validUntil) < new Date()) {
      return res.status(400).json({ message: "Voucher has expired" });
    }

    await userVoucher.update({
      isUsed: true,
      usedAt: new Date(),
    });

    res.json({
      message: "Voucher used successfully",
      voucher: userVoucher,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
