import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../assets/css/PickupForm.css";
import useLocationStore from "../store/locationStore";
import usePackageStore from "../store/packageStore";

const PickupForm = ({ onSubmit }) => {
  const {
    suggestions,
    mapCenter,
    markerPosition,
    setSuggestions,
    setMapCenter,
    setMarkerPosition,
    fetchSuggestions,
    inputValue,
    setInputValue,
    clearSuggestions,
  } = useLocationStore();

  const {
    selectedPackageType,
    selectedWeight,
    packageTypes,
    weightOptions,
    setPackageType,
    setWeight,
  } = usePackageStore();

  useEffect(() => {
    setInputValue("");
    setSuggestions([]);
    setMarkerPosition(null);
    setMapCenter([0, 0]);

    setPackageType("");
    setWeight("");
  }, []);

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
    setMarkerPosition([lat, lon]);
    clearSuggestions();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (markerPosition && selectedPackageType && selectedWeight) {
      onSubmit({
        position: markerPosition,
        address: inputValue,
        packageType: selectedPackageType,
        weight: selectedWeight,
      });
    }
  };

  return (
    <>
      <section className="section-send">
        <h1>Pickup Details</h1>
        <div className="send-container">
          <div className="send-form">
            <form className="form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="inputSend">Pickup at</label>
                <input
                  type="text"
                  id="inputSend"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={() => {
                    setTimeout(() => clearSuggestions(), 200);
                  }}
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
              <div className="form-group">
                <label>What kind of package?</label>
                <div className="package-button-group">
                  {packageTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`package-select-button ${
                        selectedPackageType === type ? "selected" : ""
                      }`}
                      onClick={() => setPackageType(type)}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Package Weight</label>
                <div className="package-button-group">
                  {weightOptions.map((weight) => (
                    <button
                      key={weight}
                      type="button"
                      className={`package-select-button ${
                        selectedWeight === weight ? "selected" : ""
                      }`}
                      onClick={() => setWeight(weight)}>
                      {weight}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="submit-button"
                disabled={
                  !markerPosition || !selectedPackageType || !selectedWeight
                }>
                OK
              </button>
            </form>
          </div>
          <div className="send-map">
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
