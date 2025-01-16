import { useState } from "react";
import useSignupStore from "../store/signupStore.js";
import "../assets/css/SignupPage.css";

const SignupPage = ({ onSwitchToLogin }) => {
  const {
    form,
    errors,
    isLoading,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPassword,
    signup,
    resetForm,
  } = useSignupStore();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup();
    if (success) {
      // Show success message or toast notification
      alert("Account created successfully! Please login.");
      // Switch to login page
      resetForm();
      onSwitchToLogin();
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="content">
          <h1>Welcome to Our Platform</h1>
          <p>Sign up now and join our community!</p>
        </div>
      </div>
      <div className="signup-right">
        <div className="signup-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="input-with-icon">
                <i className="fas fa-user icon"></i>
                <input
                  type="text"
                  id="username"
                  placeholder="username"
                  value={form.username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <span className="error">{errors.username}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <i className="fas fa-envelope icon"></i>
                <input
                  type="email"
                  id="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <i className="fas fa-lock icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="password"
                  value={form.password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <i
                  className={`fas ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  } toggle-password`}
                  onClick={() => setShowPassword(!showPassword)}></i>
              </div>
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-with-icon">
                <i className="fas fa-lock icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="confirm password"
                  value={form.confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          <div className="social-login">
            <p>Or sign up with:</p>
            <div className="social-icons">
              <i className="fab fa-google google-icon"></i>
              <i className="fab fa-facebook-f facebook-icon"></i>
            </div>
          </div>
          <p className="login-link">
            Have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                resetForm();
                onSwitchToLogin();
              }}>
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
