import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDriverStore from "../store/useDriverStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUserTie,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import "../assets/css/Drivers.css";

function Drivers() {
  const navigate = useNavigate();
  const { drivers, deleteDriver, loading, setLoading } = useDriverStore();
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleAddClick = () => {
    navigate("/add-driver");
  };

  const handleDriverClick = (driver) => {
    if (activeMenu === driver.id) return; // Don't open modal if menu is active
    setSelectedDriver(driver);
  };

  const handleMenuClick = (e, id) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/edit-driver/${id}`);
    setActiveMenu(null);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        setLoading(true);
        await deleteDriver(id);
        setActiveMenu(null);
      } catch (error) {
        console.error("Error deleting driver:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Close menu when clicking outside
  const handleClickOutside = () => {
    if (activeMenu) {
      setActiveMenu(null);
    }
  };

  return (
    <div className="drivers-container" onClick={handleClickOutside}>
      <div className="drivers-header">
        <h1>Drivers</h1>
        <button className="add-driver-btn" onClick={handleAddClick}>
          <FontAwesomeIcon icon={faPlus} /> Add Driver
        </button>
      </div>

      {drivers.length === 0 ? (
        <div className="empty-state">
          <FontAwesomeIcon icon={faUserTie} className="empty-icon" />
          <p>No drivers available</p>
          <button className="add-first-driver-btn" onClick={handleAddClick}>
            <FontAwesomeIcon icon={faPlus} /> Add Your First Driver
          </button>
        </div>
      ) : (
        <div className="drivers-grid">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="driver-card"
              onClick={() => handleDriverClick(driver)}>
              <div className="card-header">
                <div className="driver-image">
                  <img src={driver.profileImage} alt={driver.name} />
                </div>
                <button
                  className="menu-btn"
                  onClick={(e) => handleMenuClick(e, driver.id)}
                  disabled={loading}>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
                {activeMenu === driver.id && (
                  <div className="menu-options">
                    <button onClick={(e) => handleEdit(e, driver.id)}>
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, driver.id)}
                      disabled={loading}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <div className="driver-info">
                <h3>{driver.name}</h3>
                <p>{driver.motorbikeType}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDriver && (
        <div className="modal-overlay" onClick={() => setSelectedDriver(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="driver-header">
              <img
                src={selectedDriver.profileImage}
                alt={selectedDriver.name}
                className="driver-detail-image"
              />
              <h2>{selectedDriver.name}</h2>
            </div>

            <div className="driver-info-grid">
              <div className="info-item">
                <label>Email</label>
                <p>{selectedDriver.email}</p>
              </div>
              <div className="info-item">
                <label>Phone Number</label>
                <p>{selectedDriver.phoneNumber}</p>
              </div>
              <div className="info-item">
                <label>License Plate</label>
                <p>{selectedDriver.licensePlate}</p>
              </div>
              <div className="info-item">
                <label>License Number</label>
                <p>{selectedDriver.licenseNumber}</p>
              </div>
              <div className="info-item">
                <label>Motorbike Type</label>
                <p>{selectedDriver.motorbikeType}</p>
              </div>
              <div className="info-item">
                <label>Experience</label>
                <p>{selectedDriver.experience} years</p>
              </div>
              <div className="info-item full-width">
                <label>Address</label>
                <p>{selectedDriver.address}</p>
              </div>
            </div>

            <button
              className="close-modal"
              onClick={() => setSelectedDriver(null)}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Drivers;
