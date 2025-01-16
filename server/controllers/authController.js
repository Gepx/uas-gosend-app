const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op } = require("sequelize");
const JWT_CONFIG = require("../config/jwt.config");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_CONFIG.secret,
    JWT_CONFIG.options
  );
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email: username }],
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Username and password do not match",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Username and password do not match",
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.username === username
            ? "Username already exists"
            : "Email already exists",
      });
    }

    // Hash password with bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (isAdmin will default to false)
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: error.errors.map((e) => e.message),
      });
    }
    res.status(500).json({
      success: false,
      message: "An error occurred during signup",
    });
  }
};

module.exports = {
  login,
  signup,
};
