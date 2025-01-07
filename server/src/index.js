const express = require("express");
const cors = require("cors");
const db = require("../models");
require("dotenv").config();

const app = express();

db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
