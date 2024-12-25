import React from "react";
import MyNavbar from "../../components/header-footer/MyNavbar";
import FormLogin from "../../components/form-login/FormLogin";
import "./Home.css";
import Slide from "../../components/slide/Slide";
import ProductList from "../../components/product-list/ProductList";
import SliceScale from "../../components/slide/SileScale";
import Footer from "../../components/header-footer/Footer";
const Home = () => {
  return (
    <div>
      <MyNavbar></MyNavbar>
      <Slide></Slide>
      <ProductList title={"Sản Phẩm Hot"}></ProductList>
      <SliceScale></SliceScale>
      <ProductList title={"Bộ Sưu Tập"}></ProductList>
      <Footer></Footer>
      <FormLogin></FormLogin>
    </div>
  );
};

export default Home;
