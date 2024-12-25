import React, { useState } from "react";
import "./Spinner.css";
const Spinner = ({ quantity, setQuantity }) => {
  const increase = () => {
    setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1); // Đảm bảo số không âm
    setQuantity(value);
  };
  return (
    <div className="spinner">
      <button onClick={decrease} className="mx-2">
        -
      </button>
      <input type="number" value={quantity} onChange={handleChange} />
      <button onClick={increase} className="mx-2">
        +
      </button>
    </div>
  );
};

export default Spinner;
