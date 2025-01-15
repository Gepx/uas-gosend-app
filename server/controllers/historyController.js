const { History } = require("../models");

exports.getHistoryDetails = async (req, res) => {
  try {
    const histories = await History.findAll({
      order: [["orderDate", "DESC"]],
    });

    // No need to parse locations anymore since they're just strings
    const parsedHistories = histories.map((history) => {
      return history.get({ plain: true });
    });

    res.json(parsedHistories);
  } catch (error) {
    console.error("Error fetching history:", error);
    res
      .status(500)
      .json({ message: "Error fetching history", error: error.message });
  }
};

exports.createHistory = async (req, res) => {
  try {
    const {
      userId,
      driverId,
      driverName,
      licensePlate,
      motorbikeType,
      pickupLocation,
      deliveryLocation,
      originalPrice,
      discountPrice,
      rating,
      comment,
      status = "completed",
    } = req.body;

    // Validate required fields
    if (
      !userId ||
      !driverId ||
      !pickupLocation ||
      !deliveryLocation ||
      !originalPrice ||
      !discountPrice ||
      !driverName ||
      !licensePlate ||
      !motorbikeType
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        required: [
          "userId",
          "driverId",
          "driverName",
          "licensePlate",
          "motorbikeType",
          "pickupLocation",
          "deliveryLocation",
          "originalPrice",
          "discountPrice",
        ],
      });
    }

    const history = await History.create({
      userId,
      driverId,
      driverName,
      licensePlate,
      motorbikeType,
      pickupLocation,
      deliveryLocation,
      originalPrice,
      discountPrice,
      rating,
      comment,
      status,
      orderDate: new Date(),
    });

    res.status(201).json(history.get({ plain: true }));
  } catch (error) {
    console.error("Error creating history:", error);
    res
      .status(500)
      .json({ message: "Error creating history", error: error.message });
  }
};

exports.updateHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, status } = req.body;

    const history = await History.findByPk(id);
    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }

    await history.update({
      rating,
      comment,
      status,
    });

    res.json(history.get({ plain: true }));
  } catch (error) {
    console.error("Error updating history:", error);
    res
      .status(500)
      .json({ message: "Error updating history", error: error.message });
  }
};
