import axios from "axios";

const API_URL = "http://localhost:5000/api";

const addressService = {
  // Get all addresses
  getAllAddresses: async () => {
    try {
      const response = await axios.get(`${API_URL}/addresses`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Add new address
  addAddress: async (addressData) => {
    try {
      const transformedData = {
        label: addressData.label,
        recipientName: addressData.recipientName,
        phone: addressData.phone,
        address: addressData.address,
        notes: addressData.notes,
      };
      const response = await axios.post(
        `${API_URL}/addresses`,
        transformedData
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Update address
  updateAddress: async (id, addressData) => {
    try {
      const response = await axios.put(
        `${API_URL}/addresses/${id}`,
        addressData
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Delete address
  deleteAddress: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default addressService;
