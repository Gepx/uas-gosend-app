import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../assets/css/PickupForm.css";
import useLocationStore from "../store/locationStore";
import usePackageStore from "../store/packageStore";
import usePickupStore from "../store/pickupStore";

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

  const pickupAddress = usePickupStore((state) => state.pickupAddress);

  useEffect(() => {
    const searchAndUpdateMap = async (address) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
            new URLSearchParams({
              q: address,
              format: "json",
              countrycodes: "id",
              limit: 1,
              addressdetails: 1,
            })
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const location = data[0];
          const lat = parseFloat(location.lat);
          const lon = parseFloat(location.lon);
          setMapCenter([lat, lon]);
          setMarkerPosition([lat, lon]);
        }
      } catch (error) {
        console.error("Error searching location:", error);
      }
    };

    if (pickupAddress) {
      setInputValue(pickupAddress);
      // Immediately search and update map for the saved address
      searchAndUpdateMap(pickupAddress);
    } else {
      setInputValue("");
      setSuggestions([]);
      setMarkerPosition(null);
      setMapCenter([0, 0]);
    }
    setPackageType("");
    setWeight("");
  }, [pickupAddress]);

  const handleInputChange = async (event) => {
    const query = event.target.value;
    setInputValue(query);
    // Only fetch suggestions if input is not just whitespace
    if (query.trim()) {
      fetchSuggestions(query);
    } else {
      clearSuggestions();
    }
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
    // Check if input value is not just whitespace
    if (!inputValue.trim()) {
      return;
    }
    if (markerPosition && selectedPackageType && selectedWeight) {
      onSubmit({
        position: markerPosition,
        address: inputValue.trim(),
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
              key={mapCenter.join(",")}
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
