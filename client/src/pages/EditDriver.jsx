import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useDriverStore from "../store/useDriverStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/DriverForm.css";

const EditDriver = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { drivers, updateDriver, setLoading } = useDriverStore();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateDriver(Number(id), formData);
      navigate("/drivers");
    } catch (error) {
      console.error("Error updating driver:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="driver-form-page">
      <div className="form-header">
        <button className="back-button" onClick={() => navigate("/drivers")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <h2>Edit Driver</h2>
      </div>

      <form className="driver-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="licensePlate">License Plate</label>
          <input
            type="text"
            id="licensePlate"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="licenseNumber">License Number</label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="motorbikeType">Motorbike Type</label>
          <input
            type="text"
            id="motorbikeType"
            name="motorbikeType"
            value={formData.motorbikeType}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience (years)</label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="profileImage">Profile Image URL</label>
          <input
            type="url"
            id="profileImage"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Update Driver
        </button>
      </form>
    </div>
  );
};

export default EditDriver;
