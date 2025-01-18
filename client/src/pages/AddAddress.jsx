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
    recipientName: "",
    phone: "",
    address: "",
    label: "",
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

  const handleInputChange = async (event) => {
    const query = event.target.value;
    setFormData({ ...formData, address: query });
    // Only fetch suggestions if input is not just whitespace
    if (query.trim()) {
      handleAddressSearch(query);
    } else {
      clearSuggestions();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if input value is not just whitespace
    if (!formData.address.trim()) {
      return;
    }
    try {
      setLoading(true);
      await addAddress(formData);
      navigate("/saved-address");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-form-page">
      <button
        className="back-button"
        onClick={() => navigate("/saved-address")}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>

      <div className="form-header">
        <h2>Add New Address</h2>
      </div>

      <form onSubmit={handleSubmit} className="address-form">
        <div className="form-group">
          <label>Label:</label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="e.g., Home, Office, etc."
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
            onChange={handleInputChange}
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

        <div className="form-group full-width">
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
