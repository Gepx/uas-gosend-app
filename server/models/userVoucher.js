module.exports = (sequelize, DataTypes) => {
  const UserVoucher = sequelize.define("userVoucher", {
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
    globalVoucherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "globalVouchers",
        key: "id",
      },
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    claimedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
  return UserVoucher;
};
