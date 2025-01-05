import { Link } from "react-router-dom";
import "../assets/css/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          GosendApp
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
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
            <Link to="/drivers" className="nav-links">
              Drivers
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/history" className="nav-links">
              History
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/auth" className="nav-links">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
