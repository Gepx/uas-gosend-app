import axios from "axios";

const API_URL = "http://localhost:5000/api";

const driverService = {
  // Get all drivers
  getAllDrivers: async () => {
    try {
      const response = await axios.get(`${API_URL}/drivers`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Add new driver
  addDriver: async (driverData) => {
    try {
      const response = await axios.post(`${API_URL}/drivers`, driverData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Update driver
  updateDriver: async (id, driverData) => {
    try {
      const response = await axios.put(`${API_URL}/drivers/${id}`, driverData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Delete driver
  deleteDriver: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/drivers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default driverService;
