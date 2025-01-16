const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucherController");
const { protect } = require("../middleware/authMiddleware");

// Admin routes
router.get("/admin/all", protect, voucherController.getAllGlobalVouchers);
router.post("/admin", protect, voucherController.createGlobalVoucher);
router.put("/admin/:id", protect, voucherController.updateGlobalVoucher);
router.delete("/admin/:id", protect, voucherController.deleteGlobalVoucher);

// User routes
router.get("/user", protect, voucherController.getUserVouchers);
router.post("/claim", protect, voucherController.claimVoucher);
router.post("/use/:id", protect, voucherController.useVoucher);

module.exports = router;
