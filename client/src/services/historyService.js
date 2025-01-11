import axios from "axios";

const API_URL = "http://localhost:5000/api";

const historyService = {
  // Get all delivery history
  getAllHistory: async () => {
    try {
      const response = await axios.get(`${API_URL}/history`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Add new delivery history
  addHistory: async (historyData) => {
    try {
      const response = await axios.post(`${API_URL}/history`, historyData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Update delivery history (e.g., for rating and comments)
  updateHistory: async (id, historyData) => {
    try {
      const response = await axios.put(`${API_URL}/history/${id}`, historyData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default historyService;
