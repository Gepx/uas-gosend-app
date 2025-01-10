const { History, Driver } = require("../models");

exports.getHistoryDetails = async (req, res) => {
  try {
    const histories = await History.findAll({
      include: [
        {
          model: Driver,
          attributes: ["name", "profileImage", "licensePlate", "vehicleType"],
        },
      ],
      order: [["orderDate", "DESC"]],
    });

    res.json(histories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching history", error: error.message });
  }
};
