import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import motorbikeIcon from "../assets/images/scooter.png";
import driverPlaceholder from "../assets/images/driver-placeholder.png";
import "../assets/css/DeliveryTracking.css";
import RatingModal from "./RatingModal";

// Custom driver icon
const customDriverIcon = new L.Icon({
  iconUrl: motorbikeIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const DeliveryTracking = ({
  pickupLocation,
  deliveryLocation,
  onDeliveryComplete,
}) => {
  const [driverPosition, setDriverPosition] = useState(null);
  const [currentRoute, setCurrentRoute] = useState([]);
  const [remainingRoute, setRemainingRoute] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState("HEADING_TO_PICKUP");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isDeliveryComplete, setIsDeliveryComplete] = useState(false);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const animationRef = useRef(null);
  const lastUpdateTime = useRef(0);
  const ANIMATION_INTERVAL = 100; // Update every 100ms
  const TOTAL_JOURNEY_TIME = 30000; // 30 seconds to reach destination

  // Mock driver data
  const driverData = {
    name: "John Doe",
    licensePlate: "B 1234 XYZ",
    rating: 4.8,
    totalDeliveries: 1250,
    phoneNumber: "+62 812-3456-7890",
    vehicleType: "Honda PCX 160",
  };

  // Fetch route from driver to destination
  const fetchRoute = async (start, end) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      if (data.code === "Ok" && data.routes && data.routes[0]) {
        return data.routes[0].geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      return [];
    }
  };

  // Initialize driver's position and fetch initial route
  useEffect(() => {
    const randomOffset = () => (Math.random() - 0.5) * 0.01;
    const initialDriverPos = [
      pickupLocation[0] + randomOffset(),
      pickupLocation[1] + randomOffset(),
    ];
    setDriverPosition(initialDriverPos);

    fetchRoute(initialDriverPos, pickupLocation).then((routePoints) => {
      setCurrentRoute(routePoints);
      setRemainingRoute([initialDriverPos, ...routePoints]);
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [pickupLocation]);

  // Animate driver's movement along the route
  useEffect(() => {
    if (!currentRoute || currentRoute.length === 0) return;

    let startTime = performance.now();
    let step = 0;
    const totalSteps = currentRoute.length - 1;

    const animateDriver = (currentTime) => {
      if (currentTime - lastUpdateTime.current < ANIMATION_INTERVAL) {
        animationRef.current = requestAnimationFrame(animateDriver);
        return;
      }

      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / TOTAL_JOURNEY_TIME, 1);
      step = Math.floor(progress * totalSteps);

      if (step >= totalSteps) {
        if (deliveryStatus === "HEADING_TO_PICKUP") {
          setDeliveryStatus("DELIVERING");
          fetchRoute(pickupLocation, deliveryLocation).then((routePoints) => {
            setCurrentRoute(routePoints);
            setRemainingRoute([pickupLocation, ...routePoints]);
            startTime = performance.now(); // Reset start time for next journey
          });
        } else {
          // Delivery completed
          setIsDeliveryComplete(true);
          setShowRatingModal(true);
          cancelAnimationFrame(animationRef.current);
          return;
        }
      }

      if (currentRoute[step]) {
        const newPosition = currentRoute[step];
        setDriverPosition(newPosition);
        if (driverMarkerRef.current) {
          driverMarkerRef.current.setLatLng(newPosition);
        }
        setRemainingRoute([newPosition, ...currentRoute.slice(step + 1)]);
      }

      lastUpdateTime.current = currentTime;
      animationRef.current = requestAnimationFrame(animateDriver);
    };

    animationRef.current = requestAnimationFrame(animateDriver);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentRoute, deliveryStatus]);

  const handleRatingSubmit = ({ rating, comment }) => {
    // Here you would typically send the rating and comment to your backend
    console.log("Rating:", rating, "Comment:", comment);
    if (onDeliveryComplete) {
      onDeliveryComplete();
    }
  };

  const handleSkipRating = () => {
    if (onDeliveryComplete) {
      onDeliveryComplete();
    }
  };

  return (
    <div className="delivery-tracking">
      <div className="status-banner">
        {isDeliveryComplete
          ? "Delivery completed!"
          : deliveryStatus === "HEADING_TO_PICKUP"
          ? "Driver is heading to pickup location"
          : "Driver is delivering your package"}
      </div>
      <MapContainer
        ref={mapRef}
        bounds={[pickupLocation, deliveryLocation]}
        className="map-container"
        preferCanvas={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={pickupLocation}>
          <Popup>Pickup Location</Popup>
        </Marker>
        <Marker position={deliveryLocation}>
          <Popup>Delivery Location</Popup>
        </Marker>
        {driverPosition && (
          <>
            <Marker
              ref={driverMarkerRef}
              position={driverPosition}
              icon={customDriverIcon}>
              <Popup>Driver</Popup>
            </Marker>
            {remainingRoute.length > 0 && (
              <Polyline
                positions={remainingRoute}
                color="blue"
                weight={4}
                opacity={0.8}
              />
            )}
          </>
        )}
      </MapContainer>

      {/* Driver Information Card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
          height: "40%",
          margin: "20px 0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src={driverPlaceholder}
            alt="Driver"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>
              {driverData.name}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
              }}>
              <div>
                <p style={{ margin: "4px 0", color: "#666" }}>
                  <strong>License Plate:</strong> {driverData.licensePlate}
                </p>
                <p style={{ margin: "4px 0", color: "#666" }}>
                  <strong>Vehicle:</strong> {driverData.vehicleType}
                </p>
                <p style={{ margin: "4px 0", color: "#666" }}>
                  <strong>Phone:</strong> {driverData.phoneNumber}
                </p>
              </div>
              <div>
                <p style={{ margin: "4px 0", color: "#666" }}>
                  <strong>Rating:</strong>{" "}
                  <span style={{ color: "#f1c40f" }}>★</span>{" "}
                  {driverData.rating}
                </p>
                <p style={{ margin: "4px 0", color: "#666" }}>
                  <strong>Deliveries:</strong> {driverData.totalDeliveries}+
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          driverName={driverData.name}
          onSubmit={handleRatingSubmit}
          onClose={handleSkipRating}
        />
      )}
    </div>
  );
};

export default DeliveryTracking;
