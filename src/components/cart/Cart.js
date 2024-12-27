import React, { useEffect, useState } from "react";
import "./Cart.css";
import CartItem from "./CartItem";
import CartInfo from "./CartInfo";
import axios from "axios";

const Cart = ({ deleteCartitem }) => {
  ////////////////////////////////////////////////
  // token test
  const token = localStorage.getItem("Access_Token");
  // Kiểm tra nếu token tồn tại trước khi xử lý
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

  ////////////////////////////////////////////////

  // cartItem
  const [cartItems, setCartItems] = useState([]);

  // cartItem selected
  const [cartItemsSelected, setCartItemsSelected] = useState([]);

  // gọi api lấy thông tin cart
  const [totalPrice, setTotalPrice] = useState(0);

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
          setCartItems(items);
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
  }, []);

  // hàm xử lý khi cartItem bị xóa
  const handleDelete = (productID, color, size) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.productID === productID &&
            item.color === color &&
            item.size === size
          )
      )
    );

    setCartItemsSelected((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.productID === productID &&
            item.color === color &&
            item.size === size
          )
      )
    );

    const newTotalPrice = cartItemsSelected.reduce(
      (acc, item) =>
        item.productID === productID
          ? acc
          : acc +
            item.productPrice *
              (1 - item.discountPercent / 100) *
              item.quantity,
      0
    );
    setTotalPrice(newTotalPrice);
  };

  // hàm xử lý cập nhật cartInfo khi cartItem thay đổi số lượng
  const handleChangeQuantity = (productID, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productID === productID ? { ...item, quantity: newQuantity } : item
      )
    );
    setCartItemsSelected((prevItems) =>
      prevItems.map((item) =>
        item.productID === productID ? { ...item, quantity: newQuantity } : item
      )
    );

    const newTotalPrice = cartItemsSelected.reduce(
      (acc, item) =>
        item.productID === productID
          ? acc +
            item.productPrice * (1 - item.discountPercent / 100) * newQuantity
          : acc +
            item.productPrice *
              (1 - item.discountPercent / 100) *
              item.quantity,
      0
    );
    setTotalPrice(newTotalPrice);
  };

  // biến quản lý khi tất cả sản phẩm được chọn
  const [isAllSelected, setIsAllSelected] = useState(false);

  // xử lý khi chọn tất cả sản phẩm
  const handleSelectAllItem = (event) => {
    if (event.target.checked) {
      setIsAllSelected(true);
      setCartItemsSelected(cartItems);
    } else {
      setIsAllSelected(false);
      setCartItemsSelected([]);
    }
  };

  // xử lý khi chọn mua 1 cartItem
  const handleSelectItem = (productID, color, size, isSelected) => {
    // cập nhật trạng thái "chọn tất cả"
    setIsAllSelected(
      isSelected && cartItemsSelected.length + 1 === cartItems.length
    );

    if (isSelected === true) {
      // Nếu isSelected là true, thêm item vào cartItemsSelected
      const updatedSelectedItems = cartItems.filter(
        (item) =>
          item.productID === productID &&
          item.color === color &&
          item.size === size &&
          isSelected === true
      );

      // Cập nhật trạng thái cartItemsSelected
      setCartItemsSelected((prevSelectedItems) => [
        ...prevSelectedItems, // Giữ lại các item đã được chọn trước đó
        ...updatedSelectedItems, // Thêm các item mới vào
      ]);
    } else {
      // Nếu isSelected là false, xóa item khỏi cartItemsSelected
      setCartItemsSelected((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item.productID !== productID)
      );
    }
  };

  // Tính tổng tiền khi cartItemsSelected thay đổi
  useEffect(() => {
    const newTotalPrice = cartItemsSelected.reduce(
      (acc, item) =>
        acc +
        item.productPrice * (1 - item.discountPercent / 100) * item.quantity,
      0
    );
    setTotalPrice(newTotalPrice);
  }, [cartItemsSelected]); // useEffect sẽ chạy mỗi khi cartItemsSelected thay đổi

  return (
    <div className="p-3">
      <div className="cart-title-container mb-2">
        <span style={{ fontSize: "1.2rem", fontWeight: "500" }}>
          GIỎ HÀNG ({cartItems.length} sản phẩm)
        </span>
      </div>

      <div className="cart-container">
        <div className="cart-items">
          {/* thanh navbar cart */}
          <div className="cart-navbar-container ">
            <div className="cart-navbar-checkbox">
              <input
                type="checkbox"
                className="form-check-input me-3"
                style={{ border: "1px solid black", cursor: "pointer" }}
                checked={isAllSelected}
                onChange={handleSelectAllItem}
              />
              <span style={{ fontWeight: "500" }}>Chọn tất cả</span>
            </div>
            <div className="cart-navbar-quantity">
              <span style={{ fontWeight: "500" }}>Số lượng</span>
            </div>
            <div className="cart-navbar-price">
              <span style={{ fontWeight: "500" }}>Giá tiền</span>
            </div>
          </div>
          <hr className="m-3"></hr>
          <div className="cart-items-block">
            {cartItems.map((item, index) => (
              <React.Fragment key={index}>
                <CartItem
                  productID={item.productID}
                  productName={item.productName}
                  productImage={item.productImage}
                  size={item.size}
                  color={item.color}
                  productPrice={item.productPrice}
                  quantity={item.quantity}
                  inventoryQuantity={item.inventoryQuantity}
                  discountPercent={item.discountPercent}
                  onDelete={handleDelete}
                  onQuantityChange={handleChangeQuantity}
                  selected={handleSelectItem}
                  isChecked={cartItemsSelected.some(
                    (selectedItem) =>
                      selectedItem.productID === item.productID &&
                      selectedItem.color === item.color &&
                      selectedItem.size === item.size
                  )}
                  deleteCartitem={deleteCartitem}
                />
                {index < cartItems.length - 1 && (
                  <hr
                    style={{
                      margin: "8px 18px",
                      color: "rgb(153 153 153)",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="cart-info-container">
          <CartInfo
            total={totalPrice}
            orderedProducts={cartItemsSelected}
            shippingFee={20000}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
