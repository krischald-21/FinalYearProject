import axios from "axios";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import NavBar from "./NavBar";
import SearchBar from "./SearchBar";

const ProductDetail = () => {
  const location = useLocation();
  const state = location.state;
  console.log(state);
  return (
    <div>
      <NavBar />
      <SearchBar searchParams={state.searchParams} />
      <Container>
        <hr className="hr-line"></hr>
        <DetailContent id={state.id} />
      </Container>
    </div>
  );
};

class DetailContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      productData: [],
      storeData: [],
      id: this.props.id,
    };
  }

  async componentDidMount() {
    await axios
      .get(`https://localhost:7005/api/SameProduct/${this.state.id}`)
      .then((res) => {
        this.setState({
          data: res.data,
        });
      })
      .catch((e) => console.log(e));

    await axios
      .get(`https://localhost:7005/api/Products/${this.state.id}`)
      .then((res) => {
        this.setState({
          productData: res.data,
        });
      })
      .catch((e) => console.log(e));

    await axios
      .get(`https://localhost:7005/api/Stores`)
      .then((res) => {
        this.setState({
          storeData: res.data,
        });
      })
      .catch((e) => console.log(e));
  }

  render() {
    return (
      <div>
        <Row style={{ textAlign: "left" }}>
          <Col lg="5" style={{ overflow: "hidden" }}>
            <img
              src={this.state.productData.imgLink}
              alt={this.state.productData.productName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Col>
          <Col lg="1" />
          <Col lg="6">
            <h3 className="h4 mt-5">{this.state.productData.productName}</h3>
            <hr className="hr-line"></hr>
            <Card className="p-3 bg-dark text-white">
              <CardTitle>
                <h4 className="h6 mt-3">
                  Laptop available in following stores:
                </h4>
              </CardTitle>
              <CardBody>
                {this.state.data.map((e) => (
                  <div className="available-stores" key={e.storeId}>
                    <Row className="mt-1 mb-1 h-100">
                      <Col md="6">
                        <img
                          src={e.store.imgLink}
                          alt={e.store.storeName}
                          style={{
                            width: "70%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Col>
                      <Col md="6">
                        <CardText className="text-uppercase">
                          {e.storeName}
                        </CardText>
                      </Col>
                    </Row>
                  </div>
                ))}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-2 mb-2">
          <hr className="hr-line" />
          <h3 className="h5">Find Price Comparison Below</h3>
        </Row>
        <div className="mt-2 mb-3">
          {this.state.data.map((e) => (
            <Card className="bg-dark text-white h-100 mt-2 mb-2">
              <CardBody>
                <Row className="fw-bold d-flex justify-content-center align-items-center">
                  <Col lg="3">
                    <CardText>Price in</CardText>
                  </Col>
                  <Col lg="3" style={{ overflow: "hidden" }}>
                    <img
                      src={e.store.imgLink}
                      alt={e.store.storeName}
                      style={{
                        width: "100%",
                        height: "6em",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col lg="3">
                    <CardText>Rs. {e.price}</CardText>
                  </Col>
                  <Col lg="3">
                    <Link to={e.productLink}>
                      <button className="buton w-100" style={{ height: "3em" }}>
                        Buy from {e.store.storeName}
                      </button>
                    </Link>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }
}

export default ProductDetail;
