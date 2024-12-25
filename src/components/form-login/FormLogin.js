import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./FormLogin.css";
import { useAuthContext } from "../../context/AuthContext";
import axios from "axios";
import { showNotification } from "../utils/Notification";
const FormLogin = () => {
  const [showpassword, setShowPassWord] = useState(false);
  const { showForm, login, setLogin, setShowForm } = useAuthContext();
  const [usernamelogin, setUsernameLogin] = useState("");
  const [passwordlogin, setPasswordLogin] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    yearOfBirth: "",
    gender: "Nam",
    address: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const formRef = useRef(null);
  // Khởi tạo state để lưu trữ năm sinh
  const [yearOfBirth, setYearOfBirth] = useState("");
  // Tạo một mảng các năm hợp lệ từ 1900 đến năm hiện tại
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1950; year--) {
    years.push(year);
  }

  // Hàm xử lý thay đổi năm sinh
  const handleYearChange = (event) => {
    setYearOfBirth(event.target.value);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false); // Close the form if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Listen for clicks outside
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up
    };
  }, [setShowForm]);
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [showForm]);
  const handleClickLogIn = async () => {
    if (usernamelogin === "") {
      showNotification("Vui lòng nhập tên đăng nhập");
      return; // Exit the function if the username is empty
    }
    if (passwordlogin === "") {
      showNotification("Vui lòng nhập mật khẩu");
      return; // Exit the function if the password is empty
    }
    try {
      // Make API request for login (replace with your API endpoint)
      const response = await axios.post(
        "http://localhost:8888/api/v1/identity-service/auth/login",
        {
          username: usernamelogin,
          password: passwordlogin,
        },
        {
          headers: {
            "Content-Type": "application/json", // Set Content-Type header
          },
        }
      );
      // Assuming the token is returned in the response
      const token = response.data.result.token;
      // Save the token in localStorage
      if (token) {
        localStorage.setItem("Access_Token", token);
        // Optionally, you could update your app's state/context to store user info or token
        setShowForm(false); // Close the login form on successful login
      }
    } catch (error) {
      console.error("Login failed:", error);
      // You can show an error message to the user, for example:
      showNotification("Thông tin đăng nhập không chính xác");
    }
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    handleClickLogIn(); // Call your login function here
  };
  const handleClickRegister = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    const { name, phoneNumber, email, gender, password, address } = formData;
    const age = new Date().getFullYear() - yearOfBirth;
    if (
      !name ||
      !phoneNumber ||
      !email ||
      !yearOfBirth ||
      !password ||
      !address
    ) {
      showNotification("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      // Make API request for registration (replace with your API endpoint)
      const response = await axios.post(
        "http://localhost:8888/api/v1/identity-service/user/create",
        {
          name,
          phoneNumber,
          email,
          address,
          age,
          gender: gender === "Nam" ? true : false,
          typeOfUser: "CUSTOMER",
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.data.code === 1000) {
        showNotification("Đăng ký thành công!");
        setShowForm(false);
      } else {
        showNotification("Đăng ký thất bại, vui lòng thử lại");
      }
    } catch (error) {
      showNotification("Đăng ký thất bại, vui lòng thử lại");
    }
  };

  return (
    <Row className="g-0">
      <Col
        ref={formRef}
        xl={4}
        className={`col-12 form-login ${
          showForm ? "form-login-show" : "form-login-hidden"
        }`}
      >
        <Row className="text-center g-0">
          <Col className="label-login" onClick={() => setLogin(true)}>
            Đăng nhập
          </Col>
          <Col className="label-register" onClick={() => setLogin(false)}>
            Đăng ký
          </Col>
        </Row>
        <Row className="g-0 line-root">
          <span
            className={`line ${login ? "line-login" : "line-register"}`}
          ></span>
        </Row>
        {showForm && login && (
          <Container className="form-login-container">
            <Row className="img-login">
              <img
                src="https://levents.asia/cdn/shop/files/L1240512-min.jpg?v=1730359132&width=500"
                alt=""
              />
            </Row>
            <Row>
              <form>
                <Row>
                  <span>Email</span>
                </Row>
                <Row className="username-input-login">
                  <Col>
                    <input
                      type="text"
                      placeholder="Email"
                      className=""
                      onChange={(e) => setUsernameLogin(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row>
                  <span>Mật Khẩu</span>
                </Row>
                <Row className="password-input-login">
                  <Col>
                    <input
                      type={showpassword ? "text" : "password"}
                      placeholder="Mật Khẩu"
                      className=""
                      onChange={(e) => setPasswordLogin(e.target.value)}
                    />
                    {showpassword ? (
                      <svg
                        class={`icon icon-eye icon-toggle-password`}
                        viewBox="0 0 16 16"
                        fill="none"
                        onClick={() => setShowPassWord(!showpassword)}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.13371 8.52295C1.95543 8.19694 1.95543 7.80297 2.13372 7.47696C3.26667 5.40535 5.4689 4 7.99998 4C10.5311 4 12.7334 5.40539 13.8663 7.47705C14.0446 7.80307 14.0446 8.19703 13.8663 8.52304C12.7333 10.5947 10.5311 12 8.00002 12C5.46891 12 3.26665 10.5946 2.13371 8.52295Z"
                          stroke="black"
                        ></path>
                        <circle cx="8" cy="8" r="2" stroke="black"></circle>
                      </svg>
                    ) : (
                      <svg
                        class={`icon icon-hide-eye icon-toggle-password`}
                        viewBox="0 0 16 16"
                        fill="none"
                        onClick={() => setShowPassWord(!showpassword)}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.6667 5.91953C13.1408 6.38179 13.5462 6.91391 13.8663 7.49921C14.0446 7.82522 14.0446 8.21919 13.8663 8.5452C12.7333 10.6168 10.5311 12.0222 8.00002 12.0222C7.42456 12.0222 6.8661 11.9495 6.33333 11.8129M3.62604 10.3938C3.02491 9.87334 2.51784 9.24752 2.13371 8.5451C1.95543 8.21909 1.95543 7.82512 2.13372 7.49912C3.26667 5.42751 5.4689 4.02216 7.99998 4.02216C8.60046 4.02216 9.18243 4.10125 9.736 4.24958C10.253 4.38811 10.7452 4.58702 11.2046 4.83827M3.62604 10.3938C3.96144 10.6841 4.32613 10.9417 4.7151 11.1614L3.62604 10.3938Z"
                          stroke="black"
                        ></path>
                        <path
                          d="M12.9761 3L2.97614 13"
                          stroke="black"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M5.99982 8.02081C5.99982 6.91624 6.89525 6.02081 7.99982 6.02081"
                          stroke="black"
                        ></path>
                      </svg>
                    )}
                  </Col>
                </Row>
                <Row>
                  <span className="forget-password">Quên Mật Khẩu?</span>
                </Row>
                <Row>
                  <Col className="btn-login text-center mx-auto">
                    <button className="btn-dark" onClick={handleSubmitLogin}>
                      ĐĂNG NHẬP
                    </button>
                  </Col>
                </Row>
              </form>
            </Row>
          </Container>
        )}
        {showForm && login === false && (
          <Container className="form-register-container">
            <Row>
              <form action="" className="form-data-register">
                <Row className="label-margin-top">
                  <span>Họ và Tên</span>
                </Row>
                <Row className="username-input-register">
                  <Col>
                    <input
                      type="text"
                      onChange={handleInputChange}
                      name="name"
                      placeholder="Họ và Tên"
                      className=""
                    />
                  </Col>
                </Row>
                <Row className="label-margin-top">
                  <span>Số điện thoại</span>
                </Row>
                <Row className="phonenumber-input-register">
                  <Col>
                    <input
                      type="text"
                      placeholder="Số điện thoại"
                      name="phoneNumber"
                      className=""
                      onChange={handleInputChange}
                    />
                  </Col>
                </Row>
                <Row className="label-margin-top">
                  <span>Email</span>
                </Row>
                <Row className="email-input-register">
                  <Col>
                    <input
                      type="text"
                      placeholder="Email"
                      className=""
                      name="email"
                      onChange={handleInputChange}
                      value={formData.email}
                    />
                  </Col>
                </Row>
                <Row className="label-margin-top">
                  <span>Địa chỉ</span>
                </Row>
                <Row className="email-input-register">
                  <Col>
                    <input
                      type="text"
                      placeholder="Địa chỉ"
                      className=""
                      name="address"
                      onChange={handleInputChange}
                      value={formData.address}
                    />
                  </Col>
                </Row>
                <Row className="label-margin-top">
                  <span>Năm sinh</span>
                </Row>
                <Row className="dob-input-register">
                  <Col>
                    <select
                      id="yearOfBirth"
                      value={yearOfBirth}
                      onChange={handleYearChange}
                    >
                      <option value="">Chọn năm sinh</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>
                <Row className="label-margin-top">
                  <span>Giới tính</span>
                </Row>
                <Row className="gender-input-register">
                  <Col>
                    <select name="gender" id="" onChange={handleInputChange}>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </Col>
                </Row>
                <Row className="label-margin-top">
                  <span>Mật khẩu</span>
                </Row>
                <Row className="password-input-register">
                  <Col>
                    <input
                      type="password"
                      placeholder="Mật khẩu"
                      onChange={handleInputChange}
                      name="password"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col className="btn-login text-center mx-auto">
                    <button className="btn-dark" onClick={handleClickRegister}>
                      ĐĂNG KÝ
                    </button>
                  </Col>
                </Row>
              </form>
            </Row>
          </Container>
        )}
        <Row className="text-center close-btn-small-screen">
          <i
            onClick={() => setShowForm(false)}
            class="fa-regular fa-circle-xmark"
          ></i>
        </Row>
      </Col>
      {showForm && <Col className="overlow"></Col>}
    </Row>
  );
};

export default FormLogin;
