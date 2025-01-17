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
      originalDeliveryCost: 0,
      userVouchers: [],

      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setVoucherCode: (code) => set({ voucherCode: code }),
      setDeliveryCost: (cost) => {
        set({
          originalDeliveryCost: cost,
          deliveryCost: cost,
        });
      },

      addUserVoucher: (voucher) => {
        const currentUserVouchers = get().userVouchers;
        if (!currentUserVouchers.some((v) => v.code === voucher.code)) {
          set({ userVouchers: [...currentUserVouchers, voucher] });
        }
      },

      applyVoucher: (voucher) => {
        const currentDate = new Date();
        const validUntil = new Date(voucher.validUntil);
        const originalCost = get().originalDeliveryCost;

        if (currentDate > validUntil) {
          throw new Error("Voucher has expired");
        }

        if (originalCost < voucher.minPurchase) {
          throw new Error(
            `Minimum purchase amount is Rp ${voucher.minPurchase.toLocaleString()}`
          );
        }

        const discountedPrice = Math.max(
          0,
          originalCost - Number(voucher.price)
        );
        set({
          appliedVoucher: voucher,
          deliveryCost: discountedPrice,
        });
      },

      removeVoucher: () => {
        const originalCost = get().originalDeliveryCost;
        set({
          appliedVoucher: null,
          deliveryCost: originalCost,
        });
      },

      resetVoucherState: () => {
        const originalCost = get().originalDeliveryCost;
        set({
          appliedVoucher: null,
          deliveryCost: originalCost,
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
          set({ loading: false });
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
      getStorage: () => localStorage,
      partialize: (state) => ({
        userVouchers: state.userVouchers,
        deliveryCost: state.deliveryCost,
        originalDeliveryCost: state.originalDeliveryCost,
        appliedVoucher: state.appliedVoucher,
      }),
    }
  )
);

export default useVoucherStore;
