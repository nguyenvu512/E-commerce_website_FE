import React, { useState } from "react";
import AddressForm from "./AddressForm.js";
import ShippingMethod from "./ShippingMethod.js";
import PaymentMethods from "./PaymentMethod.js";
import Voucher from "./Voucher.js";
import PaymentInfo from "./PaymentInfo.js";
import OrderedProducts from "./OrderedProducts.js";
import { useLocation } from "react-router-dom";

const Order = () => {
  const location = useLocation();
  const { orderedProducts } = location.state || { orderedProducts: [] };

  const [addressInfo, setAddressInfo] = useState();
  const [paymentInfo, setPaymentInfo] = useState();
  const [voucherInfo, setVoucherInfo] = useState();

  const setAddress = (dataAddress) => {
    setAddressInfo(dataAddress);
  };

  const setPaymentMethod = (data) => {
    setPaymentInfo(data);
  };

  const setVoucher = (data) => {
    setVoucherInfo(data);
  };
  return (
    <div>
      <AddressForm setAddress={setAddress} />
      <ShippingMethod />
      <PaymentMethods setPaymentMethod={setPaymentMethod} />
      <Voucher setVoucher={setVoucher} />
      <OrderedProducts orderedProducts={orderedProducts} />
      <PaymentInfo
        orderedProducts={orderedProducts}
        addressInfo={addressInfo}
        paymentMethod={paymentInfo}
        voucherInfo={voucherInfo}
      />
    </div>
  );
};
export default Order;
