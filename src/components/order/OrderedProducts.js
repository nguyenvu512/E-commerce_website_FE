import React from "react";
import OrderItem from "./OrderItem";
import "../cart/Cart.css";

const OrderedProducts = (orderedProducts) => {
  const CartItems = orderedProducts.orderedProducts || []; // Truy cập đúng vào mảng chứa trong orderedProducts

  return (
    <div
      className="container p-3 mt-2"
      style={{ backgroundColor: "white", borderRadius: 10 }}
    >
      <h4
        className="text-muted"
        style={{
          fontSize: "1.1rem",
          textAlign: "left",
          fontWeight: 700,
        }}
      >
        KIỂM TRA LẠI ĐƠN HÀNG
      </h4>
      <hr />
      <div className="cart-items-block">
        {CartItems.map((item, index) => (
          <React.Fragment key={index}>
            <OrderItem
              productName={item?.productName || ""}
              productImage={item?.productImage || ""}
              size={item?.size || ""}
              color={item?.color || ""}
              productPrice={item?.productPrice || ""}
              quantity={item?.quantity || ""}
              discountPercent={item.discountPercent || ""}
            />
            {index < CartItems.length - 1 && (
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
  );
};

export default OrderedProducts;
