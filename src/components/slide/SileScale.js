import React from "react";
import { Container } from "react-bootstrap";
import "./SlideScale.css";
const SileScale = () => {
  const img =
    "https://file.hstatic.net/200000312481/file/z4463558122016_bfef450d91a5399ebc2fade884caab82_97d2f0e768cb4543a22b4593107e3d3c.jpg";
  return (
    <div className="slide">
      <img src={img} alt="" />
    </div>
  );
};

export default SileScale;
