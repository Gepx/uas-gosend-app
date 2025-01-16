import { create } from "zustand";
import axios from "axios";

// Configure axios
const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

const useLoginStore = create((set) => ({
  // Login state
  form: {
    username: "",
    password: "",
  },
  errors: {},
  isLoading: false,
  user: null,
  token: localStorage.getItem("token"),

  // Actions
  setUsername: (username) =>
    set((state) => ({
      form: { ...state.form, username },
      errors: {}, // Clear errors when typing
    })),

  setPassword: (password) =>
    set((state) => ({
      form: { ...state.form, password },
      errors: {}, // Clear errors when typing
    })),

  // Login function
  login: async () => {
    try {
      set({ isLoading: true, errors: {} });

      const { form } = useLoginStore.getState();

      if (!form.username || !form.password) {
        set({
          errors: { password: "Please enter both username and password" },
          isLoading: false,
        });
        return false;
      }

      const response = await api.post("/api/auth/login", {
        username: form.username,
        password: form.password,
      });

      const { token, user } = response.data;

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Update state
      set({
        user,
        token,
        isLoading: false,
        form: { username: "", password: "" },
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);
      set({
        errors: {
          password:
            error.response?.data?.message || "An error occurred during login",
        },
        isLoading: false,
      });
      return false;
    }
  },

  // Logout function
  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      form: { username: "", password: "" },
      errors: {},
    });
  },

  // Reset form
  resetForm: () =>
    set({
      form: { username: "", password: "" },
      errors: {},
    }),
}));

export default useLoginStore;