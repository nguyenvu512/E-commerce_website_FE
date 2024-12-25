import React from "react";
import "./CartInfo.css";
import MoneyFormat from "../utils/MoneyFormat";
import { showNotification } from "../utils/Notification";
import { useNavigate } from "react-router-dom";

const CartInfo = ({ total, shippingFee, orderedProducts }) => {
  const navigate = useNavigate();

  const hanldePayment = () => {
    if (total === 0) {
      showNotification("Vui lòng chọn sản phẩm để thanh toán");
    } else {
      navigate("/order", { state: { orderedProducts } });
    }
  };

  return (
    <div className="cart-info">
      <span className="cart-info-title">Thông tin giỏ hàng</span>
      <hr className="m-2 ms-1 me-1"></hr>

      {/* thành tiền */}
      <div className="cart-info-price-container mb-3">
        <span className="cart-info-price-container-title">Thành tiền: </span>
        <span className="cart-info-price-container-price">
          {MoneyFormat(total)}
        </span>
      </div>

      {/* phí vận chuyển */}
      <div className="cart-info-shippingFee-container mb-3">
        <span className="cart-info-shippingFee-container-title">
          Phí vận chuyển (Giao hàng tiêu chuẩn):{" "}
        </span>
        <span className="cart-info-shippingFee-container-price">
          {MoneyFormat(shippingFee)}
        </span>
      </div>

      {/* tổng tiền */}
      <div className="cart-info-totalPrice-container mb-3">
        <span className="cart-info-totalPrice-container-title">
          Tổng số tiền:
        </span>
        <span className="cart-info-totalPrice-container-price">
          {total > 0 ? MoneyFormat(shippingFee + total) : 0}
        </span>
      </div>

      <div className="cart-info-paymentBtn-container">
        <button
          className="btn cart-info-paymentBtn"
          style={{
            backgroundColor: "black",
          }}
          onClick={hanldePayment}
        >
          THANH TOÁN
        </button>
      </div>
    </div>
  );
};
export default CartInfo;
