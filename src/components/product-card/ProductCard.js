import React from "react";
import "./ProductCard.css";
import { Col } from "react-bootstrap";
const ProductCard = ({ product }) => {
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
    <Col xl={3} md={4} sm={6} className="col-6">
      <a href={`/product/${createSlug(product.name)}`} className="card">
        <img src={product.variants[0].imageURL} alt="" />
        <div className="title my-2">
          <strong>{product.name}</strong>
          <span>
            {calculateDiscountedPrice(product.price, product.discountPercent)}
          </span>
          <del className="mx-2">{formatCurrency(product.price)}</del>
        </div>
        <div className="discount">
          <span>{`-${product.discountPercent}%`}</span>
        </div>
      </a>
    </Col>
  );
};

export default ProductCard;
