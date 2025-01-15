import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../assets/css/DeliverForm.css";
import useLocationStore from "../store/locationStore";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const DeliverForm = ({ onBack, pickupLocation }) => {
  const {
    suggestions,
    mapCenter,
    setSuggestions,
    setMapCenter,
    setMarkerPosition,
    fetchSuggestions,
  } = useLocationStore();

  const [inputValue, setInputValue] = useState("");
  const [deliveryMarker, setDeliveryMarker] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = async (event) => {
    const query = event.target.value;
    setInputValue(query);
    fetchSuggestions(query);
  };

  const handleSuggestionClick = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    setInputValue(suggestion.display_name);
    setMapCenter([lat, lon]);
    setDeliveryMarker([lat, lon]);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!deliveryMarker) return;

    // Ensure coordinates are in [lat, lon] format
    const pickupCoordinates = Array.isArray(pickupLocation.position)
      ? pickupLocation.position
      : [0, 0];
    const deliveryCoordinates = Array.isArray(deliveryMarker)
      ? deliveryMarker
      : [0, 0];

    navigate("/delivery-distance", {
      state: {
        // For route calculations and map
        pickupLocation: pickupCoordinates,
        deliveryLocation: deliveryCoordinates,
        // For history storage
        locationData: {
          pickupLocation: {
            coordinates: pickupCoordinates,
            address: pickupLocation.address,
          },
          deliveryLocation: {
            coordinates: deliveryCoordinates,
            address: inputValue,
          },
        },
      },
    });
  };

  return (
    <section className="section-deliver">
      <div className="header-container">
        <IoArrowBack onClick={onBack} className="arrow-back" />
        <h1>Delivery Details</h1>
      </div>
      <div className="deliver-container">
        <div className="deliver-map">
          <MapContainer
            center={mapCenter}
            zoom={13}
            className="map-container"
            preferCanvas={true}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              errorTileUrl="https://tile.openstreetmap.org/404.png"
            />
            {deliveryMarker && (
              <Marker position={deliveryMarker}>
                <Popup>Delivery Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        <div className="deliver-form">
          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="inputDeliver">Deliver to</label>
              <input
                type="text"
                id="inputDeliver"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter delivery address"
              />
              <ul className="suggestions-list">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id || suggestion.osm_id}
                    onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            </div>
            <button type="submit" disabled={!deliveryMarker}>
              Confirm Delivery
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DeliverForm;
