const fs = require("fs");
const path = require("path");

function ensureUploadsDir() {
  const uploadsDir = path.join(__dirname, "..", "uploads");
  const driversDir = path.join(uploadsDir, "drivers");

  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log("Created uploads directory");
  }

  // Create drivers directory if it doesn't exist
  if (!fs.existsSync(driversDir)) {
    fs.mkdirSync(driversDir);
    console.log("Created drivers upload directory");
  }

  // Log directory status
  console.log("Upload directories ready:");
  //   console.log("- Main uploads dir:", uploadsDir); informasi path directory yang diupload ke database
  //   console.log("- Drivers dir:", driversDir);
}

module.exports = ensureUploadsDir;
