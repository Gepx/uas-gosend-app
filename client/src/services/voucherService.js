import axios from "axios";

const API_URL = "http://localhost:5000/api";

const voucherService = {
  getAllVouchers: async () => {
    try {
      const response = await axios.get(`${API_URL}/vouchers`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getVoucher: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/vouchers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createVoucher: async (voucherData) => {
    try {
      const response = await axios.post(`${API_URL}/vouchers`, voucherData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default voucherService;
