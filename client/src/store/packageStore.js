import { create } from "zustand";

const usePackageStore = create((set) => ({
  // Package states
  selectedPackageType: null,
  selectedWeight: null,

  // Package options (could be moved to constants file if used elsewhere)
  packageTypes: ["Food", "Clothes", "Document", "Medicine", "Books", "Others"],
  weightOptions: ["1 kg", "5 kg", "10 kg"],

  // Actions
  setPackageType: (type) => set({ selectedPackageType: type }),
  setWeight: (weight) => set({ selectedWeight: weight }),
  resetPackageDetails: () =>
    set({
      selectedPackageType: null,
      selectedWeight: null,
    }),
}));

export default usePackageStore;
