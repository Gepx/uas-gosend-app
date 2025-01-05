import React, { useState } from "react";
import "../assets/css/History.css";
import { deliveryHistory } from "../data/historyData.js";

const History = () => {
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const handleCardClick = (delivery) => {
    setSelectedDelivery(delivery);
  };

  const closeModal = () => {
    setSelectedDelivery(null);
  };

  return (
    <div className="history-container">
      <h1>Delivery History</h1>

      <div className="history-grid">
        {deliveryHistory.map((delivery) => (
          <div
            key={delivery.id}
            className="history-block"
            onClick={() => handleCardClick(delivery)}>
            <div className="block-header">
              <span className={`status ${delivery.status.toLowerCase()}`}>
                {delivery.status}
              </span>
              <span className="date">
                {new Date(delivery.date).toLocaleDateString()}
              </span>
            </div>

            <div className="block-content">
              <div className="block-locations">
                <p className="block-pickup">{delivery.pickupLocation}</p>
                <span className="block-arrow">↓</span>
                <p className="block-delivery">{delivery.deliveryLocation}</p>
              </div>
              <div className="block-price">
                Rp {delivery.price.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDelivery && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-left">
              <img
                src={selectedDelivery.driverImg}
                alt="Driver"
                className="modal-driver-image"
              />
              <h3>{selectedDelivery.driverName}</h3>
              <p className="license-plate">{selectedDelivery.licensePlate}</p>
              <p className="motor-type">{selectedDelivery.motorType}</p>
            </div>

            <div className="modal-right">
              <div className="location-section">
                <div className="pickup-info">
                  <strong>Pick-up:</strong>
                  <p>{selectedDelivery.pickupLocation}</p>
                </div>
                <div className="delivery-info">
                  <strong>Delivery:</strong>
                  <p>{selectedDelivery.deliveryLocation}</p>
                </div>
              </div>

              <div className="price-rating-section">
                <div className="price-info">
                  <strong>Price:</strong>
                  <p>Rp {selectedDelivery.price.toLocaleString()}</p>
                </div>
                <div className="rating-info">
                  <strong>Rating:</strong>
                  <div className="stars">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={`star ${
                          index < Math.floor(selectedDelivery.rating)
                            ? "filled"
                            : ""
                        }`}>
                        ★
                      </span>
                    ))}
                    <span className="rating-number">
                      ({selectedDelivery.rating})
                    </span>
                  </div>
                </div>
              </div>

              <div className="comment-section">
                <strong>Comment:</strong>
                <p>{selectedDelivery.comment}</p>
              </div>

              <div className="modal-footer">
                <span
                  className={`status ${selectedDelivery.status.toLowerCase()}`}>
                  {selectedDelivery.status}
                </span>
                <span className="date">
                  {new Date(selectedDelivery.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
