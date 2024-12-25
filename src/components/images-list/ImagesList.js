import React, { useState } from "react";
import "./ImagesList.css";

const ImagesList = ({ images, onClick }) => {
  const [current, setCurrent] = useState(0);

  const handleClick = (index) => {
    onClick(index); // Gọi onClick để xử lý logic ngoài này (nếu cần)
    setCurrent(index); // Cập nhật trạng thái current
  };

  return (
    <div className="img-list hidden-on-small">
      {images.map((item, index) => (
        <div key={index} className="img-card">
          <img
            onClick={() => handleClick(index)} // Gọi handleClick để xử lý
            src={item}
            alt=""
            className={current === index ? "current" : ""} // Kiểm tra nếu current === index
          />
        </div>
      ))}
    </div>
  );
};

export default ImagesList;
