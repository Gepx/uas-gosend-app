import { create } from "zustand";

const usePickupStore = create((set) => ({
  pickupAddress: null,

  setPickupAddress: (address) => {
    set({
      pickupAddress: address.address,
    });
  },
}));

export default usePickupStore;
