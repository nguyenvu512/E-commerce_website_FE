import React, { useEffect, useState } from "react";
import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import logo from "../../images/logo/image.png";
import "./MyNavbar.css";
import { useAuthContext } from "../../context/AuthContext";
import SearchItemList from "../searchitem-list/SearchItemList";
import { showNotification } from "../utils/Notification";
import { jwtDecode } from "jwt-decode";
import InfoModal from "../modal/InfoModal";
import axios from "axios";
import PasswordModal from "../modal/PasswordModal";

const MyNavbar = ({ cartItem, deleteCartItem, setDeleteCartItem }) => {
  const [searchInput, setSearchInput] = useState("");
  const { toggleLoginForm, toggleRegisterForm } = useAuthContext();
  const [username, setUsername] = useState();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPasswordModal, setShowPassWordModal] = useState(false);
  const [showtools, setShowTools] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [showNotificationFlag, setShowNotificationFlag] = useState(false); // state for showing notification
  const token = localStorage.getItem("Access_Token");

  // get cart quantity
  const [cartCount, setCartCount] = useState(
    cartItem !== undefined ? cartItem : 0
  );
  useEffect(() => {
    setCartCount(cartItem);
    if (deleteCartItem !== undefined && deleteCartItem === true) {
      setCartCount(cartCount - 1);
      setDeleteCartItem(false);
    }
  }, [cartItem, deleteCartItem]);

  let accountID = null;
  if (token != null) {
    try {
      // Trích xuất thông tin accountID trong token
      const payloadBase64 = token.split(".")[1];
      if (!payloadBase64) {
        console.error("Invalid token format");
      } else {
        // Giải mã Base64
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        // Trích xuất accountID
        accountID = payload.accountID; // Tùy thuộc vào key trong token
      }
    } catch (error) {
      console.error("Error parsing token:", error);
    }
  } else {
    console.error("No token found in localStorage");
  }
  useEffect(() => {
    axios
      .get(`http://localhost:8888/api/v1/cart-service/cart/get/${accountID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.code === 1000) {
          const items = response.data.result.items;
          setCartCount(items.length);
        } else {
          console.error("Lỗi khi gọi api cart:", response.data);
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching cart info:",
          error.response || error.message
        );
      });
  }, [cartCount]);

  useEffect(() => {
    if (token != null) {
      const usernamefromtoken = jwtDecode(token);
      setUsername(usernamefromtoken.name);
    }
  }, [token]);

  useEffect(() => {
    if (token !== null) {
      const tokenParse = jwtDecode(token);
      const userID = tokenParse.userID;

      axios
        .get(
          `http://localhost:8888/api/v1/identity-service/user/fbid/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (
            response.data.code === 1000 &&
            response.data.result.id === userID
          ) {
            setUserInfo(response.data.result);
          } else {
            console.error("Lỗi từ API:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error.response || error.message);
        });
    }
  }, [token]);

  useEffect(() => {
    if (showInfoModal || showPasswordModal) {
      setShowTools(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [showInfoModal, showPasswordModal]);

  // Handle Cart click logic
  const handleCartClick = () => {
    if (token != null) {
      window.location.href = "/cart";
    } else {
      setShowNotificationFlag(true);
    }
  };

  // Show notification if needed in a `useEffect`
  useEffect(() => {
    if (showNotificationFlag) {
      showNotification("Vui lòng đăng nhập");
      setShowNotificationFlag(false); // Reset state after showing notification
    }
  }, [showNotificationFlag]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <Navbar
        style={{
          position: "sticky",
          width: "100%",
          top: 0,
          zIndex: "3",
        }}
        bg="light"
        expand="lg"
      >
        <Container className="navbar-container">
          <Navbar.Brand href="/">
            <img src={logo} alt="Logo" style={{ height: "40px" }} />
          </Navbar.Brand>
          <Col className="box-auth-small-screen">
            <div>
              <i
                className="fa-solid fa-cart-shopping"
                onClick={handleCartClick}
              ></i>
            </div>
            <div>
              <i className="fa-solid fa-bell"></i>
            </div>
            <div className="icon-auth">
              <i className="fa-solid fa-user" onClick={toggleLoginForm}></i>
            </div>
          </Col>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="#">About</Nav.Link>
              <Nav.Link href="/product/all">Product</Nav.Link>
              <Nav.Link href="#">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Col className="box-search">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="button">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <SearchItemList
              name={searchInput !== "*" && searchInput}
            ></SearchItemList>
          </Col>
          <Col className="box-auth">
            <div style={{ position: "relative", display: "inline-block" }}>
              <i
                className="fa-solid fa-cart-shopping"
                onClick={handleCartClick}
              ></i>
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-11px",
                    backgroundColor: "black",
                    opacity: "0.9",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>

            <div>
              <i className="fa-solid fa-bell"></i>
            </div>
            <div className="icon-auth">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="label-auth">
              {token != null ? (
                <div className="box-islogin">
                  <span
                    className="islogin"
                    onClick={() => setShowTools(!showtools)}
                  >
                    Xin chào {username} !
                  </span>
                  {showtools && (
                    <div className="tools">
                      <li onClick={() => setShowInfoModal(true)}>
                        Thông tin cá nhân
                      </li>
                      <li>Lịch sử mua hàng</li>
                      <li onClick={() => setShowPassWordModal(true)}>
                        Đổi mật khẩu
                      </li>
                      <li onClick={handleLogout}>Đăng xuất</li>
                    </div>
                  )}
                </div>
              ) : (
                <div className="login">
                  <span onClick={toggleLoginForm}>Đăng nhập</span>
                  <span onClick={toggleRegisterForm}>Đăng ký</span>
                </div>
              )}
            </div>
          </Col>
        </Container>
      </Navbar>
      <Container className="box-search-small-screen">
        <Row className="g-1">
          <Col className="col-11">
            <input type="text" placeholder="Tìm kiếm sản phẩm..." />
          </Col>
          <Col className="col-1 text-center btn-search-small-screen">
            <i className="fa-solid fa-magnifying-glass"></i>
          </Col>
        </Row>
      </Container>
      {showInfoModal && (
        <InfoModal userInfo={userInfo} setShowInfoModal={setShowInfoModal} />
      )}
      {showPasswordModal && (
        <PasswordModal setShowPasswordModal={setShowPassWordModal} />
      )}
    </>
  );
};

export default MyNavbar;
