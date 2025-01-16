import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import "../assets/css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          GosendApp
        </Link>
        <ul className="nav-menu">
          {/* Always visible */}
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>

          {/* Only visible when authenticated */}
          {isAuthenticated && (
            <>
              <li className="nav-item">
                <Link to="/vouchers" className="nav-links">
                  Vouchers
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/saved-address" className="nav-links">
                  Saved Address
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/history" className="nav-links">
                  History
                </Link>
              </li>
            </>
          )}

          {/* Only visible for admin */}
          {isAuthenticated && isAdmin() && (
            <li className="nav-item">
              <Link to="/drivers" className="nav-links">
                Drivers
              </Link>
            </li>
          )}

          {/* Login/Logout link */}
          <li className="nav-item">
            {isAuthenticated ? (
              <Link to="/auth" onClick={handleLogout} className="nav-links">
                Logout
              </Link>
            ) : (
              <Link to="/auth" className="nav-links">
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
