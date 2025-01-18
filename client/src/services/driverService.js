import axios from "axios";

const API_URL = "http://localhost:5000/api";

const driverService = {
  // Get all drivers
  getAllDrivers: async () => {
    try {
      const response = await axios.get(`${API_URL}/drivers`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add new driver
  addDriver: async (driverData) => {
    try {
      console.log("Original driver data:", driverData);
      const formData = new FormData();

      // If profileImage is a File object, append it to formData
      if (driverData.profileImage instanceof File) {
        console.log("Appending file:", {
          name: driverData.profileImage.name,
          type: driverData.profileImage.type,
          size: driverData.profileImage.size,
        });
        formData.append("profileImage", driverData.profileImage);
      } else {
        console.log(
          "No file to upload, profileImage:",
          driverData.profileImage
        );
      }

      // Append other driver data
      Object.keys(driverData).forEach((key) => {
        if (key !== "profileImage" || !(driverData[key] instanceof File)) {
          formData.append(key, driverData[key]);
          console.log(`Appending ${key}:`, driverData[key]);
        }
      });

      console.log("Making request to:", `${API_URL}/drivers`);
      const response = await axios.post(`${API_URL}/drivers`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error.response?.data || error;
    }
  },

  // Update driver
  updateDriver: async (id, driverData) => {
    try {
      const formData = new FormData();

      // If profileImage is a File object, append it to formData
      if (driverData.profileImage instanceof File) {
        formData.append("profileImage", driverData.profileImage);
      }

      // Append other driver data
      Object.keys(driverData).forEach((key) => {
        if (key !== "profileImage" || !(driverData[key] instanceof File)) {
          formData.append(key, driverData[key]);
        }
      });

      const response = await axios.put(`${API_URL}/drivers/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete driver
  deleteDriver: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/drivers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default driverService;
