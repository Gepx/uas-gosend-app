import { create } from "zustand";
import driverService from "../services/driverService";

const useDriverStore = create((set) => ({
  drivers: [],
  loading: false,
  error: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  resetError: () => set({ error: null }),

  // Fetch all drivers
  fetchDrivers: async () => {
    set({ loading: true });
    try {
      const data = await driverService.getAllDrivers();
      set({ drivers: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add new driver
  addDriver: async (driverData) => {
    set({ loading: true });
    try {
      const newDriver = await driverService.addDriver(driverData);
      set((state) => ({
        drivers: [...state.drivers, newDriver],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Update driver
  updateDriver: async (id, driverData) => {
    set({ loading: true });
    try {
      const updatedDriver = await driverService.updateDriver(id, driverData);
      set((state) => ({
        drivers: state.drivers.map((driver) =>
          driver.id === id ? updatedDriver : driver
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Delete driver
  deleteDriver: async (id) => {
    set({ loading: true });
    try {
      await driverService.deleteDriver(id);
      set((state) => ({
        drivers: state.drivers.filter((driver) => driver.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useDriverStore;
