import React, { useState } from "react";
import MyNavbar from "../../components/header-footer/MyNavbar";
import Cart from "../../components/cart/Cart";
import Footer from "../../components/header-footer/Footer";
const CartPage = () => {
  const [deleteCartItem, setDeleteCartItem] = useState(false);
  const deleteCartitem = (any) => {
    setDeleteCartItem(true);
  };
  return (
    <div>
      <MyNavbar
        deleteCartItem={deleteCartItem}
        setDeleteCartItem={setDeleteCartItem}
      ></MyNavbar>
      <Cart deleteCartitem={deleteCartitem}></Cart>
      <Footer></Footer>
    </div>
  );
};

export default CartPage;
