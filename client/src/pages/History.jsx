import React, { useState, useEffect } from "react";
import "../assets/css/History.css";
import historyService from "../services/historyService";
import { ClipLoader } from "react-spinners";
import driverPlaceholder from "../assets/images/driver-placeholder.png";
import { toast } from "react-hot-toast";
import { IoDocumentTextOutline } from "react-icons/io5";

const History = () => {
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await historyService.getAllHistory();
        // console.log("Fetched history:", data); fetched history data from db
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
    // console.log("Selected delivery:", delivery); selected delivery data
    setSelectedDelivery(delivery);
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

      {deliveries.length === 0 ? (
        <div className="no-history">
          <div className="no-history-content">
            <IoDocumentTextOutline className="no-history-icon" />
            <h2>No Order History</h2>
            <p>You haven't made any deliveries yet</p>
          </div>
        </div>
      ) : (
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
                    {delivery.pickupLocation || "Unknown Location"}
                  </p>
                  <span className="block-arrow">↓</span>
                  <p className="block-delivery">
                    {delivery.deliveryLocation || "Unknown Location"}
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
      )}

      {selectedDelivery && (
        <div className="history-modal-overlay" onClick={closeModal}>
          <div
            className="history-modal-content"
            onClick={(e) => e.stopPropagation()}>
            <div className="history-modal-left">
              <img
                src={driverPlaceholder}
                alt="Driver"
                className="history-modal-driver-image"
              />
              <h3>{selectedDelivery.driverName || "Driver"}</h3>
              <p className="license-plate">
                <strong>License Plate:</strong>{" "}
                {selectedDelivery.licensePlate || "N/A"}
              </p>
              <p className="motor-type">
                <strong>Vehicle:</strong>{" "}
                {selectedDelivery.motorbikeType || "N/A"}
              </p>
            </div>

            <div className="history-modal-right">
              <div className="history-location-section">
                <div className="history-pickup-info">
                  <strong>Pick-up:</strong>
                  <p>{selectedDelivery.pickupLocation || "Unknown Location"}</p>
                </div>
                <div className="history-delivery-info">
                  <strong>Delivery:</strong>
                  <p>
                    {selectedDelivery.deliveryLocation || "Unknown Location"}
                  </p>
                </div>
              </div>

              <div className="history-price-rating-section">
                <div className="history-price-info">
                  <div className="price-container">
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
                        {Number(
                          selectedDelivery.discountPrice
                        ).toLocaleString()}
                      </span>
                    </div>
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
                  <div
                    className="history-rating-info"
                    style={{ marginTop: "10px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}>
                      <strong>Rating:</strong>
                      <div className="history-stars">
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={`star ${
                              index <
                              Math.floor(Number(selectedDelivery.rating))
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
                  </div>
                )}
              </div>

              {selectedDelivery.comment && (
                <div className="history-comment-section">
                  <strong>Comment:</strong>
                  <p>{selectedDelivery.comment}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
