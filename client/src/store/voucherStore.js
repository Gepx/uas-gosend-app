import { create } from "zustand";
import { vouchers } from "../data/vouchersData";

const useVoucherStore = create((set, get) => ({
  // States
  vouchers: vouchers,
  selectedCategory: "All",
  voucherCode: "",

  // Actions
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setVoucherCode: (code) => set({ voucherCode: code }),

  // Selector for filtered vouchers
  getFilteredVouchers: () => {
    const { vouchers, selectedCategory } = get();
    return selectedCategory === "All"
      ? vouchers
      : vouchers.filter((voucher) => voucher.category === selectedCategory);
  },

  // Action for handling voucher code submission
  submitVoucherCode: () => {
    const { voucherCode } = get();
    console.log("Submitted code:", voucherCode);
    set({ voucherCode: "" }); // Reset the code after submission
  },
}));

export default useVoucherStore;
