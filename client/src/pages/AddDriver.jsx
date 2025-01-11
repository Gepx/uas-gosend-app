import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import useDriverStore from "../store/useDriverStore";
import "../assets/css/AddDriver.css";

function AddDriver() {
  const navigate = useNavigate();
  const { addDriver, setLoading, setError, resetError } = useDriverStore();

  const [driverData, setDriverData] = useState({
    name: "",
    phoneNumber: "",
    licensePlate: "",
    motorbikeType: "",
    email: "",
    experience: "",
    address: "",
    profileImage: null,
    licenseNumber: "",
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriverData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDriverData((prev) => ({
        ...prev,
        profileImage: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      resetError();

      const driverWithImage = {
        ...driverData,
        profileImage: imagePreview || "/default-profile.png",
        createdAt: new Date().toISOString(),
      };

      addDriver(driverWithImage);
      navigate("/drivers");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-driver-container">
      <div className="form-header">
        <button className="back-button" onClick={() => navigate("/drivers")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <h1>Add New Driver</h1>
      </div>
      <form className="add-driver-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="image-upload">
            <div
              className="image-preview"
              style={{
                backgroundImage: `url(${
                  imagePreview || "/default-profile.png"
                })`,
              }}>
              {!imagePreview && <span>Upload Photo</span>}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="profile-image"
              hidden
            />
            <label htmlFor="profile-image" className="upload-button">
              Choose Photo
            </label>
          </div>

          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={driverData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter driver's full name"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={driverData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter driver's email"
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={driverData.phoneNumber}
              onChange={handleInputChange}
              required
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label>License Plate *</label>
            <input
              type="text"
              name="licensePlate"
              value={driverData.licensePlate}
              onChange={handleInputChange}
              required
              placeholder="Enter vehicle license plate"
            />
          </div>

          <div className="form-group">
            <label>License Number *</label>
            <input
              type="text"
              name="licenseNumber"
              value={driverData.licenseNumber}
              onChange={handleInputChange}
              required
              placeholder="Enter driver's license number"
            />
          </div>

          <div className="form-group">
            <label>Motorbike Type *</label>
            <input
              type="text"
              name="motorbikeType"
              value={driverData.motorbikeType}
              onChange={handleInputChange}
              required
              placeholder="Enter motorbike type (e.g., Honda PCX, Honda Beat)"
            />
          </div>

          <div className="form-group">
            <label>Years of Experience</label>
            <input
              type="number"
              name="yearExperience"
              value={driverData.yearExperience}
              onChange={handleInputChange}
              placeholder="Years of driving experience"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={driverData.address}
              onChange={handleInputChange}
              placeholder="Enter driver's address"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Add Driver
        </button>
      </form>
    </div>
  );
}

export default AddDriver;
