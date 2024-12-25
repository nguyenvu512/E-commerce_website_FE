import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProductCard from "../product-card/ProductCard";
import "./ProductList.css";

const ProductList = ({ title }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/api/v1/product-service/product",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON response
        setProducts(data.result); // Assuming the API returns an array of products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <Container>
      <br />
      <h2 className="text-center">{title}</h2>
      <br />
      <Row className="g-4">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </Row>
      <Row className="my-2">
        <Col className="product-more text-center mx-auto">
          <a href="/product/all" className="btn-dark">
            XEM THÊM
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductList;
