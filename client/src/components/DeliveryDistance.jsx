import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IoArrowBack } from "react-icons/io5";
import "../assets/css/DeliveryDistance.css";

const DeliveryDistance = ({
  pickupLocation,
  deliveryLocation,
  onBack,
  onConfirm,
}) => {
  const [routeData, setRouteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const bounds = [pickupLocation, deliveryLocation];

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // OSRM expects coordinates in longitude,latitude order
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/` +
            `${pickupLocation[1]},${pickupLocation[0]};` +
            `${deliveryLocation[1]},${deliveryLocation[0]}` +
            `?overview=full&geometries=geojson`
        );

        const data = await response.json();
        console.log("Route data:", data);

        if (data.code === "Ok" && data.routes && data.routes[0]) {
          const route = data.routes[0];
          // Convert coordinates from [lon,lat] to [lat,lon] for Leaflet
          const routePoints = route.geometry.coordinates.map((coord) => [
            coord[1],
            coord[0],
          ]);

          setRouteData({
            distance: (route.distance / 1000).toFixed(2), // Convert to km
            time: Math.round(route.duration / 60), // Convert to minutes
            points: routePoints,
          });
        } else {
          throw new Error("No route found");
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        // Fallback to straight line
        setRouteData({
          distance: calculateStraightLineDistance(
            pickupLocation,
            deliveryLocation
          ),
          time: 0,
          points: [pickupLocation, deliveryLocation],
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (pickupLocation && deliveryLocation) {
      fetchRoute();
    }
  }, [pickupLocation, deliveryLocation]);

  const calculateStraightLineDistance = (point1, point2) => {
    const R = 6371;
    const lat1 = (point1[0] * Math.PI) / 180;
    const lat2 = (point2[0] * Math.PI) / 180;
    const deltaLat = ((point2[0] - point1[0]) * Math.PI) / 180;
    const deltaLon = ((point2[1] - point1[1]) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  const handleConfirm = () => {
    if (routeData) {
      onConfirm({
        distance: routeData.distance,
        estimatedTime: routeData.time,
        route: routeData.points,
      });
    }
  };

  return (
    <section className="section-distance">
      <div className="header-container">
        <IoArrowBack onClick={onBack} className="arrow-back" />
        <h1>Delivery Route</h1>
      </div>
      <div className="distance-container">
        <div className="distance-info">
          {isLoading ? (
            <p>Calculating route...</p>
          ) : routeData ? (
            <div className="route-details">
              <p>Total Distance: {routeData.distance} km</p>
              {routeData.time > 0 && (
                <p>Estimated Time: {routeData.time} minutes</p>
              )}
            </div>
          ) : (
            <p>Could not calculate route</p>
          )}
        </div>
        <div className="distance-map">
          <MapContainer
            bounds={bounds}
            className="map-container"
            preferCanvas={true}
            whenCreated={(map) => {
              map.fitBounds(bounds, { padding: [50, 50] });
            }}>
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
            {routeData && routeData.points && (
              <Polyline
                positions={routeData.points}
                color="blue"
                weight={4}
                opacity={0.8}
              />
            )}
          </MapContainer>
        </div>
        <div className="confirm-button-container">
          <button
            className="confirm-button"
            onClick={handleConfirm}
            disabled={isLoading || !routeData}>
            Confirm Route
          </button>
        </div>
      </div>
    </section>
  );
};

export default DeliveryDistance;
