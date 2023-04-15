import React from "react";
import { Container } from "reactstrap";

const Footer = () => {
  return (
    <div
      className="footer mt-5 mb-4"
      style={{
        position: "absolute",
        bottom: "10",
        width: "100%",
      }}
    >
      <Container>
        <hr className="hr-line" />
        <h1 className="h5">KunSasto &copy;</h1>
      </Container>
    </div>
  );
};

export default Footer;
