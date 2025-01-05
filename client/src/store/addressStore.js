import { create } from "zustand";

const useAddressStore = create((set) => ({
  addresses: [],
  addAddress: (address) =>
    set((state) => ({
      addresses: [...state.addresses, { ...address, id: Date.now() }],
    })),
  updateAddress: (id, updatedAddress) =>
    set((state) => ({
      addresses: state.addresses.map((address) =>
        address.id === id ? { ...updatedAddress, id } : address
      ),
    })),
  deleteAddress: (id) =>
    set((state) => ({
      addresses: state.addresses.filter((address) => address.id !== id),
    })),
}));

export default useAddressStore;
