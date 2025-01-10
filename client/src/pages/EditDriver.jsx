import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useDriverStore from "../store/useDriverStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/AddDriver.css";

const EditDriver = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { drivers, updateDriver, setLoading } = useDriverStore();
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    licensePlate: "",
    licenseNumber: "",
    motorbikeType: "",
    experience: "",
    address: "",
    profileImage: "",
  });

  useEffect(() => {
    const driverId = Number(id);
    const driver = drivers.find((d) => d.id === driverId);

    if (driver) {
      setFormData(driver);
      setImagePreview(driver.profileImage);
    } else {
      console.log("Driver not found with ID:", driverId);
      navigate("/drivers");
    }
  }, [id, drivers, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
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
      await updateDriver(Number(id), {
        ...formData,
        profileImage: imagePreview || formData.profileImage,
      });
      navigate("/drivers");
    } catch (error) {
      console.error("Error updating driver:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-driver-container">
      <button className="back-button" onClick={() => navigate("/drivers")}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>

      <div className="form-header">
        <h1>Edit Driver</h1>
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
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter driver's full name"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter driver's email"
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label>License Plate *</label>
            <input
              type="text"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              required
              placeholder="Enter vehicle license plate"
            />
          </div>

          <div className="form-group">
            <label>License Number *</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
              placeholder="Enter driver's license number"
            />
          </div>

          <div className="form-group">
            <label>Motorbike Type *</label>
            <input
              type="text"
              name="motorbikeType"
              value={formData.motorbikeType}
              onChange={handleChange}
              required
              placeholder="Enter motorbike type (e.g., Honda PCX, Honda Beat)"
            />
          </div>

          <div className="form-group">
            <label>Years of Experience</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Years of driving experience"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter driver's address"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Update Driver
        </button>
      </form>
    </div>
  );
};

export default EditDriver;
