import { create } from "zustand";
import debounce from "lodash/debounce";

const useLocationStore = create((set) => {
  const debouncedFetch = debounce(async (query) => {
    if (!query) {
      set({ suggestions: [] });
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            q: query,
            format: "json",
            countrycodes: "id",
            limit: 5,
            addressdetails: 1,
            viewbox: "95.0,6.0,141.0,-11.0",
            bounded: 1,
          })
      );
      const data = await response.json();
      set({ suggestions: data });
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      set({ suggestions: [] });
    }
  }, 500);

  return {
    inputValue: "",
    suggestions: [],
    mapCenter: [3.5952, 98.6722],
    markerPosition: null,

    setInputValue: (value) => {
      set({ inputValue: value });
      if (!value) {
        set({ suggestions: [] });
      }
    },
    setSuggestions: (suggestions) => set({ suggestions }),
    setMapCenter: (center) => set({ mapCenter: center }),
    setMarkerPosition: (position) => set({ markerPosition: position }),

    fetchSuggestions: debouncedFetch,

    clearSuggestions: () => set({ suggestions: [] }),
  };
});

export default useLocationStore;
