import api from "./api";

const historyService = {
  // Get all delivery history
  getAllHistory: async () => {
    try {
      const response = await api.get("/history");
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Add new delivery history
  addHistory: async (historyData) => {
    try {
      const response = await api.post("/history", historyData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Update delivery history (e.g., for rating and comments)
  updateHistory: async (id, historyData) => {
    try {
      const response = await api.put(`/history/${id}`, historyData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default historyService;
