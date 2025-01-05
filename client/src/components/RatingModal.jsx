import React, { useState } from "react";
import "../assets/css/RatingModal.css";

const RatingModal = ({ onSubmit, onClose, driverName }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit({ rating, comment });
  };

  return (
    <div className="modal-overlay">
      <div className="rating-modal">
        <h2>Rate Your Driver</h2>
        <p className="driver-name">How was your delivery with {driverName}?</p>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? "active" : ""}`}
              onClick={() => setRating(star)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setRating(star);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Rate ${star} stars`}>
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder="Leave a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          aria-label="Comment"
        />
        <div className="button-group">
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!rating}>
            Submit Rating
          </button>
          <button className="skip-button" onClick={onClose}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
