const { History, Driver } = require("../models");

exports.getHistoryDetails = async (req, res) => {
  try {
    const histories = await History.findAll({
      include: [
        {
          model: Driver,
          attributes: [
            "id",
            "name",
            "profileImage",
            "licensePlate",
            "motorbikeType",
            "phoneNumber",
          ],
        },
      ],
      order: [["orderDate", "DESC"]],
    });

    // Parse JSON strings for locations
    const parsedHistories = histories.map((history) => {
      const plainHistory = history.get({ plain: true });
      try {
        plainHistory.pickupLocation = JSON.parse(plainHistory.pickupLocation);
        plainHistory.deliveryLocation = JSON.parse(
          plainHistory.deliveryLocation
        );
      } catch (e) {
        console.error("Error parsing location data:", e);
      }
      return plainHistory;
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
      !discountPrice
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        required: [
          "userId",
          "driverId",
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
      pickupLocation:
        typeof pickupLocation === "string"
          ? pickupLocation
          : JSON.stringify(pickupLocation),
      deliveryLocation:
        typeof deliveryLocation === "string"
          ? deliveryLocation
          : JSON.stringify(deliveryLocation),
      originalPrice,
      discountPrice,
      rating,
      comment,
      status,
      orderDate: new Date(),
    });

    // Fetch the created history with driver details
    const historyWithDriver = await History.findByPk(history.id, {
      include: [
        {
          model: Driver,
          attributes: [
            "id",
            "name",
            "profileImage",
            "licensePlate",
            "motorbikeType",
            "phoneNumber",
          ],
        },
      ],
    });

    // Parse JSON strings for response
    const plainHistory = historyWithDriver.get({ plain: true });
    try {
      plainHistory.pickupLocation = JSON.parse(plainHistory.pickupLocation);
      plainHistory.deliveryLocation = JSON.parse(plainHistory.deliveryLocation);
    } catch (e) {
      console.error("Error parsing location data:", e);
    }

    res.status(201).json(plainHistory);
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

    // Fetch the updated history with driver details
    const updatedHistory = await History.findByPk(id, {
      include: [
        {
          model: Driver,
          attributes: [
            "id",
            "name",
            "profileImage",
            "licensePlate",
            "motorbikeType",
            "phoneNumber",
          ],
        },
      ],
    });

    // Parse JSON strings for response
    const plainHistory = updatedHistory.get({ plain: true });
    try {
      plainHistory.pickupLocation = JSON.parse(plainHistory.pickupLocation);
      plainHistory.deliveryLocation = JSON.parse(plainHistory.deliveryLocation);
    } catch (e) {
      console.error("Error parsing location data:", e);
    }

    res.json(plainHistory);
  } catch (error) {
    console.error("Error updating history:", error);
    res
      .status(500)
      .json({ message: "Error updating history", error: error.message });
  }
};
