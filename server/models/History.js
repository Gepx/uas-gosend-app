module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define("history", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "drivers",
        key: "id",
      },
    },
    driverName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    motorbikeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pickupLocation: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    deliveryLocation: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    discountPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "ongoing", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  return History;
};
