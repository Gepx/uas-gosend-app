import { create } from "zustand";

const useAuthStore = create((set) => ({
  // Auth state
  isAuthenticated: !!localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  // Login action
  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ isAuthenticated: true, user, token });
  },

  // Logout action
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ isAuthenticated: false, user: null, token: null });
  },

  // Check if user is admin
  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.isAdmin || false;
  },
}));

export default useAuthStore;
