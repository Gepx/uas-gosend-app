import api from "./api";

const addressService = {
  // Get all addresses
  getAllAddresses: async () => {
    try {
      const response = await api.get("/addresses");
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
      const response = await api.post("/addresses", transformedData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Update address
  updateAddress: async (id, addressData) => {
    try {
      const response = await api.put(`/addresses/${id}`, addressData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Delete address
  deleteAddress: async (id) => {
    try {
      const response = await api.delete(`/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default addressService;
