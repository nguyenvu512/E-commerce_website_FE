import React, { useEffect, useState } from "react";
import Breadcrumbb from "../../components/breadcrumb/Breadcrumbb";
import { Col, Container, Row } from "react-bootstrap";
import ProductCard from "../../components/product-card/ProductCard";
import Footer from "../../components/header-footer/Footer";
import "./Product.css";
import MyNavbar from "../../components/header-footer/MyNavbar";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [producttype, setProducttype] = useState([]);
  const [totalpagearr, setTotalpagearr] = useState([]);
  const [submenu, setSubmenu] = useState(false);
  const [namefiltter, setNamefiltter] = useState("");
  const [pricefillter, setPricefillter] = useState("");
  const [productfiltter, setProductfiltter] = useState([]);
  const [displaypagearr, setDisplaypagearr] = useState([]);
  const [page, setPage] = useState(0);

  // Fetch product types
  useEffect(() => {
    const fetchProductType = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/api/v1/product-service/product-type"
        );
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setProducttype(data.result);
      } catch (error) {
        console.error("Failed to fetch product types:", error);
      }
    };
    fetchProductType();
  }, []);

  // Fetch products and handle pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8888/api/v1/product-service/product/page?page=${page}&size=4`
        );
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

        const totalPages = data.result.totalPages;
        setProducts(data.result.content);

        const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
        setTotalpagearr(pagesArray);

        const startIndex = Math.max(0, page - 2);
        const endIndex = Math.min(totalPages, page + 3);
        setDisplaypagearr(pagesArray.slice(startIndex, endIndex));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, [page]);

  // Filter products
  useEffect(() => {
    console.log("123");
    let filteredProducts = [...products];

    if (namefiltter === "name-inc") {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (namefiltter === "name-dec") {
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (pricefillter === "price-inc") {
      filteredProducts.sort(
        (a, b) =>
          a.price * (1 - a.discountPercent / 100) -
          b.price * (1 - b.discountPercent / 100)
      );
    } else if (pricefillter === "price-dec") {
      filteredProducts.sort(
        (a, b) =>
          b.price * (1 - b.discountPercent / 100) -
          a.price * (1 - a.discountPercent / 100)
      );
    }

    setProductfiltter(filteredProducts);
  }, [namefiltter, pricefillter, products]);
  return (
    <div>
      <MyNavbar />
      <Breadcrumbb
        name="Tất cả sản phẩm"
        page="Product"
        link={"/product/all"}
      />
      <br />
      <Container>
        <Row>
          <Col xl={2}>
            <ul className="product-type">
              Danh mục{" "}
              <i
                className="fa-solid fa-plus"
                onClick={() => setSubmenu(!submenu)}
              />
              <div className={`sub-menu ${submenu ? "show" : "hidden"}`}>
                {producttype.map((item, index) => (
                  <li key={index}>
                    <a href="#">{`-${item.name}`}</a>
                  </li>
                ))}
              </div>
            </ul>
          </Col>
          <Col xl={10}>
            <Row>
              <Col xl={10}>
                <h4>Tất cả sản phẩm</h4>
              </Col>
              <Col xl={2}>
                <select
                  className="search"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith("name")) {
                      setNamefiltter(value);
                      setPricefillter("");
                    } else {
                      setPricefillter(value);
                      setNamefiltter("");
                    }
                  }}
                >
                  <option value="">Tất cả</option>
                  <option value="name-inc">Tên: A-Z</option>
                  <option value="name-dec">Tên: Z-A</option>
                  <option value="price-inc">Giá: Thấp-Cao</option>
                  <option value="price-dec">Giá: Cao-Thấp</option>
                </select>
              </Col>
            </Row>
            <br />
            <Row>
              {productfiltter.map((item, index) => (
                <ProductCard key={index} product={item} />
              ))}
            </Row>
            <br />
            <Row>
              <Col className="text-center">
                <button className="btn" onClick={() => setPage(0)}>
                  <i className="fa-solid fa-backward-fast"></i>
                </button>
                {displaypagearr.map((item) => (
                  <button
                    key={item}
                    className={`btn ${page + 1 === item ? "current" : ""}`}
                    onClick={() => setPage(item - 1)}
                  >
                    {item}
                  </button>
                ))}
                <button
                  className="btn"
                  onClick={() => setPage(totalpagearr.length - 1)}
                >
                  <i className="fa-solid fa-forward-fast"></i>
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <br />
      <Footer />
    </div>
  );
};

export default Product;
