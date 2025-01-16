import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLoginStore from "../store/loginStore.js";
import "../assets/css/Login.css";

const LoginPage = ({ onSwitchToSignup }) => {
  const navigate = useNavigate();
  const {
    form,
    errors,
    isLoading,
    setUsername,
    setPassword,
    login,
    resetForm,
  } = useLoginStore();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login();
    if (success) {
      navigate("/"); // or wherever you want to redirect after login
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="input-group">
              <label htmlFor="username">Username or Email</label>
              <div className="input-with-icon">
                <i className="fas fa-user icon"></i>
                <input
                  type="text"
                  id="username"
                  placeholder="Username or Email"
                  value={form.username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <i className="fas fa-lock icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
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

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
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
                resetForm();
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
          <p>
            Login to access your account and continue <br /> where you left off.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
