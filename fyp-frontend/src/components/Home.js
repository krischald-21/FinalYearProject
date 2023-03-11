import React, { useState } from "react";
import { Button, Container, Input, Row, Col } from "reactstrap";
import NavBar from "./NavBar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [value, setValue] = useState("");
  const history = useNavigate();

  const changeHandler = (e) => {
    setValue(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    history(`/products?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="homepage">
      <NavBar />
      <h4 className="h4">Compare Laptop Prices</h4>
      <div
        className="d-flex justify-content-center align-items-center w-100"
        style={{ minHeight: "80vh" }}
      >
        <div className="w-100">
          <Container>
            <Row style={{ height: "3em" }}>
              <Col lg="10">
                <input
                  type="text"
                  className="searchbar w-100 h-100"
                  placeholder="Search..."
                  value={value}
                  onChange={changeHandler}
                />
              </Col>
              <Col lg="2">
                {console.log(value)}
                {/* <Link to={{ pathname: "products/", state: { search } }}> */}
                <button className="w-100 h-100 buton" onClick={submitHandler}>
                  Search
                </button>
                {/* </Link> */}
              </Col>
            </Row>
            <Row>
              <Col lg="12" className="text-center mt-5">
                <p>
                  Compare the prices of laptops in KunSasto by searching it in
                  the search bar above!!
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default Home;
