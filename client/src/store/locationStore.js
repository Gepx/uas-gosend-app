import { create } from "zustand";

const useLocationStore = create((set) => ({
  suggestions: [],
  mapCenter: [3.5952, 98.6722], // Medan, Indonesia coordinates
  markerPosition: null,
  setSuggestions: (suggestions) => set({ suggestions }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setMarkerPosition: (position) => set({ markerPosition: position }),
  fetchSuggestions: async (query) => {
    if (query.length >= 2) {
      try {
        const response = await fetch(
          `https://us1.locationiq.com/v1/search.php?key=pk.e765e5351ef444db8417f3f8b8605b1e&q=${query}&format=json`
        );
        const data = await response.json();
        set({ suggestions: Array.isArray(data) ? data : [] });
      } catch (error) {
        console.error("Error fetching location data:", error);
        set({ suggestions: [] });
      }
    } else {
      set({ suggestions: [] });
    }
  },
}));

export default useLocationStore;
