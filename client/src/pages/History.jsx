import React, { useState, useEffect } from "react";
import "../assets/css/History.css";
import historyService from "../services/historyService";
import { ClipLoader } from "react-spinners";
import driverPlaceholder from "../assets/images/driver-placeholder.png";
import { toast } from "react-hot-toast";

const History = () => {
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await historyService.getAllHistory();
        console.log("Fetched history:", data); // Debug log
        setDeliveries(data);
      } catch (error) {
        console.error("Error fetching history:", error);
        toast.error("Failed to load delivery history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleCardClick = (delivery) => {
    console.log("Selected delivery:", delivery); // Debug log
    // Parse location data
    try {
      const parsedDelivery = {
        ...delivery,
        pickupLocation: JSON.parse(delivery.pickupLocation),
        deliveryLocation: JSON.parse(delivery.deliveryLocation),
      };
      setSelectedDelivery(parsedDelivery);
    } catch (error) {
      console.error("Error parsing delivery data:", error);
      setSelectedDelivery(delivery);
    }
  };

  const closeModal = () => {
    setSelectedDelivery(null);
  };

  if (loading) {
    return (
      <div className="history-loading">
        <ClipLoader size={40} color="#1976d2" />
        <p>Loading delivery history...</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h1>Delivery History</h1>

      <div className="history-grid">
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="history-block"
            onClick={() => handleCardClick(delivery)}>
            <div className="block-header">
              <span className={`status ${delivery.status.toLowerCase()}`}>
                {delivery.status}
              </span>
              <span className="date">
                {new Date(delivery.orderDate).toLocaleDateString()}
              </span>
            </div>

            <div className="block-content">
              <div className="block-locations">
                <p className="block-pickup">
                  {(() => {
                    try {
                      const pickup = JSON.parse(delivery.pickupLocation);
                      return pickup.address;
                    } catch (e) {
                      return "Unknown Location";
                    }
                  })()}
                </p>
                <span className="block-arrow">↓</span>
                <p className="block-delivery">
                  {(() => {
                    try {
                      const delivery_loc = JSON.parse(
                        delivery.deliveryLocation
                      );
                      return delivery_loc.address;
                    } catch (e) {
                      return "Unknown Location";
                    }
                  })()}
                </p>
              </div>
              <div className="block-price">
                {Number(delivery.originalPrice) !==
                  Number(delivery.discountPrice) && (
                  <span className="original-price">
                    Rp {Number(delivery.originalPrice).toLocaleString()}
                  </span>
                )}
                <span
                  className={
                    Number(delivery.originalPrice) !==
                    Number(delivery.discountPrice)
                      ? "discounted-price"
                      : ""
                  }>
                  Rp {Number(delivery.discountPrice).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDelivery && (
        <div className="history-modal-overlay" onClick={closeModal}>
          <div
            className="history-modal-content"
            onClick={(e) => e.stopPropagation()}>
            <div className="history-modal-left">
              <img
                src={selectedDelivery.Driver?.profileImage || driverPlaceholder}
                alt="Driver"
                className="history-modal-driver-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = driverPlaceholder;
                }}
              />
              <h3>{selectedDelivery.Driver?.name || "Driver"}</h3>
              <p className="license-plate">
                <strong>License Plate:</strong>{" "}
                {selectedDelivery.Driver?.licensePlate || "N/A"}
              </p>
              <p className="motor-type">
                <strong>Vehicle:</strong>{" "}
                {selectedDelivery.Driver?.motorbikeType || "N/A"}
              </p>
              <p className="phone-number">
                <strong>Phone:</strong>{" "}
                {selectedDelivery.Driver?.phoneNumber || "N/A"}
              </p>
            </div>

            <div className="history-modal-right">
              <div className="history-location-section">
                <div className="history-pickup-info">
                  <strong>Pick-up:</strong>
                  <p>
                    {selectedDelivery.pickupLocation?.address ||
                      "Unknown Location"}
                  </p>
                </div>
                <div className="history-delivery-info">
                  <strong>Delivery:</strong>
                  <p>
                    {selectedDelivery.deliveryLocation?.address ||
                      "Unknown Location"}
                  </p>
                </div>
              </div>

              <div className="history-price-rating-section">
                <div className="history-price-info">
                  <strong>Price:</strong>
                  <div className="price-details">
                    {Number(selectedDelivery.originalPrice) !==
                      Number(selectedDelivery.discountPrice) && (
                      <span className="original-price">
                        Rp{" "}
                        {Number(
                          selectedDelivery.originalPrice
                        ).toLocaleString()}
                      </span>
                    )}
                    <span
                      className={
                        Number(selectedDelivery.originalPrice) !==
                        Number(selectedDelivery.discountPrice)
                          ? "discounted-price"
                          : ""
                      }>
                      Rp{" "}
                      {Number(selectedDelivery.discountPrice).toLocaleString()}
                    </span>
                    {Number(selectedDelivery.discountPrice) >
                      Number(selectedDelivery.originalPrice) && (
                      <span className="tip-info">
                        (Includes Rp{" "}
                        {(
                          Number(selectedDelivery.discountPrice) -
                          Number(selectedDelivery.originalPrice)
                        ).toLocaleString()}{" "}
                        tip)
                      </span>
                    )}
                  </div>
                </div>
                {selectedDelivery.rating && (
                  <div className="history-rating-info">
                    <strong>Rating:</strong>
                    <div className="history-stars">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={`star ${
                            index < Math.floor(Number(selectedDelivery.rating))
                              ? "filled"
                              : ""
                          }`}>
                          ★
                        </span>
                      ))}
                      <span className="rating-number">
                        ({Number(selectedDelivery.rating).toFixed(1)})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {selectedDelivery.comment && (
                <div className="history-comment-section">
                  <strong>Comment:</strong>
                  <p>{selectedDelivery.comment}</p>
                </div>
              )}

              <div className="history-modal-footer">
                <span
                  className={`status ${selectedDelivery.status.toLowerCase()}`}>
                  {selectedDelivery.status}
                </span>
                <span className="date">
                  {new Date(selectedDelivery.orderDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button className="history-modal-close" onClick={closeModal}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
