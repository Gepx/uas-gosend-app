import React, { useState } from "react";
import "../assets/css/RatingModal.css";

const RatingModal = ({ driverName, onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTip, setSelectedTip] = useState(0);

  const tipOptions = [1000, 2000, 5000, 10000, 50000];

  const handleTipClick = (amount) => {
    setSelectedTip(selectedTip === amount ? 0 : amount);
  };

  const handleSubmit = () => {
    onSubmit({ rating, comment, tip: selectedTip });
  };

  return (
    <div className="rating-modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h2>Rate Your Driver</h2>
        <h3>How was your delivery with {driverName}?</h3>

        <div className="rating-container">
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? "selected" : ""}`}
                onClick={() => setRating(star)}>
                ★
              </span>
            ))}
          </div>

          <div className="tip-section">
            <p>Add a tip for your driver:</p>
            <div className="tip-buttons">
              {tipOptions.map((amount) => (
                <button
                  key={amount}
                  className={`tip-button ${
                    selectedTip === amount ? "selected" : ""
                  }`}
                  onClick={() => handleTipClick(amount)}>
                  Rp {amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="comment-input"
            placeholder="Leave a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="2"
          />

          <button className="ok-button" onClick={handleSubmit}>
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
