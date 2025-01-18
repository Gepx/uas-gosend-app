import React from "react";
import { Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import "../assets/css/ErrorPages.css";

const NotFound = () => {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="back-home">
          <IoHomeOutline /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
