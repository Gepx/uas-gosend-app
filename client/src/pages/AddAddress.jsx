import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAddressStore from "../store/addressStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/AddressForm.css";

const AddAddress = () => {
  const navigate = useNavigate();
  const { addAddress } = useAddressStore();
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    recipientName: "",
    phone: "",
    address: "",
    label: "home",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressSearch = async (query) => {
    if (query.length >= 2) {
      try {
        const response = await fetch(
          `https://us1.locationiq.com/v1/search.php?key=pk.e765e5351ef444db8417f3f8b8605b1e&q=${query}&format=json`
        );
        const data = await response.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching location data:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleAddressSelect = (suggestion) => {
    setFormData({
      ...formData,
      address: suggestion.display_name,
    });
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAddress(formData);
    navigate("/saved-address");
  };

  return (
    <div className="address-form-page">
      <div className="form-header">
        <button
          className="back-button"
          onClick={() => navigate("/saved-address")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <h2>Add New Address</h2>
      </div>

      <form onSubmit={handleSubmit} className="address-form">
        <div className="form-group">
          <label>Address Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., My Home"
            required
          />
        </div>

        <div className="form-group">
          <label>Recipient Name:</label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g., 081234567890"
            required
          />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={(e) => {
              handleChange(e);
              handleAddressSearch(e.target.value);
            }}
            placeholder="Search for address..."
            required
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleAddressSelect(suggestion)}>
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <label>Label:</label>
          <select name="label" value={formData.label} onChange={handleChange}>
            <option value="home">Home</option>
            <option value="office">Office</option>
            <option value="apartment">Apartment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notes:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes..."
          />
        </div>

        <button type="submit" className="submit-btn">
          Save Address
        </button>
      </form>
    </div>
  );
};

export default AddAddress;
