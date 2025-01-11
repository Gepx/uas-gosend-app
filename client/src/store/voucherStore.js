import { create } from "zustand";
import voucherService from "../services/voucherService";

const useVoucherStore = create((set, get) => ({
  vouchers: [],
  selectedCategory: "All",
  voucherCode: "",
  loading: false,
  error: null,

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setVoucherCode: (code) => set({ voucherCode: code }),

  fetchVouchers: async () => {
    set({ loading: true });
    try {
      const data = await voucherService.getAllVouchers();
      set({ vouchers: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  getFilteredVouchers: () => {
    const { vouchers, selectedCategory } = get();
    if (selectedCategory === "All") return vouchers;
    return vouchers.filter((voucher) => voucher.category === selectedCategory);
  },

  submitVoucherCode: () => {
    set({ voucherCode: "" });
  },
}));

export default useVoucherStore;
