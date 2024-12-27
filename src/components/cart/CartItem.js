import React, { useState } from "react";
import "./CartItem.css";
// Import icon thùng rác từ react-icons
import MoneyFormat from "../utils/MoneyFormat";
import { showNotification } from "../utils/Notification";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const CartItem = ({
  productID,
  productName,
  productPrice,
  productImage,
  size,
  color,
  quantity,
  discountPercent,
  inventoryQuantity,
  onDelete,
  onQuantityChange,
  selected,
  isChecked,

  deleteCartitem,
}) => {
  const [quantityProduct, setQuantityProduct] = useState(quantity);
  const deletee = () => {
    deleteCartitem(1);
  };
  // ////////////////////////////////////////
  // trích xuất thông tin accountID trong token
  const token = localStorage.getItem("Access_Token");
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

  // function to update cartItem quantity
  const updateCartItemQuantity = (newQuantity) => {
    const payload = {
      productID: productID,
      quantity: newQuantity,
      color: color,
      size: size,
    };

    axios
      .put(
        `http://localhost:8888/api/v1/cart-service/cart/${accountID}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.code !== 1000) {
          showNotification("Cập nhật thất bại!");
          console.error("API Error:", response.data);
        }
      })
      .catch((error) => {
        showNotification("Đã xảy ra lỗi, vui lòng thử lại sau.");
        console.error(
          "Error updating cart item:",
          error.response || error.message
        );
      });
  };

  // function to delete cartItem
  const deleteCartItem = () => {
    axios
      .delete(
        `http://localhost:8888/api/v1/cart-service/cart/delete-item/${accountID}?productID=${productID}&color=${color}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.code !== 1000) {
          showNotification("Xóa sản phẩm thất bại!");
          console.error("API Error:", response.data);
        } else {
          onDelete(productID, color, size);
        }
      })
      .catch((error) => {
        showNotification("Đã xảy ra lỗi, vui lòng thử lại sau.");
        console.error(
          "Error updating cart item:",
          error.response || error.message
        );
      });

    deletee();
  };

  // handle click button increase or decrease quantity cart item
  const handleClickBtnIncreaseQuantity = () => {
    if (quantityProduct >= inventoryQuantity) {
      showNotification("Số lượng vượt quá tồn kho !");
    } else {
      setQuantityProduct(quantityProduct + 1);
      onQuantityChange(productID, quantityProduct + 1); // Gọi hàm khi số lượng thay đổi
      updateCartItemQuantity(quantityProduct + 1);
    }
  };
  const handleClickBtnDecreaseQuantity = () => {
    if (quantityProduct > 1) {
      setQuantityProduct(quantityProduct - 1);
      onQuantityChange(productID, quantityProduct - 1); // Gọi hàm khi số lượng thay đổi
      updateCartItemQuantity(quantityProduct - 1);
    } else {
      showNotification("Số lượng không được nhỏ hơn 1");
    }
  };

  // xử lý hàm checkbox item
  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      selected(productID, color, size, true);
    } else {
      selected(productID, color, size, false);
    }
  };

  return (
    <div className="cart-item">
      {/* Nút checkbox */}
      <div className="cart-item-checkbox">
        <input
          type="checkbox"
          className="form-check-input"
          style={{
            border: "1px solid black",
            height: "20px",
            width: "20px",
            cursor: "pointer",
          }}
          checked={isChecked} // Điều khiển trạng thái checkbox
          onChange={handleCheckboxChange}
        />
      </div>

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
          {MoneyFormat(productPrice * (1 - discountPercent / 100))}

          <del className="mx-1"> {MoneyFormat(productPrice)} </del>
        </span>
      </div>

      {/* khối chứa quantity và giá  */}
      <div className="cart-item-quantity-totalPrice">
        {/* Bộ điều khiển số lượng */}
        <div className="cart-item-quantity">
          <div className="cart-item-quantity-block">
            <a type="button" onClick={handleClickBtnDecreaseQuantity}>
              -
            </a>
            <input
              type="number"
              value={quantityProduct}
              onChange={(e) => {
                setQuantityProduct(parseInt(e.target.value) || quantityProduct);
              }}
            />
            <a type="button" onClick={handleClickBtnIncreaseQuantity}>
              +
            </a>
          </div>
        </div>

        {/* Giá tổng */}
        <div className="cart-item-totalPrice">
          <span style={{ fontWeight: "bold" }}>
            {MoneyFormat(
              productPrice * (1 - discountPercent / 100) * quantityProduct
            )}
          </span>
        </div>
      </div>

      {/* Xóa */}
      <div className="cart-icon-delete">
        <span
          onClick={() => {
            deleteCartItem();
          }}
        >
          <FaTrash />
        </span>
      </div>
    </div>
  );
};

export default CartItem;
