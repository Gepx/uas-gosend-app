const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");
const { protect } = require("../middleware/authMiddleware");

// Wrapper for async route handlers
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Routes
router.get("/", protect, asyncHandler(historyController.getHistoryDetails));
router.post("/", protect, asyncHandler(historyController.createHistory));
router.put("/:id", protect, asyncHandler(historyController.updateHistory));

module.exports = router;
