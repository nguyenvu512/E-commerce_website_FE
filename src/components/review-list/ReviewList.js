import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import Review from "../review/Review";
import "./ReviewList.css";
const ReviewList = ({ productID }) => {
  const [reviews, setReview] = useState([]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:8888/api/v1/review-service/review/list-review-of-product/${productID}`,
          { method: "GET" }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const reviewData = data.result; // Assuming 'result' contains the list of reviews
        setReview(reviewData); // Corrected from setProduct(productData)
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [productID]); // Adding 'productID' as a dependency

  return (
    <Row className="review-list">
      {reviews.map((item, index) => (
        <div>
          <Review key={index} review={item}></Review>
          <hr />
        </div>
      ))}
    </Row>
  );
};

export default ReviewList;
