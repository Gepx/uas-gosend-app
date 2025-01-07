const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config.js")["development"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Address = require("./Address")(sequelize, DataTypes);
db.Driver = require("./Driver")(sequelize, DataTypes);
db.History = require("./History")(sequelize, DataTypes);
db.User = require("./User")(sequelize, DataTypes);

module.exports = db;
