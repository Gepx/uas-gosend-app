import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../assets/css/PickupForm.css";
import useLocationStore from "../store/locationStore"; // Zustand store

const PickupForm = ({ onSubmit }) => {
  const {
    suggestions,
    mapCenter,
    markerPosition,
    setSuggestions,
    setMapCenter,
    setMarkerPosition,
    fetchSuggestions,
  } = useLocationStore();

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = async (event) => {
    const query = event.target.value;
    setInputValue(query); // Update the input value
    fetchSuggestions(query);
  };

  const handleSuggestionClick = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    setInputValue(suggestion.display_name); // Set input to the clicked suggestion
    setMapCenter([lat, lon]);
    setMarkerPosition([lat, lon]);
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (markerPosition) {
      onSubmit(markerPosition); // Pass the marker position to the parent
    }
  };

  return (
    <>
      <section className="section-send">
        <h1>Pickup Details</h1>
        <div className="send-container">
          <div className="send-form">
            <form className="form" onSubmit={handleSubmit}>
              <label htmlFor="inputSend">Pickup at</label>
              <input
                type="text"
                id="inputSend"
                value={inputValue}
                onChange={handleInputChange}
              />
              <button type="submit">OK</button>
              <ul className="suggestions-list">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id || suggestion.osm_id}
                    onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            </form>
          </div>
          <div className="send-map">
            <MapContainer
              center={mapCenter}
              zoom={13}
              className="map-container"
              preferCanvas={true} // Use canvas for better performance
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                errorTileUrl="https://tile.openstreetmap.org/404.png" // Handle missing tiles
              />
              {markerPosition && (
                <Marker position={markerPosition}>
                  <Popup>Selected Location</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </section>
    </>
  );
};

export default PickupForm;
