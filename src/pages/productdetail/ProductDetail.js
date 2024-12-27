import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ImagesList from "../../components/images-list/ImagesList";
import "./ProductDetail.css";
import Spinner from "../../components/spinner/Spinner";
import Footer from "../../components/header-footer/Footer";
import { useParams } from "react-router-dom";
import ProductList from "../../components/product-list/ProductList";
import Breadcrumbb from "../../components/breadcrumb/Breadcrumbb";
import ReviewList from "../../components/review-list/ReviewList";
import MyNavbar from "../../components/header-footer/MyNavbar";
import FormLogin from "../../components/form-login/FormLogin";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { showNotification } from "../../components/utils/Notification";
const ProductDetail = () => {
  const [product, setProduct] = useState(); // Lưu thông tin sản phẩm
  const [current, setCurrent] = useState(0); // Hình ảnh hiện tại
  const [size, setSize] = useState("S"); // Kích cỡ sản phẩm
  const [images, setImages] = useState([]); // Danh sách hình ảnh sản phẩm
  const { id } = useParams(); // Lấy ID từ URL
  const [hoverIndex, setHoverIndex] = useState(null);
  const token = localStorage.getItem("Access_Token");
  const [colors, setColors] = useState([]); // Danh sách màu
  const [color, setColor] = useState(0); // Chỉ mục màu hiện tại
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState({
    size: "S",
    color: "",
  });
  const restoreSlug = (slug) => {
    return slug
      .replace(/-/g, " ") // Thay dấu gạch ngang (-) thành khoảng trắng
      .replace(/\s+/g, " ") // Thay thế các khoảng trắng liên tiếp bằng 1 khoảng trắng
      .replace(/\b\w/g, (match) => match.toUpperCase()); // Chuyển chữ cái đầu của mỗi từ thành hoa
  };
  const handleClickAddCart = async () => {
    let tokenParse = jwtDecode(token);
    let accountID = tokenParse.accountID;
    let productImage = findProductImage(colors[color]);
    try {
      const response = await axios.post(
        `http://localhost:8888/api/v1/cart-service/cart/add-item/${accountID}`,
        {
          productID: product.id,
          productName: product.name,
          size,
          color: colors[color],
          quantity,
          productPrice: product.price,
          productImage,
          discountPercent: product.discountPercent,
          inventoryQuantity: changeInventoryQuantity(),
          accountID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token trong header
            "Content-Type": "application/json", // Định dạng kiểu dữ liệu JSON
          },
        }
      );
      if (response.data.code === 1000) {
        showNotification("Đã thêm sản phẩm vào giỏ hàng");
        axios
          .get(
            `http://localhost:8888/api/v1/cart-service/cart/get/${accountID}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            if (response.data.code === 1000) {
              const items = response.data.result.items;
              setCartItem(items.length);
            } else {
              console.error("Lỗi khi gọi api cart:", response.data);
            }
          })
          .catch((error) => {
            console.error(
              "Error fetching cart info:",
              error.response || error.message
            );
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const findProductImage = (color) => {
    if (product) {
      var variant = product.variants.find((variant) => variant.color === color);
      return variant.imageURL || "";
    }
  };
  // Fetch dữ liệu sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8888/api/v1/product-service/product/fbn/${encodeURIComponent(
            restoreSlug(id)
          )}`,
          { method: "GET" }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const productData = data.result; // Dữ liệu sản phẩm
        setProduct(productData);

        // Lấy danh sách màu sắc duy nhất
        const uniqueColors = [
          ...new Set(productData.variants.map((variant) => variant.color)),
        ];
        setColors(uniqueColors);

        // Lấy danh sách hình ảnh từ các biến thể
        const imageUrls = productData.variants
          .filter((variant) => variant.imageURL)
          .map((variant) => variant.imageURL);
        setImages(imageUrls);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProducts();
  }, [id]);

  // Cập nhật `condition` khi `colors`, `size`, hoặc `color` thay đổi
  useEffect(() => {
    if (colors.length > 0) {
      setCondition({
        size: size,
        color: colors[color],
      });
    }
  }, [colors, size, color]);

  // Lấy số lượng tồn kho cho sản phẩm dựa trên `condition`
  const changeInventoryQuantity = () => {
    const matchingVariant = product?.variants.find(
      (variant) =>
        variant.size === condition.size && variant.color === condition.color
    );
    return matchingVariant ? matchingVariant.inventoryQuantity : ""; // Trả về số lượng tồn hoặc ""
  };

  // Đổi hình ảnh hiện tại
  const handleClick = (index) => {
    setCurrent(index);
  };

  // Đổi kích cỡ sản phẩm
  const handleSizeClick = (selectedSize) => {
    setSize(selectedSize);
  };

  // Đổi màu sản phẩm
  const handleColorClick = (index) => {
    if (colors[index]) {
      setColor(index);
    } else {
      console.warn("Color index is out of range!");
    }
  };

  // Format tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Tính giá sau khi giảm giá
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    return formatCurrency(
      originalPrice - (originalPrice * discountPercent) / 100
    );
  };

  // update cart item
  const [cartItem, setCartItem] = useState();
  return (
    <div>
      <MyNavbar cartItem={cartItem} />
      <FormLogin></FormLogin>
      <Breadcrumbb
        name={restoreSlug(id)}
        page={"Product"}
        link={"/product/all"}
      ></Breadcrumbb>
      <Container>
        {product ? (
          <Row>
            <Col xl={1}>
              {/* Danh sách hình ảnh */}
              {images.length > 0 ? (
                <ImagesList onClick={handleClick} images={images} />
              ) : (
                <p>Đang tải hình ảnh...</p>
              )}
            </Col>
            <Col xl={6} sm={12} className="img">
              <Row>
                <img src={images[current]} alt="Sản phẩm" />
              </Row>
              <br />
              <Row className="next-img g-4 hidden-on-small">
                {images.slice(1, 5).map((img, index) => (
                  <Col xl={6} key={index}>
                    <img src={img} alt={`Hình ảnh ${index + 1}`} />
                  </Col>
                ))}
              </Row>
              <Row className="next-img-small hidden-onn-small">
                {images.slice(1, 5).map((img, index) => (
                  <Col className="col-3" key={index}>
                    <img
                      className={current == index + 1 ? "current" : ""}
                      src={img}
                      alt={`Hình ảnh ${index + 1}`}
                      onClick={() => handleClick(index + 1)}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
            <Col xl={5} sm={12} className="info">
              <Row>
                <span>{product.name}</span>
              </Row>
              <hr />
              <Row>
                <div className="price">
                  <span className=" discount-item mx-2">{`-${product.discountPercent}%`}</span>
                  <span className="mx-2">
                    {calculateDiscountedPrice(
                      product.price,
                      product.discountPercent
                    )}
                  </span>
                  <del className="mx-2">{formatCurrency(product.price)}</del>
                </div>
              </Row>
              <hr />
              <Row>
                <div className="size">
                  {["S", "M", "L"].map((item) => (
                    <div
                      key={item}
                      className={`size-item mx-2 ${
                        size === item ? "active" : ""
                      }`}
                      onClick={() => handleSizeClick(item)}
                    >
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Row>
              <hr />
              <Row className="mx-1">
                {colors.map((item, index) => (
                  <Col
                    key={index}
                    xl={4}
                    className={`col-4 color-item mx-1 ${
                      color === index ? "active-color" : ""
                    }`}
                    onClick={() => handleColorClick(index)}
                  >
                    <small className="color-title">{item}</small>
                  </Col>
                ))}
              </Row>
              <hr />
              <Row>
                <div>
                  <span>
                    <strong>Tồn Kho: </strong>
                    {changeInventoryQuantity()}
                  </span>
                </div>
              </Row>
              <hr />
              <Row>
                <Spinner quantity={quantity} setQuantity={setQuantity} />
              </Row>
              <br />
              <Row className="add-cart">
                <button className="btn-dark" onClick={handleClickAddCart}>
                  THÊM VÀO GIỎ
                </button>
              </Row>
              <br />
              <Row className="description">
                <strong>Mô tả</strong>
                <img
                  src="https://file.hstatic.net/200000312481/file/ort_thun_8e55fb90dda6477ca5b43c93b5a74faa_grande.jpg"
                  alt=""
                />
                <span>🔹 Bảng size Outerity</span>
                <span>S: Dài 69 Rộng 52.5 | 1m50 - 1m65, 45 - 55Kg</span>
                <span>M: Dài 73 Rộng 55 | 1m60 - 1m75, 50 - 65Kg</span>
                <span>L: Dài 76.5 Rộng 57.5 | 1m7 - 1m8, 65Kg - 80Kg</span>
                <span>
                  👉 Nếu chưa biết lựa size bạn có thể inbox để được chúng mình
                  tư vấn.
                </span>
                <p></p>
                <span>
                  ‼️LƯU Ý ▪️Khi giặt sản phẩm bằng tay: Vui lòng hoà tan kĩ nước
                  giặt, bột giặt với nước sau đó mới cho sản phẩm vào. ▪️Khi
                  giặt sản phẩm bằng máy giặt: Vui lòng đổ nước giặt, bột giặt
                  vào khay của máy.
                </span>
                <p></p>
                <span>
                  🚫TUYỆT ĐỐI KHÔNG đổ nước giặt, bột giặt trực tiếp vào sản
                  phẩm. Như vậy sẽ ảnh hưởng đến màu sắc của sản phẩm và làm cho
                  áo có tình trạng loang màu. Outerity xin cảm ơn ạ🖤
                </span>
                <p></p>
                <span>🔹 Chính sách đổi trả Outerity.</span>
                <span>
                  - Miễn phí đổi hàng cho khách mua ở Outerity trong trường hợp
                  bị lỗi từ nhà sản xuất, giao nhầm hàng, nhầm size.
                </span>
                <span>
                  - Quay video mở sản phẩm khi nhận hàng, nếu không có video
                  unbox, khi phát hiện lỗi phải báo ngay cho Outerity trong 1
                  ngày tính từ ngày giao hàng thành công. Qua 1 ngày chúng mình
                  không giải quyết khi không có video unbox.
                </span>
                <span>
                  - Sản phẩm đổi trong thời gian 3 ngày kể từ ngày nhận hàng
                </span>
                <span>
                  - Sản phẩm còn mới nguyên tem, tags, sản phẩm chưa giặt và
                  không dơ bẩn, hư hỏng bởi những tác nhân bên ngoài cửa hàng
                  sau khi mua hàng.
                </span>
                <span>Liên hệ: 0862642568</span>
              </Row>
            </Col>
          </Row>
        ) : (
          <strong>Loading...</strong>
        )}
        <hr />
        <Row>
          <h5 className="text-center">Khách hàng đánh giá (0)</h5>
          <div className="rating" style={{ display: "flex", gap: "5px" }}>
            {[1, 2, 3, 4, 5].map((item, index) => (
              <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill={item <= hoverIndex ? "gold" : "white"}
                stroke="gold"
                strokeWidth="1"
                onMouseEnter={() => setHoverIndex(item)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
              </svg>
            ))}
          </div>
        </Row>
        <Row>
          <h5>ĐÁNH GIÁ SẢN PHẨM</h5>
        </Row>
        <Row className="content">
          <Col xs={12} md={6} xl={12}>
            {" "}
            <textarea
              className="form-control"
              name=""
              id=""
              placeholder="Nhập đánh giá của bạn..."
            ></textarea>
          </Col>
        </Row>
        <Row className="post">
          <Col className="text-end">
            <button className="btn-post">Đăng</button>
          </Col>
        </Row>
        <Row>
          <h5>CÁC ĐÁNH GIÁ VỀ SẢN PHẨM</h5>
        </Row>
        {product && <ReviewList productID={product.id}></ReviewList>}
        <Row>
          <ProductList title={"SẢN PHẨM LIÊN QUAN"}></ProductList>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default ProductDetail;
