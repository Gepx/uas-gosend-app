import api from "./api";

const voucherService = {
  getAllVouchers: async () => {
    try {
      const response = await api.get("/vouchers/admin/all");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch vouchers" };
    }
  },

  getUserVouchers: async () => {
    try {
      const response = await api.get("/vouchers/user");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to fetch user vouchers" }
      );
    }
  },

  claimVoucher: async (code) => {
    try {
      const response = await api.post("/vouchers/claim", { code });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw { message: "Invalid or expired voucher code" };
      } else if (error.response?.status === 400) {
        throw { message: "You have already claimed this voucher" };
      }
      throw error.response?.data || { message: "Failed to claim voucher" };
    }
  },

  useVoucher: async (id) => {
    try {
      const response = await api.post(`/vouchers/use/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw { message: "Voucher not found or already used" };
      } else if (error.response?.status === 400) {
        throw { message: "Voucher has expired" };
      }
      throw error.response?.data || { message: "Failed to use voucher" };
    }
  },
};

export default voucherService;
