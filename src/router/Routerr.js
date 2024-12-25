import React from "react";
import { useRoutes } from "react-router-dom";
import Home from "../pages/home/Home";
import ProductDetail from "../pages/productdetail/ProductDetail";
import Product from "../pages/product/Product";
import CartPage from "../pages/cart/CartPage";
import OrderPage from "../pages/order/OrderPage";
import PaymentResult from "../components/payment/PaymentResult";
import SuccessPayment from "../components/payment/SuccessPayment";
import FailedPayment from "../components/payment/FailPayment";
const Routerr = () => {
  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/product/:id", element: <ProductDetail /> },
    { path: "/product/all", element: <Product /> },
    { path: "/order", element: <OrderPage /> },
    { path: "/payment-result", element: <PaymentResult /> },
    { path: "/payment-success", element: <SuccessPayment /> },
    { path: "/payment-fail", element: <FailedPayment /> },
    { path: "/cart", element: <CartPage /> },
  ]);
  return routes;
};
export default Routerr;
