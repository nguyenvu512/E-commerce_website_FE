import React from "react";
import MyNavbar from "../../components/header-footer/MyNavbar";
import Order from "../../components/order/Order";
import Footer from "../../components/header-footer/Footer";
const OrderPage = () => {
  return (
    <div>
      <MyNavbar></MyNavbar>
      <Order></Order>
      <Footer></Footer>
    </div>
  );
};

export default OrderPage;
