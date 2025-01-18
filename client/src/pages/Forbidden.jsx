import React from "react";
import { Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import "../assets/css/ErrorPages.css";

const Forbidden = () => {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1>403</h1>
        <h2>Access Forbidden</h2>
        <p>Sorry, you don't have permission to access this page.</p>
        <Link to="/" className="back-home">
          <IoHomeOutline /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
