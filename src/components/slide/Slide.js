import React, { useEffect, useState } from "react";
import "./Slide.css";
import SearchItemList from "../searchitem-list/SearchItemList";
const Slide = () => {
  const images = [
    "https://file.hstatic.net/200000312481/file/2mat_3469760b49bb4176864116189169f7b1.jpg",
    "https://file.hstatic.net/200000312481/file/z4463558183726_a498b6c80488a460beb80665e52bc04b_965c8e758cf84fa3b58088295a7fb274.jpg",
    "https://file.hstatic.net/200000312481/file/aokhoac_784f570b69dc4b61abf729543c4e58a8.jpg",
    "https://file.hstatic.net/200000312481/file/polo_aaf8947f65484e6c9dec8d63d72e266c.jpg",
  ];

  const [img, setImg] = useState(images[0]);
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current = (current + 1) % images.length;
      setImg(images[current]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slide">
      <img src={img} alt="" />
    </div>
  );
};

export default Slide;
