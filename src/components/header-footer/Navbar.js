import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Nhập Bootstrap
import "@fortawesome/fontawesome-free/css/all.min.css"; // Nhập Font Awesome
import "./Navbar.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import image from "../../images/logo/image.png"; // Nhập logo từ thư mục img

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = false; // Thay bằng trạng thái thực tế

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src={image} alt="Logo" style={{ height: "35px" }} />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${
            menuOpen ? "show" : ""
          } navbar-links`}
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contact">
                Contact
              </a>
            </li>
          </ul>
          <div className="d-flex me-2 navbar-search">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="form-control me-2 search-input"
            />
            <button className="btn search-btn" type="button">
              <i className="fas fa-search"></i>
            </button>
            <button
              className="btn cart-btn"
              type="button"
              style={{ marginLeft: "24px" }}
            >
              <i className="fas fa-shopping-cart"></i>{" "}
              {/* Biểu tượng giỏ hàng */}
            </button>
          </div>
          <div className="navbar-account">
            {isLoggedIn ? (
              <a href="/profile" className="nav-link">
                Username
              </a>
            ) : (
              <div className="navbar-account">
                <a href="/login" className="nav-link account-text">
                  Đăng nhập
                </a>
                <span className="mx-1">|</span>
                <a href="/signup" className="nav-link account-text">
                  Đăng ký
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
