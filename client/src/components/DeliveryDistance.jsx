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
import { ClipLoader } from "react-spinners";

const DeliveryDistance = ({
  pickupLocation,
  deliveryLocation,
  onBack,
  onConfirm,
}) => {
  const [routeData, setRouteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const bounds = [pickupLocation, deliveryLocation];

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          "http://localhost:5000/api/routes/calculate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pickup: pickupLocation,
              delivery: deliveryLocation,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch route");
        }

        const data = await response.json();
        setRouteData(data.route);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching route:", error);
        setError("Failed to calculate route. Please try again.");
        setIsLoading(false);
      }
    };

    fetchRoute();
  }, [pickupLocation, deliveryLocation]);

  return (
    <section className="section-distance">
      <div className="header-container">
        <IoArrowBack onClick={onBack} className="arrow-back" />
        <h1>Delivery Route</h1>
      </div>
      <div className="distance-container">
        <div className="distance-info">
          {isLoading ? (
            <div className="loading-container">
              <ClipLoader size={30} color="#007bff" />
              <p>Calculating best route...</p>
            </div>
          ) : (
            <div className="route-details">
              <p>
                Total Distance: {((routeData?.distance || 0) / 1000).toFixed(2)}{" "}
                km
              </p>
              <p>
                Estimated Time: {Math.round((routeData?.duration || 0) / 60)}{" "}
                minutes
              </p>
            </div>
          )}
        </div>
        <div className="distance-map">
          <MapContainer
            bounds={bounds}
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
            {!isLoading && routeData?.points && (
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
            onClick={() => onConfirm(routeData)}
            disabled={isLoading || !routeData}>
            Confirm Route
          </button>
        </div>
      </div>
    </section>
  );
};

export default DeliveryDistance;
