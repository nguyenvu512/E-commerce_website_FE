import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./Footer.css";
const Footer = () => {
  return (
    <div className="footer">
      <div className="bg-light">
        <Container>
          <Row className="prev-contact">
            <Col className="contact">
              <span>
                <i class="fa fa-phone mx-2"></i>
              </span>
              <span className="mx-2">Hỗ trợ / Mua hàng:</span>
              <a href="#" className="mx-2">
                0862642568
              </a>
            </Col>
          </Row>
        </Container>
      </div>
      <br />
      <div>
        <Container>
          <Row>
            <Col xl={3} className=" col-12 introduce">
              <h5>Giới thiệu</h5>
              <span>Hộ Kinh Doanh Bao GT</span>
              <span>
                MST 8752797026-001 do UBND Q.Tân Bình cấp ngày 14/11/2022
              </span>
              <img
                src="//file.hstatic.net/200000312481/file/dathongbaobct_150_74a9d1876907440bb5f121381c6c6c0a_grande.png"
                alt=""
              ></img>
            </Col>
            <Col xl={3} className="link col-12">
              <h5>Liên kết</h5>
              <a href="#">Tìm kiếm</a>
              <br />
              <a href="#">Giới thiệu</a>
              <br />
              <a href="#">Chính sách thanh toán</a>
              <br />
              <a href="#">Chính sách khiếu nại</a>
              <br />
              <a href="#">Chính sách vận chuyển</a>
              <br />
              <a href="#">Chính sách đổi trả</a>
              <br />
              <a href="#">Chính sách bảo hành</a>
              <br />
              <a href="#">Chính sách kiểm hàng</a>
              <br />
              <a href="#">Chính sách bảo mật</a>
            </Col>
            <Col xl={3} className="col-12">
              <h5>Thông tin liên hệ</h5>
              <div>
                <i class="fa-solid fa-location-crosshairs mx-2"></i>
                <span>
                  22 Nguyễn Thái Học - Phường Tân Thành - Quận Tân Phú - TP.Hồ
                  Chí Minh
                </span>
              </div>
              <div>
                <i class="fa-solid fa-mobile mx-2"></i>
                <span>0862642568</span>
              </div>
              <div>
                <i class="fa-solid fa-inbox mx-2"></i>
                <span>coming soon</span>
              </div>
              <div>
                {" "}
                <i class="fa-brands fa-telegram mx-2"></i>
                <span>outerity.local@gmail.com</span>
              </div>
            </Col>
            <Col xl={3}>
              <h5>Fanpage</h5>
            </Col>
          </Row>
        </Container>
      </div>
      <hr />
      <p className="text-center">Copyright © 2024 Outerity. Powered by TKDYY</p>
    </div>
  );
};

export default Footer;
<Row></Row>;
