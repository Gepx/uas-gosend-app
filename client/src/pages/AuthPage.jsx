import { useState } from "react";
import Login from "../components/Login";
import SignupPage from "../components/SignupPage";
import "../assets/css/AuthPage.css";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToSignup = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="sign-up">
          {isLogin ? (
            <Login onSwitchToSignup={handleSwitchToSignup} />
          ) : (
            <SignupPage onSwitchToLogin={handleSwitchToLogin} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
