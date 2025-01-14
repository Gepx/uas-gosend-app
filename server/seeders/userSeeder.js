const { User } = require("../models");
const bcrypt = require("bcrypt");

const seedUser = async () => {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({
      where: { email: "test@example.com" },
    });

    if (!existingUser) {
      // Create test user
      const hashedPassword = await bcrypt.hash("password123", 10);
      await User.create({
        username: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        phoneNumber: "1234567890",
      });
      console.log("Test user created successfully");
    } else {
      console.log("Test user already exists");
    }
  } catch (error) {
    console.error("Error seeding user:", error);
  }
};

module.exports = seedUser;
