import React, { useState } from "react";
import { Col } from "react-bootstrap";
import "./Review.css";
const Review = ({ review }) => {
  return (
    <Col className="review">
      <div className="avata">
        <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="20"
            cy="20"
            r="15"
            fill="white"
            stroke="black"
            stroke-width="1"
          />
        </svg>
        <i class="fa-regular fa-user"></i>
      </div>
      <div className="info">
        <div>
          <small className="name">{review.customerName}</small>
        </div>
        <div className="d-flex">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={review.rating >= item ? "gold" : "white"}
              stroke="gold"
              strokeWidth="1"
            >
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
            </svg>
          ))}
        </div>
        <div>
          <small className="time">{review.createdAt}</small>
        </div>
        <div className="info-content">
          <p>{review.content}</p>
        </div>
      </div>
    </Col>
  );
};

export default Review;
