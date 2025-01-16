const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, addressController.getAllAddresses);
router.post("/", protect, addressController.createAddress);
router.put("/:id", protect, addressController.updateAddress);
router.delete("/:id", protect, addressController.deleteAddress);

module.exports = router;
