import React, { useState } from "react";
import { Button, Container, Input, Row, Col } from "reactstrap";
import NavBar from "./NavBar";
import axios from "axios";
import { Link } from "react-router-dom";

const baseURL = "https://localhost:7005/";

function SearchBar(props) {
  const [value, setValue] = useState("");
  const [id, setId] = useState("");
  var data = props.data;

  const changeHandler = (e) => {
    setValue(e.target.value);
  };

  const searchHandler = (searchItem) => {
    //api to get data form database
    console.log("search", searchItem);
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
            <Row>
              <Col lg="10">
                <input
                  style={{ height: "3em" }}
                  type="text"
                  className="searchbar w-100"
                  placeholder="Search..."
                  value={value}
                  onChange={changeHandler}
                />
                <div className="dropdown">
                  {data
                    .filter((item) => {
                      const searchTerm = value.toLowerCase();
                      const productName = item.productName.toLowerCase();

                      return searchTerm && productName.startsWith(searchTerm);
                    })
                    .map((item) => (
                      <div
                        onClick={() => {
                          setValue(item.productName);
                          setId(item.productId);
                        }}
                        className="dropdown-row bg-white p-1 searchbar"
                        style={{ cursor: "pointer" }}
                      >
                        {item.productName}
                      </div>
                    ))}
                </div>
              </Col>
              <Col lg="2">
                {console.log(id)}
                <Link to="/products" state={id}>
                  <button
                    style={{ height: "3em" }}
                    className="w-100 buton"
                    onClick={() => searchHandler(value)}
                  >
                    Search
                  </button>
                </Link>
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

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  async componentDidMount() {
    await axios.get(baseURL + "api/Products").then((res) => {
      this.setState({
        data: res.data,
      });
    });
  }
  render() {
    return <SearchBar data={this.state.data} />;
  }
}

export default Home;
