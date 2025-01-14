const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

// Wrapper for async route handlers
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Routes
router.get("/", asyncHandler(historyController.getHistoryDetails));
router.post("/", asyncHandler(historyController.createHistory));
router.put("/:id", asyncHandler(historyController.updateHistory));

module.exports = router;
