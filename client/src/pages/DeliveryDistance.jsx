import React, { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IoArrowBack } from "react-icons/io5";
import { IoCashOutline } from "react-icons/io5";
import { IoTicketOutline } from "react-icons/io5";
import "../assets/css/DeliveryDistance.css";
import { ClipLoader } from "react-spinners";
import { useLocation, useNavigate } from "react-router-dom";
import useVoucherStore from "../store/voucherStore";
import { toast } from "react-hot-toast";

const DeliveryDistance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickupLocation, deliveryLocation } = location.state || {};
  const [routeData, setRouteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [price, setPrice] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [originalPrice, setOriginalPrice] = useState(0);
  const { appliedVoucher, setDeliveryCost, removeVoucher, resetVoucherState } =
    useVoucherStore();

  // Price calculation constants
  const BASE_PRICE = 8000;
  const PRICE_PER_KM = 3000;

  const roundPrice = (price) => {
    return Math.ceil(price / 500) * 500;
  };

  // Validate coordinates
  const validateCoordinates = (coords) => {
    return (
      Array.isArray(coords) &&
      coords.length === 2 &&
      !isNaN(coords[0]) &&
      !isNaN(coords[1])
    );
  };

  // Redirect if no locations are provided
  useEffect(() => {
    if (
      !pickupLocation ||
      !deliveryLocation ||
      !validateCoordinates(pickupLocation) ||
      !validateCoordinates(deliveryLocation)
    ) {
      navigate("/");
      return;
    }
  }, [pickupLocation, deliveryLocation, navigate]);

  const bounds = useMemo(() => {
    if (
      !pickupLocation ||
      !deliveryLocation ||
      !validateCoordinates(pickupLocation) ||
      !validateCoordinates(deliveryLocation)
    ) {
      return null;
    }
    return [pickupLocation, deliveryLocation];
  }, [pickupLocation, deliveryLocation]);

  // Fetch route and calculate initial price
  useEffect(() => {
    const fetchRoute = async () => {
      if (
        !pickupLocation ||
        !deliveryLocation ||
        !validateCoordinates(pickupLocation) ||
        !validateCoordinates(deliveryLocation)
      ) {
        return;
      }

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

        const distanceInKm = data.route.distance / 1000;
        const calculatedPrice = BASE_PRICE + distanceInKm * PRICE_PER_KM;
        const roundedPrice = roundPrice(calculatedPrice);
        setOriginalPrice(roundedPrice);
        setPrice(roundedPrice);
        setDeliveryCost(roundedPrice);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching route:", error);
        setError("Failed to calculate route. Please try again.");
        setIsLoading(false);
      }
    };

    fetchRoute();
  }, [pickupLocation, deliveryLocation, setDeliveryCost]);

  // Reset voucher state when component mounts
  useEffect(() => {
    resetVoucherState();
  }, [resetVoucherState]);

  // Update price when voucher changes
  useEffect(() => {
    if (appliedVoucher) {
      try {
        // Apply voucher discount
        const basePrice = Number(originalPrice);
        const voucherAmount = Number(appliedVoucher.price);
        const discountedPrice = Math.max(0, basePrice - voucherAmount);
        setPrice(roundPrice(discountedPrice));
      } catch (error) {
        toast.error(error.message);
        removeVoucher();
        setPrice(originalPrice);
      }
    } else {
      setPrice(originalPrice);
    }
  }, [appliedVoucher, originalPrice, removeVoucher]);

  // Reset voucher when component unmounts
  useEffect(() => {
    return () => {
      resetVoucherState();
    };
  }, [resetVoucherState]);

  const handleBack = () => {
    removeVoucher(); // Also reset when going back
    navigate(-1);
  };

  const handleConfirm = () => {
    setShowConfirm(true);
  };

  const handleConfirmYes = () => {
    setShowConfirm(false);
    navigate("/delivery-tracking", {
      state: {
        // For map display and route calculation
        pickupLocation: location.state.locationData.pickupLocation.coordinates,
        deliveryLocation:
          location.state.locationData.deliveryLocation.coordinates,
        // For history
        pickupAddress: location.state.locationData.pickupLocation.address,
        deliveryAddress: location.state.locationData.deliveryLocation.address,
        // Price info
        price,
        originalPrice: appliedVoucher ? originalPrice : price,
      },
    });
  };

  const handleVoucherClick = () => {
    navigate("/vouchers", {
      state: {
        returnTo: "/delivery-distance",
        routeData,
        price: originalPrice,
        pickupLocation,
        deliveryLocation,
      },
    });
  };

  if (!bounds) return null;

  return (
    <section className="section-distance">
      <div className="header-container">
        <IoArrowBack onClick={handleBack} className="arrow-back" />
        <h1>Delivery Route</h1>
      </div>
      <div className="distance-container">
        <div className="distance-info">
          {isLoading ? (
            <div className="loading-container">
              <ClipLoader size={24} color="#1976d2" />
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
                color="#1976d2"
                weight={4}
                opacity={0.8}
              />
            )}
          </MapContainer>
        </div>
        <div className="bottom-section">
          <div className="payment-section">
            <div className="payment-option">
              <div className="payment-icon">
                <IoCashOutline />
              </div>
              <div className="payment-details">
                <span className="payment-label">GoPay</span>
                <div className="payment-amount">
                  {appliedVoucher && (
                    <span className="original-price">
                      Rp {originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span
                    className={appliedVoucher ? "discounted-price" : ""}
                    style={{ color: appliedVoucher ? "#4CAF50" : "#333" }}>
                    Rp {price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              className={`voucher-button ${appliedVoucher ? "applied" : ""}`}
              onClick={handleVoucherClick}>
              <IoTicketOutline />
              {appliedVoucher ? "Change voucher" : "Use voucher?"}
            </button>
          </div>
          <div className="confirm-button-container">
            <button
              className="confirm-button"
              onClick={handleConfirm}
              disabled={isLoading || !routeData}>
              Confirm booking
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Confirm Booking</h3>
            <p>Are you sure you want to proceed with this booking?</p>
            <div className="confirm-dialog-buttons">
              <button
                onClick={() => setShowConfirm(false)}
                className="cancel-button">
                Cancel
              </button>
              <button onClick={handleConfirmYes} className="proceed-button">
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DeliveryDistance;
