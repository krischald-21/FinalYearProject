import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";

const SearchBar = (props) => {
  const [searchTerm, setSearchTerm] = useState(props.searchParams);
  const history = useNavigate();
  const changeHandler = (e) => {
    setSearchTerm(e.target.value);
  };

  const submitHandler = (e) => {
    history(`/products?q=${encodeURIComponent(searchTerm)}`);
    window.location.reload();
  };
  return (
    <div>
      <Row className="m-2 p-2">
        <Col
          lg="10"
          style={{
            height: "2.5em",
          }}
        >
          <input
            className="searchbar w-100 h-100"
            type="text"
            value={searchTerm}
            max={255}
            placeholder="Search..."
            onChange={changeHandler}
          />
        </Col>
        <Col lg="2">
          <button className="buton w-100 h-100" onClick={submitHandler}>
            Search
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default SearchBar;
