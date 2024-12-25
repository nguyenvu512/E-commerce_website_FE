import React, { useEffect, useRef } from "react";
import { CloseCircleOutlined } from "@ant-design/icons"; // Thư viện icon từ Ant Design
import { useLocation } from "react-router-dom";
import axios from "axios";
import MyNavbar from "../header-footer/MyNavbar";

const FailedPayment = () => {
  const location = useLocation();
  const { orderId } = location.state || {};
  const token = window.localStorage.getItem("Access_Token");
  const apiCalled = useRef(false); // Biến để theo dõi trạng thái gọi API
  const data = {
    orderID: orderId,
  };

  useEffect(() => {
    if (!apiCalled.current && orderId) {
      axios
        .post("http://localhost:8888/api/v1/order-service/rollback", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.code === 1000) {
          }
        })
        .catch((error) => {});
    }
  }, [orderId, token]);
  return (
    <>
      <MyNavbar></MyNavbar>
      <div style={styles.container}>
        <div style={styles.box}>
          <CloseCircleOutlined style={styles.icon} />
          <h1 style={styles.title}>Thanh toán thất bại!</h1>
          <p style={styles.message}>
            Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên
            hệ với bộ phận hỗ trợ.
          </p>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "start",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#ffffff", // Nền trắng
    paddingTop: "90px",
  },
  box: {
    textAlign: "center",
    padding: "30px 40px",
    backgroundColor: "#ffe6e6", // Màu đỏ nhạt để hiển thị lỗi
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng
    maxWidth: "400px",
    width: "100%",
  },
  icon: {
    fontSize: "64px",
    color: "#e74c3c", // Màu đỏ cho biểu tượng lỗi
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#2c3e50",
  },
  message: {
    fontSize: "16px",
    color: "#5d6470",
    lineHeight: "1.6",
  },
};

export default FailedPayment;
