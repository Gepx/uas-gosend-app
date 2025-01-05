import { useState } from "react";
import useStore from "../store/useStore.js";
import "../assets/css/Login.css";

const LoginPage = ({ onSwitchToSignup }) => {
  const { username, password, errors, setUsername, setPassword, validate } =
    useStore();

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
    } else if (fieldName === "username") {
      return username !== "";
    }
    return false;
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username or Email</label>
              <div className="input-with-icon">
                <i className="fas fa-user icon"></i>
                <input
                  type="text"
                  id="username"
                  placeholder="Username or Email"
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
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <i className="fas fa-lock icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
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

            <button type="submit">Login</button>
          </form>
          <div className="social-login">
            <p>Or login with:</p>
            <div className="social-icons">
              <i className="fab fa-google google-icon"></i>
              <i className="fab fa-facebook-f facebook-icon"></i>
            </div>
          </div>
          <p className="signup-link">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToSignup();
              }}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
      <div className="login-right">
        <div className="content">
          <h1>Welcome Back!</h1>
          <p>Login to access your account and continue where you left off.</p>
          <img src="../images/welcome-back-image.jpg" alt="Welcome Back" />
          {/* Add any animation or additional content here */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
