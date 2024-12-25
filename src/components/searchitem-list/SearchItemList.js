import React, { useEffect, useState } from "react";
import SearchItem from "../searchitem/SearchItem";
import { Col } from "react-bootstrap";
import "./SearchItemList.css";

const SearchItemList = ({ name }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (name !== "") {
        try {
          const response = await fetch(
            `http://localhost:8888/api/v1/product-service/product/search/${name}`,
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
      }
    };
    fetchProducts();
  }, [name]); // Re-run effect when `name` changes

  const displayList = products.slice(0, 5); // Only show the first 5 products

  return (
    <Col
      xl={2}
      className={` col-12 list-search ${
        name !== "" ? "list-search-show" : "list-search-hidden"
      }`}
    >
      {displayList.length > 0 &&
        displayList.map((item, index) => (
          <SearchItem key={index} product={item} />
        ))}
      {products.length === 0 && name !== "" && (
        <div className="text-center p-3">Không có sản phẩm nào...</div>
      )}

      {displayList.length < products.length && (
        <p className="text-center m-2">
          Xem thêm {products.length - displayList.length} sản phẩm
        </p>
      )}
    </Col>
  );
};

export default SearchItemList;
