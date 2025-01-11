const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

// Debug log to verify controller methods
console.log("Available controller methods:", Object.keys(addressController));

router.get("/", addressController.getAllAddresses);
router.post("/", addressController.createAddress);
router.put("/:id", addressController.updateAddress);
router.delete("/:id", addressController.deleteAddress);

module.exports = router;
