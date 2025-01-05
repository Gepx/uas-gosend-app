import { create } from "zustand";

const useStore = create((set) => ({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  errors: {},
  setUsername: (username) =>
    set((state) => ({ username, errors: { ...state.errors, username: "" } })),
  setEmail: (email) =>
    set((state) => ({ email, errors: { ...state.errors, email: "" } })),
  setPassword: (password) =>
    set((state) => ({ password, errors: { ...state.errors, password: "" } })),
  setConfirmPassword: (confirmPassword) =>
    set((state) => ({
      confirmPassword,
      errors: { ...state.errors, confirmPassword: "" },
    })),
  validate: () =>
    set((state) => {
      const errors = {};
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

      if (!state.username) errors.username = "*username is required";
      if (!state.email) errors.email = "*email is required";
      if (!state.password) {
        errors.password = "*password is required";
      } else if (!passwordRegex.test(state.password)) {
        errors.password =
          "*password must be at least 8 characters, include at least one letter and one number";
      }
      if (state.password !== state.confirmPassword)
        errors.confirmPassword = "*passwords do not match";
      return { errors };
    }),
}));

export default useStore;
