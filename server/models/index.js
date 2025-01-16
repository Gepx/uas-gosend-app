const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config.js")["development"];
const mysql = require("mysql2/promise");

async function initializeDatabase() {
  try {
    // Create connection without database selected
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.username,
      password: config.password,
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
    console.log(`Database ${config.database} created or already exists.`);

    // Close the connection
    await connection.end();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
// Create Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
db.Address = require("./address.js")(sequelize, DataTypes);
db.Driver = require("./driver.js")(sequelize, DataTypes);
db.History = require("./history.js")(sequelize, DataTypes);
db.User = require("./user.js")(sequelize, DataTypes);
db.Voucher = require("./voucher.js")(sequelize, DataTypes);

// Define associations
db.User.hasMany(db.History);
db.History.belongsTo(db.User);

db.Driver.hasMany(db.History);
db.History.belongsTo(db.Driver);

// Corrected User associations
db.User.hasMany(db.Address);
db.Address.belongsTo(db.User);

db.User.hasMany(db.Voucher);
db.Voucher.belongsTo(db.User);

initializeDatabase();

module.exports = db;
