import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./PasswordModal.css";
import axios from "axios";
import { showNotification } from "../utils/Notification";
import { jwtDecode } from "jwt-decode";

const PasswordModal = ({ setShowPasswordModal }) => {
  const [newPassType, setNewPassType] = useState(false);
  const [conformPassType, setConformPassType] = useState(false);
  const token = localStorage.getItem("Access_Token");
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [conformNewPassword, setConformNewPassword] = useState();

  const handleChangePassword = async () => {
    if (!token) {
      showNotification("Token không hợp lệ");
      return;
    }

    let tokenParse = jwtDecode(token);
    let accountID = tokenParse.accountID;

    if (!oldPassword || !newPassword || !conformNewPassword) {
      showNotification("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== conformNewPassword) {
      showNotification("Mật khẩu không khớp");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:8888/api/v1/identity-service/account/change-password",
        {
          oldPassword,
          newPassword,
          accountID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.code === 1000) {
        showNotification("Đổi mật khẩu thành công");
        setShowPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
        setConformNewPassword("");
      }
    } catch (error) {
      showNotification("Mật khẩu hiện tại không đúng");
      console.error(error);
    }
  };

  return (
    <div className="password-modal-overlow">
      <div className="password-modal">
        <Row>
          <Col className="text-center">
            <h5>ĐỔI MẬT KHẨU</h5>
          </Col>
        </Row>
        <Container>
          <Row className="g-0">
            <Col className="col-3 d-flex align-items-center justify-content-left">
              Mật khẩu hiện tại
            </Col>
            <Col className="col-9 old-password-input">
              <input
                type="password"
                className="w-100"
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="g-0 my-2">
            <Col className="col-3 d-flex align-items-center justify-content-left">
              Mật khẩu mới
            </Col>
            <Col className="col-9 new-password-input">
              {newPassType ? (
                <svg
                  className="icon icon-hide-eye"
                  viewBox="0 0 16 16"
                  fill="none"
                  onClick={() => setNewPassType(!newPassType)}
                  xmlns="http://www.w3.org/2000/svg"
                  height={25}
                  width={25}
                >
                  <path
                    d="M12.6667 5.91953C13.1408 6.38179 13.5462 6.91391 13.8663 7.49921C14.0446 7.82522 14.0446 8.21919 13.8663 8.5452C12.7333 10.6168 10.5311 12.0222 8.00002 12.0222C7.42456 12.0222 6.8661 11.9495 6.33333 11.8129M3.62604 10.3938C3.02491 9.87334 2.51784 9.24752 2.13371 8.5451C1.95543 8.21909 1.95543 7.82512 2.13372 7.49912C3.26667 5.42751 5.4689 4.02216 7.99998 4.02216C8.60046 4.02216 9.18243 4.10125 9.736 4.24958C10.253 4.38811 10.7452 4.58702 11.2046 4.83827M3.62604 10.3938C3.96144 10.6841 4.32613 10.9417 4.7151 11.1614L3.62604 10.3938Z"
                    stroke="black"
                  ></path>
                  <path
                    d="M12.9761 3L2.97614 13"
                    stroke="black"
                    strokeLineJoin="round"
                  ></path>
                  <path
                    d="M5.99982 8.02081C5.99982 6.91624 6.89525 6.02081 7.99982 6.02081"
                    stroke="black"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="icon icon-eye"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width={25}
                  height={25}
                  onClick={() => setNewPassType(!newPassType)}
                >
                  <path
                    d="M2.13371 8.52295C1.95543 8.19694 1.95543 7.80297 2.13372 7.47696C3.26667 5.40535 5.4689 4 7.99998 4C10.5311 4 12.7334 5.40539 13.8663 7.47705C14.0446 7.80307 14.0446 8.19703 13.8663 8.52304C12.7333 10.5947 10.5311 12 8.00002 12C5.46891 12 3.26665 10.5946 2.13371 8.52295Z"
                    stroke="black"
                  ></path>
                  <circle cx="8" cy="8" r="2" stroke="black"></circle>
                </svg>
              )}
              <input
                type={newPassType ? "text" : "password"}
                className="w-100"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="g-0 my-2">
            <Col className="col-3 d-flex align-items-center justify-content-left">
              Nhập lại mật khẩu
            </Col>
            <Col className="col-9 conform-new-password-input">
              <input
                type={conformPassType ? "text" : "password"}
                className="w-100"
                onChange={(e) => setConformNewPassword(e.target.value)}
              />
              {conformPassType ? (
                <svg
                  className="icon icon-hide-eye"
                  viewBox="0 0 16 16"
                  fill="none"
                  onClick={() => setConformPassType(!conformPassType)}
                  xmlns="http://www.w3.org/2000/svg"
                  height={25}
                  width={25}
                >
                  <path
                    d="M12.6667 5.91953C13.1408 6.38179 13.5462 6.91391 13.8663 7.49921C14.0446 7.82522 14.0446 8.21919 13.8663 8.5452C12.7333 10.6168 10.5311 12.0222 8.00002 12.0222C7.42456 12.0222 6.8661 11.9495 6.33333 11.8129M3.62604 10.3938C3.02491 9.87334 2.51784 9.24752 2.13371 8.5451C1.95543 8.21909 1.95543 7.82512 2.13372 7.49912C3.26667 5.42751 5.4689 4.02216 7.99998 4.02216C8.60046 4.02216 9.18243 4.10125 9.736 4.24958C10.253 4.38811 10.7452 4.58702 11.2046 4.83827M3.62604 10.3938C3.96144 10.6841 4.32613 10.9417 4.7151 11.1614L3.62604 10.3938Z"
                    stroke="black"
                  ></path>
                  <path
                    d="M12.9761 3L2.97614 13"
                    stroke="black"
                    strokeLineJoin="round"
                  ></path>
                  <path
                    d="M5.99982 8.02081C5.99982 6.91624 6.89525 6.02081 7.99982 6.02081"
                    stroke="black"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="icon icon-eye"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width={25}
                  height={25}
                  onClick={() => setConformPassType(!conformPassType)}
                >
                  <path
                    d="M2.13371 8.52295C1.95543 8.19694 1.95543 7.80297 2.13372 7.47696C3.26667 5.40535 5.4689 4 7.99998 4C10.5311 4 12.7334 5.40539 13.8663 7.47705C14.0446 7.80307 14.0446 8.19703 13.8663 8.52304C12.7333 10.5947 10.5311 12 8.00002 12C5.46891 12 3.26665 10.5946 2.13371 8.52295Z"
                    stroke="black"
                  ></path>
                  <circle cx="8" cy="8" r="2" stroke="black"></circle>
                </svg>
              )}
            </Col>
          </Row>
          <Row className="g-0 my-5 d-flex justify-content-end">
            <Col className="text-center">
              <button
                className="btn-close-password-modal"
                onClick={() => setShowPasswordModal(false)}
              >
                Đóng
              </button>
            </Col>
            <Col className="text-center">
              <button
                className="btn-change-password"
                onClick={handleChangePassword}
              >
                Đổi mật khẩu
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default PasswordModal;
