import "./App.css";
import Navbar from "./components/header-footer/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Order from "./components/order/Order";
import Cart from "./components/cart/Cart";
import PaymentResult from "./components/payment/PaymentResult";
import SuccessPayment from "./components/payment/SuccessPayment";
import FailedPayment from "./components/payment/FailPayment";

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: "#e8e8e8" }}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Cart />} />
            <Route path="/order" element={<Order />} />
            <Route path="/payment-result" element={<PaymentResult />} />
            <Route path="/payment-success" element={<SuccessPayment />} />
            <Route path="/payment-fail" element={<FailedPayment />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
