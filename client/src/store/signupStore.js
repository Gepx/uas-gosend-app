import { create } from "zustand";
import axios from "axios";

// Configure axios
const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

const useSignupStore = create((set) => ({
  // Signup state
  form: {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  errors: {},
  isLoading: false,

  // Actions
  setUsername: (username) =>
    set((state) => ({
      form: { ...state.form, username },
      errors: {}, // Clear errors when typing
    })),

  setEmail: (email) =>
    set((state) => ({
      form: { ...state.form, email },
      errors: {}, // Clear errors when typing
    })),

  setPassword: (password) =>
    set((state) => ({
      form: { ...state.form, password },
      errors: {}, // Clear errors when typing
    })),

  setConfirmPassword: (confirmPassword) =>
    set((state) => ({
      form: { ...state.form, confirmPassword },
      errors: {}, // Clear errors when typing
    })),

  // Signup function
  signup: async () => {
    try {
      set({ isLoading: true, errors: {} });

      const { form } = useSignupStore.getState();

      // Validate form
      const errors = {};
      if (!form.username) errors.username = "Username is required";
      if (!form.email) errors.email = "Email is required";
      if (!form.password) errors.password = "Password is required";
      if (form.password !== form.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (Object.keys(errors).length > 0) {
        set({ errors, isLoading: false });
        return false;
      }

      const response = await api.post("/api/auth/signup", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      if (response.data.success) {
        // Reset form after successful signup
        set({
          form: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          },
          isLoading: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Signup error:", error);
      set({
        errors: {
          [error.response?.data?.field || "general"]:
            error.response?.data?.message || "An error occurred during signup",
        },
        isLoading: false,
      });
      return false;
    }
  },

  // Reset form
  resetForm: () =>
    set({
      form: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      errors: {},
    }),
}));

export default useSignupStore;
