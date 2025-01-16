import { create } from "zustand";
import { persist } from "zustand/middleware";
import voucherService from "../services/voucherService";

const useVoucherStore = create(
  persist(
    (set, get) => ({
      vouchers: [],
      selectedCategory: "All",
      voucherCode: "",
      loading: false,
      error: null,
      appliedVoucher: null,
      deliveryCost: 0,
      userVouchers: [],

      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setVoucherCode: (code) => set({ voucherCode: code }),
      setDeliveryCost: (cost) => set({ deliveryCost: cost }),

      addUserVoucher: (voucher) => {
        const currentUserVouchers = get().userVouchers;
        if (!currentUserVouchers.some((v) => v.code === voucher.code)) {
          set({ userVouchers: [...currentUserVouchers, voucher] });
        }
      },

      applyVoucher: (voucher) => {
        const currentDate = new Date();
        const validUntil = new Date(voucher.validUntil);
        const deliveryCost = get().deliveryCost;

        if (currentDate > validUntil) {
          throw new Error("Voucher has expired");
        }

        if (deliveryCost < voucher.minPurchase) {
          throw new Error(
            `Minimum purchase amount is Rp ${voucher.minPurchase.toLocaleString()}`
          );
        }

        set({ appliedVoucher: voucher });
      },

      removeVoucher: () => {
        set({ appliedVoucher: null });
      },

      resetVoucherState: () => {
        set({
          appliedVoucher: null,
          deliveryCost: 0,
        });
      },

      fetchVouchers: async () => {
        set({ loading: true });
        try {
          const data = await voucherService.getAllVouchers();
          set({ vouchers: data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      claimVoucher: async (code) => {
        set({ loading: true });
        try {
          const response = await voucherService.claimVoucher(code);
          const { voucher } = response;
          get().addUserVoucher(voucher);
          set({ loading: false });
          return response;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      useVoucher: async (id) => {
        set({ loading: true });
        try {
          const response = await voucherService.useVoucher(id);
          set({ loading: false });
          return response;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      getFilteredVouchers: () => {
        const { vouchers, selectedCategory } = get();
        if (selectedCategory === "All") return vouchers;
        return vouchers.filter(
          (voucher) => voucher.category === selectedCategory
        );
      },

      submitVoucherCode: () => {
        set({ voucherCode: "" });
      },
    }),
    {
      name: "voucher-storage",
      partialize: (state) => ({
        userVouchers: state.userVouchers,
      }),
    }
  )
);

export default useVoucherStore;
