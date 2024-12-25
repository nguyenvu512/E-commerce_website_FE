import React from "react";
import { Col } from "react-bootstrap";
import "./SearchItem.css";
const SearchItem = ({ product }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  const createSlug = (str) => {
    return str
      .toLowerCase() // Chuyển thành chữ thường
      .replace(/[^\w\s-]/g, "") // Loại bỏ các ký tự đặc biệt
      .trim() // Loại bỏ khoảng trắng ở đầu và cuối chuỗi
      .replace(/\s+/g, "-") // Thay thế tất cả khoảng trắng (1 hoặc nhiều) bằng dấu gạch ngang
      .replace(/-+/g, "-"); // Loại bỏ các dấu gạch ngang liên tiếp
  };
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    return formatCurrency(
      originalPrice - (originalPrice * discountPercent) / 100
    );
  };
  return (
    <Col className=" col-12 search-item">
      <div className=" col-9 search-info">
        <a href={`/product/${createSlug(product.name)}`}>{product.name}</a>
        <div className="price-discount">
          {" "}
          <span>
            {calculateDiscountedPrice(product.price, product.discountPercent)}
          </span>
          <del>{formatCurrency(product.price)}</del>
        </div>
      </div>
      <div className="thumbs col-3">
        <a href={`/product/${createSlug(product.name)}`}>
          <img src={product.variants[0].imageURL} alt="" />
        </a>
      </div>
    </Col>
  );
};

export default SearchItem;
