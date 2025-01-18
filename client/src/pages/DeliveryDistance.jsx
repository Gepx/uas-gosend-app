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
    // Check if we're coming back from voucher page
    const isFromVoucherPage = location.state?.returnTo === "/delivery-distance";

    // Check if this is a new request by comparing with previous coordinates
    const previousPickup = localStorage.getItem("previousPickup");
    const previousDelivery = localStorage.getItem("previousDelivery");
    const isNewRequest =
      !previousPickup ||
      !previousDelivery ||
      previousPickup !== JSON.stringify(pickupLocation) ||
      previousDelivery !== JSON.stringify(deliveryLocation);

    // Store current coordinates for next comparison
    localStorage.setItem("previousPickup", JSON.stringify(pickupLocation));
    localStorage.setItem("previousDelivery", JSON.stringify(deliveryLocation));

    // Reset voucher if it's a new request and not coming from voucher page
    if (isNewRequest && !isFromVoucherPage) {
      resetVoucherState();
    }

    if (
      !pickupLocation ||
      !deliveryLocation ||
      !validateCoordinates(pickupLocation) ||
      !validateCoordinates(deliveryLocation)
    ) {
      navigate("/");
      return;
    }
  }, [
    pickupLocation,
    deliveryLocation,
    navigate,
    resetVoucherState,
    location.state,
  ]);

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

  // Combined effect to handle route fetching and price calculations
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

        // Check if we're coming back from voucher page
        const isFromVoucherPage =
          location.state?.returnTo === "/delivery-distance";

        // Only apply discount if we're returning from voucher page AND have a valid voucher with price
        if (isFromVoucherPage && appliedVoucher && appliedVoucher.price) {
          // console.log("Debug - Applied Voucher:", appliedVoucher); showing applied voucher data
          // console.log("Debug - Original Price:", roundedPrice); showing original price data

          setOriginalPrice(roundedPrice);
          setDeliveryCost(roundedPrice);

          const discountedPrice = Math.max(
            0,
            roundedPrice - appliedVoucher.price
          );
          // console.log("Debug - Discounted Price:", discountedPrice); showing discounted price data
          setPrice(discountedPrice);
        } else {
          // For new requests or when no voucher was selected
          setOriginalPrice(roundedPrice);
          setDeliveryCost(roundedPrice);
          setPrice(roundedPrice);
          // Reset voucher state if we came back without selecting a voucher
          if (isFromVoucherPage && (!appliedVoucher || !appliedVoucher.price)) {
            resetVoucherState();
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching route:", error);
        setError("Failed to calculate route. Please try again.");
        setIsLoading(false);
      }
    };

    fetchRoute();
  }, [pickupLocation, deliveryLocation]);

  // Handle price updates when voucher changes
  useEffect(() => {
    if (appliedVoucher && originalPrice) {
      const discountedPrice = Math.max(0, originalPrice - appliedVoucher.price);
      setPrice(discountedPrice);
    }
  }, [appliedVoucher, originalPrice]);

  // Handle back navigation
  const handleBack = () => {
    removeVoucher();
    navigate(-1);
  };

  const handleConfirm = () => {
    setShowConfirm(true);
  };

  const handleConfirmYes = () => {
    setShowConfirm(false);

    // Clear previous coordinates from storage
    localStorage.removeItem("previousPickup");
    localStorage.removeItem("previousDelivery");

    // Reset voucher state after order completion
    resetVoucherState();

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
        pickupLocation,
        deliveryLocation,
        originalPrice: originalPrice,
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
                    <span
                      className="original-price"
                      style={{
                        textDecoration: "line-through",
                        color: "#999",
                        marginRight: "8px",
                      }}>
                      Rp {originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span
                    className={appliedVoucher ? "discounted-price" : ""}
                    style={{
                      color: appliedVoucher ? "#4CAF50" : "#333",
                      fontWeight: "bold",
                    }}>
                    Rp {price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              className={`voucher-button ${appliedVoucher ? "applied" : ""}`}
              onClick={handleVoucherClick}>
              <IoTicketOutline />
              {/* {console.log("Debug - Render - Applied Voucher:", appliedVoucher)}  */}
              {appliedVoucher ? (
                <>
                  <span>Voucher applied - </span>
                  <span style={{ color: "#4CAF50" }}>
                    Save Rp {(originalPrice - price).toLocaleString()}
                  </span>
                </>
              ) : (
                "Use voucher?"
              )}
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
