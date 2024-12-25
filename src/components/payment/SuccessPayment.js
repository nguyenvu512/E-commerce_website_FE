import React, { useEffect, useRef } from "react";
import { CheckCircleOutlined } from "@ant-design/icons"; // Thư viện icon từ Ant Design
import MoneyFormat from "../utils/MoneyFormat";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MyNavbar from "../header-footer/MyNavbar";

const SuccessPayment = () => {
  const location = useLocation();
  const { orderId, amount } = location.state || {};
  const token = window.localStorage.getItem("Access_Token");
  const apiCalled = useRef(false); // Biến để theo dõi trạng thái gọi API
  const data = {
    orderID: orderId,
    status: "PAID",
  };

  useEffect(() => {
    if (!apiCalled.current && orderId) {
      axios
        .post(
          "http://localhost:8888/api/v1/order-service/update-status",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
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
          <CheckCircleOutlined style={styles.icon} />
          <h1 style={styles.title}>Thanh toán thành công!</h1>
          <span style={styles.message}>Mã đơn hàng: {orderId}</span>
          <br></br>
          <span style={styles.message}>Số tiền: {MoneyFormat(amount)}</span>
          <h5 style={styles.message}>
            Cám ơn bạn đã sử dụng dịch vụ của chúng tôi!!!
          </h5>
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
    backgroundColor: "rgb(229, 250, 227)", // Màu của ô (xanh nhạt)
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng
    maxWidth: "400px",
    width: "100%",
  },
  icon: {
    fontSize: "64px",
    color: "#4caf50", // Màu xanh lá cho tích
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
    lineHeight: "1.5",
  },
};

export default SuccessPayment;
