module.exports = (sequelize, DataTypes) => {
  const GlobalVoucher = sequelize.define("globalVoucher", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["Food", "Car", "Bike"]],
      },
    },
    voucher: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    minPurchase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    maxDiscount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue("code", value.toUpperCase());
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });
  return GlobalVoucher;
};
