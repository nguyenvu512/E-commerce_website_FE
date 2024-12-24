import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddressForm.css";

const AddressForm = ({ setAddress }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    province: "",
    district: "",
    commune: "",
    address: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Gọi API để lấy danh sách tỉnh thành
    axios
      .get("http://localhost:8083/order-service/address/province")
      .then((response) => {
        if (response.data.code === 1000) {
          setProvinces(response.data.result);
        } else {
          console.error("Lỗi khi tải danh sách tỉnh:", response.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setAddress((prevData) => ({ ...prevData, [name]: value }));

    if (name === "province") {
      // Tìm tỉnh từ mảng provinces dựa trên ID đã chọn
      const selectedProvince = provinces.find(
        (province) => province.idProvince === value
      );

      if (selectedProvince) {
        setAddress({
          ...formData,
          province: selectedProvince.name, // Lưu tên tỉnh
        });
      }

      axios
        .get(`http://localhost:8083/order-service/address/district/${value}`)
        .then((response) => {
          if (response.data.code === 1000) {
            setDistricts(response.data.result);
          } else {
            console.error("Lỗi khi tải danh sách quận/huyện:", response.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi API:", error);
        });
    }

    if (name === "district") {
      // Tìm tỉnh từ mảng provinces dựa trên ID đã chọn
      const selectedDistrict = districts.find(
        (district) => district.idDistrict === value
      );

      if (selectedDistrict) {
        setAddress((prevData) => ({
          ...prevData,
          district: selectedDistrict.name, // Lưu tên tỉnh
        }));
      }

      axios
        .get(`http://localhost:8083/order-service/address/commune/${value}`)
        .then((response) => {
          if (response.data.code === 1000) {
            setCommunes(response.data.result);
          } else {
            console.error("Lỗi khi tải danh sách xã/phường:", response.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi API:", error);
        });
    }

    if (name === "commune") {
      // Tìm tỉnh từ mảng commune dựa trên ID đã chọn
      const selectedCommune = communes.find(
        (commune) => commune.idCommune === value
      );

      if (selectedCommune) {
        setAddress((prevData) => ({
          ...prevData,
          commune: selectedCommune.name, // Lưu tên tỉnh
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="container mt-2 mb-2 p-3"
      style={{ backgroundColor: "white", borderRadius: 10 }}
    >
      <h4
        className="text-muted"
        style={{ fontSize: "1.1rem", textAlign: "left", fontWeight: 700 }}
      >
        ĐỊA CHỈ GIAO HÀNG
      </h4>
      <hr />
      <form onSubmit={handleSubmit} className="row g-3">
        {/* họ tên */}
        <div className="col-12 d-flex align-items-center">
          <label
            htmlFor="fullName"
            className="form-label me-2 mb-0"
            style={{ width: "150px" }}
          >
            Họ và tên:
          </label>
          <input
            type="text"
            className="form-control small-placeholder"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Nhập họ tên người nhận"
            required
          />
        </div>

        {/* email */}
        <div className="col-12 d-flex align-items-center">
          <label
            htmlFor="email"
            className="form-label me-2 mb-0"
            style={{ width: "150px" }}
          >
            Email:
          </label>
          <input
            type="email"
            className="form-control small-placeholder"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
            required
          />
        </div>

        <div className="col-12 d-flex align-items-center">
          <label
            htmlFor="phoneNumber"
            className="form-label me-2 mb-0"
            style={{ width: "150px" }}
          >
            Số điện thoại:
          </label>
          <input
            type="tel"
            className="form-control small-placeholder"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
        <div className="col-12 d-flex align-items-center">
          <label
            htmlFor="province"
            className="form-label me-2 mb-0"
            style={{ width: "150px" }}
          >
            Tỉnh/Thành Phố:
          </label>
          <select
            className="form-select"
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
          >
            <option>Chọn Tỉnh/Thành Phố</option>
            {provinces.map((province) => (
              <option key={province.idProvince} value={province.idProvince}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 d-flex align-items-center">
          <label
            htmlFor="district"
            className="form-label me-2 mb-0"
            style={{ width: "150px" }}
          >
            Quận/Huyện:
          </label>
          <select
            className="form-select"
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          >
            <option>Chọn Quận/Huyện</option>
            {districts.map((district) => (
              <option key={district.idDistrict} value={district.idDistrict}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 d-flex align-items-center">
          <label
            htmlFor="commune"
            className="form-label me-2 mb-0"
            style={{ width: "150px" }}
          >
            Phường/Xã:
          </label>
          <select
            className="form-select"
            id="commune"
            name="commune"
            value={formData.commune}
            onChange={handleChange}
            required
          >
            <option>Chọn Phường/Xã</option>
            {communes.map((commune) => (
              <option key={commune.idCommune} value={commune.idCommune}>
                {commune.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 d-flex align-items-center">
          <label
            htmlFor=""
            className="form-label me-2 mb-0"
            style={{ width: "150px" }}
          >
            Địa chỉ nhận hàng:
          </label>
          <input
            type="tel"
            className="form-control small-placeholder"
            id="address"
            name="address"
            // value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Nhập địa chỉ nhận hàng"
            required
          />
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
