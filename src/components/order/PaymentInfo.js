import React, { useEffect, useState } from "react";
import "./PaymentInfo.css";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import axios from "axios";
import MoneyFormat from "../utils/MoneyFormat";
import { showNotification } from "../utils/Notification";

const PaymentInfo = ({
  orderedProducts,
  addressInfo,
  paymentMethod,
  voucherInfo,
}) => {
  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInNjb3BlIjoiUk9MRV9BRE1JTiIsImlzcyI6ImRldnRlcmlhLmNvbSIsImV4cCI6MTczMTUxMjc1NSwiaWF0IjoxNzMxNTA5MTU1LCJ1c2VySWQiOiJmOGQxNzIwZC00ZjliLTQyOTgtYWZkOS1kMTQwMGQyYTZlYTkiLCJqdGkiOiI1YjViMDU1Yy1lZTRiLTQ5MDItYWNhNC03NWU5YjNkMjY3YTYifQ.mqkatQmZNA6FkVc4lT7Py9Z7HWg4z94_nCSrIX7tga3WlpXVGKfIMkdZhaxZL8od8UUJ5fBtweX8nSK8KNn9vg";

  // websocket
  useEffect(() => {
    const socket = new SockJS("http://localhost:8083/order-service/ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log("Connected to WebSocket");

      client.subscribe("/topic/orders", (msg) => {
        // nếu thanh toán bằng vnpay thì tạo vnpay
        const msgParts = msg.body.split(","); // Tách chuỗi theo dấu phẩy

        const orderid = msgParts[1]; // OrderID sẽ là phần thứ 2 (index 1)
        const totalprice = msgParts[2];
        const totalprice1 = parseFloat(totalprice);
        console.log(orderid, totalprice1);

        if (
          msg.body.includes("Order successfully processed") &&
          orderid !== "" &&
          totalprice1 !== ""
        ) {
          const paymentData = {
            amount: totalprice1,
            orderID: orderid,
          };
          axios
            .post(
              "http://localhost:8083/order-service/payment/create_payment",
              paymentData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            )
            .then((response) => {
              if (response.data.code === 1000) {
                window.location.href = response.data.result.url;
              } else {
                setIsLoading(false); // Tắt spinner nếu gọi API thất bại
                setMessageFail("Lỗi hệ thống, vui lòng thử lại sau!");
                setShowMessageFail(true);
                console.error("Lỗi khi gọi API:", response.data.message);
              }
            })
            .catch((error) => {
              setIsLoading(false); // Tắt spinner nếu gặp lỗi
              setMessageFail("Lỗi hệ thống, vui lòng thử lại sau!");
              setShowMessageFail(true);
              console.error(
                "Lỗi khi gọi API:",
                error.response || error.message
              );
            });
          return;
        } else {
          setIsLoading(false);
          setShowMessageSuccess(true);
        }

        if (msg.body === "Fail(Voucher sold out)") {
          setMessageFail("Đã hết Voucher, vui lòng thử lại!");
          setIsLoading(false);
          setShowMessageFail(true);
        }

        if (msg.body === "Fail(Product sold out)") {
          setMessageFail("Đã hết sản phẩm, vui lòng thử lại!");
          setIsLoading(false);
          setShowMessageFail(true);
        }
      });
    });

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, []); // Đảm bảo kết nối chỉ được thiết lập một lần

  const [isLoading, setIsLoading] = useState(false);
  const [showMessageSuccess, setShowMessageSuccess] = useState(false);
  const [showMessageFail, setShowMessageFail] = useState(false);
  const [messageFail, setMessageFail] = useState("");

  const orderedProduct = orderedProducts;

  const totalPrice = orderedProducts.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  ); // Calculate total price

  // Phí vận chuyển
  const [shippingMoney, setShippingMoney] = useState(20000);
  // Tiền khuyến mãi
  const [voucherMoney, setVoucherMoney] = useState(0);
  // Tổng tiền
  const [totalMoney, setTotalMoney] = useState(0);

  useEffect(() => {
    let newShippingMoney = 20000;
    let newVoucherMoney = 0;

    if (voucherInfo) {
      if (voucherInfo.freeShip) {
        newShippingMoney = 0; // Miễn phí vận chuyển
      } else if (
        voucherInfo.percentage === false &&
        voucherInfo.discountAmount > 0
      ) {
        newVoucherMoney = voucherInfo.discountAmount; // Giảm tiền cụ thể
      } else if (
        voucherInfo.percentage === true &&
        voucherInfo.discountAmount > 0
      ) {
        newVoucherMoney = (voucherInfo.discountAmount * totalPrice) / 100; // Giảm theo phần trăm
      }
    }

    setShippingMoney(newShippingMoney);
    setVoucherMoney(newVoucherMoney);

    // Tính tổng tiền
    const newTotalMoney = totalPrice + newShippingMoney - newVoucherMoney;
    setTotalMoney(newTotalMoney);
  }, [voucherInfo, totalPrice]); // Chỉ chạy lại khi voucherInfo hoặc totalPrice thay đổi

  const orderData = {
    dateCreated: new Date(),
    payment: paymentMethod,
    consigneeName: addressInfo?.fullName,
    consigneeEmail: addressInfo?.email,
    consigneePhone: addressInfo?.phoneNumber,
    totalPrice: totalMoney,
    address: `${addressInfo?.address}, ${addressInfo?.commune}, ${addressInfo?.district}, ${addressInfo?.province}`,
    accountID: "3283838-288-cd-8344vfs1", // Replace with actual accountID
    voucherID: voucherInfo ? voucherInfo.id : "", // Assuming voucherInfo contains a valid ID
    orderDetails: orderedProduct.map((item) => ({
      productID: item.productID,
      productName: item.productName,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      productPrice: item.productPrice,
    })),
  };

  console.log(orderData);

  // function handle payment click
  const handlePayment = () => {
    // check payment information
    if (!orderData.consigneeName) {
      showNotification("Họ tên người nhận không được để trống");
      return;
    }
    if (!orderData.consigneeEmail) {
      showNotification("Email người nhận không được để trống");
      return;
    }
    if (!orderData.consigneePhone) {
      showNotification("SĐT người nhận không được để trống");
      return;
    }
    if (
      !addressInfo.province ||
      addressInfo.province === "Chọn Tỉnh/Thành Phố"
    ) {
      showNotification("Tỉnh/Thành Phố không được để trống");
      return;
    }
    if (!addressInfo.district || addressInfo.district === "Chọn Quận/Huyện") {
      showNotification("Quận/Huyện không được để trống");
      return;
    }
    if (!addressInfo.commune || addressInfo.commune === "Chọn Phường/Xã") {
      showNotification("Phường/Xã không được để trống");
      return;
    }
    if (!addressInfo.address) {
      showNotification("Địa chỉ nhận hàng không được để trống");
      return;
    }
    if (!orderData.payment) {
      showNotification("Phương thức thanh toán không được để trống");
      return;
    }

    setIsLoading(true); // Hiển thị spinner trong khi đợi API phản hồi

    axios
      .post("http://localhost:8083/order-service/create", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.code === 1000) {
          console.log("API gọi thành công, đợi phản hồi từ WebSocket...");
          // nếu thanh toán bằng vnpay thì gọi api đến vnpay
        } else {
          setIsLoading(false); // Tắt spinner nếu gọi API thất bại
          setShowMessageFail(true);
          console.error("Lỗi khi gọi API:", response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false); // Tắt spinner nếu gặp lỗi
        setMessageFail("Lỗi hệ thống, vui lòng thử lại sau!");
        setShowMessageFail(true);
        console.error("Lỗi khi gọi API:", error.response || error.message);
      });
  };

  const closeSuccessMessage = () => {
    window.location.href = "/";
  };
  const closeFailMessage = () => {
    setIsLoading(false);
    setShowMessageFail(false);
  };

  return (
    <div
      className="container mt-2 p-3 mb-2"
      style={{ backgroundColor: "white", borderRadius: 10 }}
    >
      {/* Thông tin tổng tiền */}
      <div style={{ width: "100%", textAlign: "right", color: "black" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 150px",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <span>Thành tiền:</span>
          <span>{MoneyFormat(totalPrice)}</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 150px",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <span>Phí vận chuyển:</span>
          <span>{MoneyFormat(shippingMoney)}</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 150px",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <span>
            Khuyến mãi ({voucherInfo ? voucherInfo.discountName : ""}):
          </span>
          <span>{MoneyFormat(voucherMoney)}</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 150px",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <strong style={{ fontSize: "1.3rem" }}>Tổng tiền:</strong>
          <strong style={{ fontSize: "1.3rem" }}>
            {MoneyFormat(totalMoney)}
          </strong>
        </div>
      </div>

      {/* Đường kẻ ngang */}
      <hr />

      {/* Nút thanh toán */}
      <div style={{ width: "100%", textAlign: "right" }}>
        <button
          className="btn-payment-dark"
          style={{
            backgroundColor: "black",
            padding: "10px 65px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
          onClick={handlePayment}
        >
          {paymentMethod === "VN_PAY"
            ? "XÁC NHẬN THANH TOÁN"
            : "XÁC NHẬN ĐẶT HÀNG"}
        </button>
      </div>

      {/* spiner */}
      {isLoading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* Thông báo thành công */}
      {showMessageSuccess && (
        <>
          <div className="overlay"></div> {/* Overlay dưới thông báo */}
          <div className="success-message">
            <button className="close-btn" onClick={closeSuccessMessage}>
              &times;
            </button>
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="green"
                viewBox="0 0 24 24"
                width="110px"
                height="110px" // Tăng kích thước icon
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"
                  fill="green"
                />
              </svg>
            </div>
            <p>ĐẶT HÀNG THÀNH CÔNG!</p>
          </div>
        </>
      )}

      {/* Thông báo thất bại */}
      {showMessageFail && (
        <>
          <div className="overlay"></div> {/* Overlay dưới thông báo */}
          <div className="failure-message">
            <button className="close-btn" onClick={closeFailMessage}>
              &times;
            </button>
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="red"
                viewBox="0 0 24 24"
                width="100px"
                height="100px" // Tăng kích thước icon
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.59 6.41L13.41 12l4.18 4.18-1.41 1.41L12 13.41l-4.18 4.18-1.41-1.41L10.59 12 6.41 7.82 7.82 6.41 12 10.59l4.18-4.18 1.41 1.41z"
                  fill="red" // Màu đỏ báo lỗi
                />
              </svg>
            </div>
            <p>{messageFail}</p>
          </div>
        </>
      )}
    </div>
  );
};
export default PaymentInfo;
