import axios from "axios";
import React, { useEffect, useState } from "react";

const Voucher = ({ setVoucher }) => {
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    // Gọi API để lấy danh sách voucher
    axios
      .get("http://localhost:8888/api/v1/voucher-service/getAll")
      .then((response) => {
        if (response.data.code === 1000) {
          setVouchers(response.data.result);
        } else {
          console.error("Lỗi khi tải danh sách voucher:", response.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
      });
  }, []);

  const handleVoucherChange = (e) => {
    setSelectedVoucher(e.target.value);

    const chooseVoucher = vouchers.find(
      (voucher) => voucher.id === e.target.value
    );

    setVoucher(chooseVoucher);
  };

  return (
    <div
      className="container mt-2 p-3"
      style={{ backgroundColor: "white", borderRadius: 10 }}
    >
      <h4
        className="text-muted"
        style={{ fontSize: "1.1rem", textAlign: "left", fontWeight: 700 }}
      >
        CHỌN VOUCHER
      </h4>
      <hr />
      <ul className="list-unstyled">
        {vouchers.map((voucher) => (
          <li key={voucher.id} className="mb-2 ">
            <div className="d-flex align-items-center">
              <input
                type="radio"
                id={voucher.id}
                name="voucher"
                value={voucher.id}
                checked={selectedVoucher === voucher.id}
                onChange={handleVoucherChange}
                className="form-check-input me-3"
                style={{ height: 20, width: 20 }}
              />
              <div className="flex-grow-1">
                <label htmlFor={voucher.id} className="fw-bold">
                  {voucher.discountName}
                </label>
                <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
                  {voucher.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Voucher;
