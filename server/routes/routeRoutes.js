const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");

const GRAPHHOPPER_API_KEY = "80e3026c-6af5-48af-999e-5c5f73db4f80";
const GRAPHHOPPER_API_URL = "https://graphhopper.com/api/1/route";

// Cache route calculations for 24 hours
const routeCache = new NodeCache({ stdTTL: 86400 });

router.post("/calculate", async (req, res) => {
  try {
    const { pickup, delivery } = req.body;

    // Validate coordinates
    if (
      !pickup ||
      !delivery ||
      !Array.isArray(pickup) ||
      !Array.isArray(delivery)
    ) {
      return res.status(400).json({
        error: "Invalid coordinates format",
        details:
          "Both pickup and delivery must be arrays of [latitude, longitude]",
      });
    }

    // Format coordinates for GraphHopper API
    const points = [
      `point=${pickup[0]},${pickup[1]}`,
      `point=${delivery[0]},${delivery[1]}`,
    ].join("&");

    // Create a cache key from the coordinates
    const cacheKey = `${pickup.join(",")}-${delivery.join(",")}`;

    // Check cache first
    const cachedRoute = routeCache.get(cacheKey);
    if (cachedRoute) {
      return res.json({ route: cachedRoute });
    }

    // Make request to GraphHopper API
    const response = await axios.get(
      `${GRAPHHOPPER_API_URL}?${points}&vehicle=car&points_encoded=false&key=${GRAPHHOPPER_API_KEY}`
    );

    if (response.data && response.data.paths && response.data.paths[0]) {
      const path = response.data.paths[0];
      const routePoints = path.points.coordinates.map((coord) => [
        coord[1],
        coord[0],
      ]);

      const routeData = {
        distance: path.distance,
        duration: path.time / 1000,
        points: routePoints,
      };

      // Cache the result
      routeCache.set(cacheKey, routeData);

      res.json({ route: routeData });
    } else {
      throw new Error("Invalid route response from GraphHopper");
    }
  } catch (error) {
    console.error("Route calculation error:", error);
    res.status(500).json({
      error: "Failed to calculate route",
      details: error.message,
    });
  }
});

module.exports = router;
