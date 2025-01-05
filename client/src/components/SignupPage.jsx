import { useState } from "react";
import useStore from "../store/useStore.js";
import "../assets/css/SignupPage.css";

const SignupPage = ({ onSwitchToLogin }) => {
  const {
    username,
    email,
    password,
    confirmPassword,
    errors,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPassword,
    validate,
  } = useStore();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    validate();
    if (Object.keys(errors).length === 0) {
      // Handle form submission logic here
    }
  };

  const isValid = (fieldName) => {
    if (fieldName === "password") {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return passwordRegex.test(password);
    } else if (fieldName === "confirmPassword") {
      return confirmPassword === password && confirmPassword !== "";
    } else if (fieldName === "username") {
      return username !== "";
    } else if (fieldName === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    return false;
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="content">
          <h1>Welcome to Our Platform</h1>
          <p>Sign up now and join our community!</p>
          <img src="../images/welcome-image.jpg" alt="Welcome" />
          {/* Add any animation or additional content here */}
        </div>
      </div>
      <div className="signup-right">
        <div className="signup-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="input-with-icon">
                <i className="fas fa-user icon"></i>
                <input
                  type="text"
                  id="username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {isValid("username") && (
                  <i className="fas fa-check-circle valid-icon"></i>
                )}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {isValid("email") && (
                  <i className="fas fa-check-circle valid-icon"></i>
                )}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i
                  className={`fas ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  } toggle-password`}
                  onClick={() => setShowPassword(!showPassword)}></i>
                {isValid("password") && (
                  <i className="fas fa-check-circle valid-icon"></i>
                )}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {isValid("confirmPassword") && (
                  <i className="fas fa-check-circle valid-icon"></i>
                )}
              </div>
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit">Create Account</button>
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
