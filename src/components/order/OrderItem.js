import React, { useState } from "react";
import "../cart/CartItem.css";
import MoneyFormat from "../utils/MoneyFormat";

const OrderItem = ({
  productName,
  productPrice,
  productImage,
  size,
  color,
  quantity,
}) => {
  // ////////////////////////////////////////
  // trích xuất thông tin accountID trong token
  const token = localStorage.getItem("authToken");
  // Tách phần payload từ token (phần thứ hai sau dấu '.')
  const payloadBase64 = token.split(".")[1];
  if (!payloadBase64) {
    console.error("Invalid token format");
  }
  // Giải mã Base64
  const payloadJson = atob(payloadBase64);
  const payload = JSON.parse(payloadJson);
  // Trích xuất accountID
  const accountID = payload.accountID; // Tùy thuộc vào key trong token
  ///////////////////////////////////////////////////
  return (
    <div className="cart-item">
      {/* Hình ảnh sản phẩm */}
      <div className="cart-item-img">
        <img src={productImage} className="cart-item-img-img" />
      </div>

      {/* Tên và giá sản phẩm */}
      <div className="cart-item-info">
        <span className="cart-item-info-nameProduct">{productName}</span>
        <span className="cart-item-info-price text-muted">{color}</span>
        <span className="cart-item-info-price text-muted">{size}</span>
        <span className="cart-item-info-price text-muted">
          {MoneyFormat(productPrice)}
        </span>
      </div>

      {/* Bộ điều khiển số lượng */}
      <div className="cart-item-quantity">
        <div className="cart-item-quantity-block" style={{ border: "none" }}>
          <input type="number" value={quantity} onChange={() => {}} />
        </div>
      </div>

      {/* khối chứa quantity và giá  */}
      <div className="cart-item-quantity-totalPrice">
        {/* Giá tổng */}
        <div className="cart-item-totalPrice">
          <span style={{ fontWeight: "bold" }}>
            {MoneyFormat(productPrice * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
