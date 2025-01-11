import { create } from "zustand";
import addressService from "../services/addressService";

const useAddressStore = create((set) => ({
  addresses: [],
  loading: false,
  error: null,

  // Fetch all addresses
  fetchAddresses: async () => {
    set({ loading: true });
    try {
      const data = await addressService.getAllAddresses();
      set({ addresses: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add new address
  addAddress: async (addressData) => {
    set({ loading: true });
    try {
      const newAddress = await addressService.addAddress(addressData);
      set((state) => ({
        addresses: [...state.addresses, newAddress],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Update address
  updateAddress: async (id, addressData) => {
    set({ loading: true });
    try {
      const updatedAddress = await addressService.updateAddress(
        id,
        addressData
      );
      set((state) => ({
        addresses: state.addresses.map((address) =>
          address.id === id ? updatedAddress : address
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Delete address
  deleteAddress: async (id) => {
    set({ loading: true });
    try {
      await addressService.deleteAddress(id);
      set((state) => ({
        addresses: state.addresses.filter((address) => address.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useAddressStore;
