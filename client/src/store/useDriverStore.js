import { create } from "zustand";

const useDriverStore = create((set) => ({
  drivers: [],
  loading: false,
  error: null,

  addDriver: (driver) =>
    set((state) => ({
      drivers: [...state.drivers, { ...driver, id: Date.now() }],
    })),

  updateDriver: (id, updatedDriver) =>
    set((state) => ({
      drivers: state.drivers.map((driver) =>
        driver.id === id ? { ...updatedDriver, id } : driver
      ),
    })),

  deleteDriver: (id) =>
    set((state) => ({
      drivers: state.drivers.filter((driver) => driver.id !== id),
    })),

  setLoading: (status) =>
    set(() => ({
      loading: status,
    })),

  setError: (error) =>
    set(() => ({
      error: error,
    })),

  resetError: () =>
    set(() => ({
      error: null,
    })),
}));

export default useDriverStore;
