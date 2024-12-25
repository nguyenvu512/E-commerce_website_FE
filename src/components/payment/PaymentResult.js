import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Dùng để điều hướng

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Lấy các thông tin từ query string
    const transactionStatus = params.get("vnp_TransactionStatus");
    const orderInfo = params.get("vnp_OrderInfo");
    const amount = params.get("vnp_Amount");
    const orderId = params.get("vnp_TxnRef");

    if (transactionStatus === "00") {
      navigate("/payment-success", { state: { orderId, amount } });
    } else {
      navigate("/payment-fail", { state: { orderId } });
    }
  }, [location]);

  return (
    <div className="overlay">
      <div className="order-spinner"></div>
    </div>
  );
};

export default PaymentResult;
