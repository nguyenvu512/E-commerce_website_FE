import React, { useState } from "react";
import "./InfoModal.css";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { showNotification } from "../utils/Notification";
const InfoModal = ({ setShowInfoModal, userInfo }) => {
  const regexAge = /^\d+$/;
  const regexPhoneNumber = /^0\d{9}$/;
  const regexEmail = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
  const [formData, setFormData] = useState({
    id: userInfo.id,
    name: userInfo.name,
    age: userInfo.age,
    address: userInfo.address,
    phoneNumber: userInfo.phoneNumber,
    email: userInfo.email,
    gender: userInfo.gender ? "Nam" : "Nữ",
  });
  const token = localStorage.getItem("Access_Token");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const updateInfo = async () => {
    if (formData.name === "") {
      showNotification("Họ và Tên không đúng");
      return;
    }
    if (!regexAge.exec(formData.age)) {
      showNotification("Tuổi không đúng");
      return;
    }
    if (formData.address === "") {
      setShowInfoModal("Địa chỉ không đúng");
      return;
    }
    if (!regexPhoneNumber.exec(formData.phoneNumber)) {
      showNotification("Số điện thoại không đúng");
      return;
    }
    if (!regexEmail.exec(formData.email)) {
      showNotification("Email không đúng");
    }
    try {
      const response = await axios.put(
        `http://localhost:8888/api/v1/identity-service/user/${formData.id}`,
        {
          name: formData.name, // Dữ liệu từ trạng thái formData
          age: formData.age, // Dữ liệu từ trạng thái formData
          address: formData.address, // Dữ liệu từ trạng thái formData
          typeOfUser: formData.typeOfUser, // Dữ liệu từ trạng thái formData
          phoneNumber: formData.phoneNumber, // Dữ liệu từ trạng thái formData
          email: formData.email, // Dữ liệu từ trạng thái formData
          gender: formData.gender === "Nam" ? true : false, // Chuyển giới tính về kiểu boolean
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token trong header
            "Content-Type": "application/json", // Định dạng kiểu dữ liệu JSON
          },
        }
      );
      showNotification("Cập nhật thành công");
      window.location.href = "/";
    } catch (error) {
      showNotification("Cập nhật thất bại");
    }
  };

  return (
    <div className="info-modal-overlow">
      <div className="info-modal">
        <Row className="my-1">
          <Col className="text-center">
            <h5>THÔNG TIN KHÁCH HÀNG</h5>
          </Col>
        </Row>
        <Container>
          <Row className="g-0">
            <Col className="col-3">Mã khách hàng</Col>
            <Col className="col-9">
              <input
                type="text"
                className="w-100"
                name="id"
                value={formData.id}
                readOnly={formData.id != ""}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row className="g-0 my-2">
            <Col className="col-3">Họ và Tên</Col>
            <Col className="col-9">
              <input
                type="text"
                className="w-100"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row className="g-0 my-2">
            <Col className="col-3">Tuổi</Col>
            <Col className="col-9">
              <input
                type="text"
                className="w-100"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row className="g-0 my-2">
            <Col className="col-3">Địa chỉ</Col>
            <Col className="col-9">
              <input
                type="text"
                className="w-100"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row className="g-0 my-2">
            <Col className="col-3">Số điện thoại</Col>
            <Col className="col-9">
              <input
                type="text"
                className="w-100"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row className="g-0 my-2">
            <Col className="col-3">Email</Col>
            <Col className="col-9">
              <input
                type="text"
                className="w-100"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row className="g-0 my-2">
            <Col className="col-3">Giới tính</Col>
            <Col className="col-9">
              <select
                className="w-100"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </Col>
          </Row>
          <Row className=" g-0 my-5">
            <Col className="text-center">
              <button
                className="btn-close-info-modal"
                onClick={() => setShowInfoModal(false)}
              >
                Đóng
              </button>
            </Col>
            <Col className="text-center">
              <button className="btn-update-info" onClick={updateInfo}>
                Cập nhật thông tin
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default InfoModal;
