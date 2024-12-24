import "./App.css";
import Navbar from "./components/header-footer/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Order from "./components/order/Order";
import Cart from "./components/cart/Cart";
import Test from "./components/utils/Test";
import PaymentResult from "./components/utils/PaymentResult";

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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
