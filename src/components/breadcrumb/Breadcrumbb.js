import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, Container, Row } from "react-bootstrap";
import "./Breadcrumbb.css";

const Breadcrumbb = ({ name, page, link }) => {
  return (
    <div className=" breadcrumb">
      <Container>
        <nav className="breadcrumb-list">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href={link}>{page}</Breadcrumb.Item>
          <Breadcrumb.Item active className="bg-white">
            {name}
          </Breadcrumb.Item>
        </nav>
      </Container>
    </div>
  );
};

export default Breadcrumbb;
