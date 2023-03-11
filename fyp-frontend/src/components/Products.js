import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import SearchBar from "./SearchBar";

const Products = (props) => {
  const [data, setData] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const baseUrl = "https://localhost:7005/";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q"));
  const searched = searchParams.get("q");
  const history = useNavigate();

  useEffect(() => {
    getSearchResult(searchTerm);
  }, [searchTerm]);

  const getSearchResult = (searchTerm) => {
    axios
      .get(`${baseUrl}api/SearchProducts/${searchTerm}`)
      .then((res) => {
        setData(res.data);
        setIsEmpty(res.data.length === 0);
      })
      .catch((e) => console.log(e));
  };
  console.log(data);
  const changeHandler = (e) => {
    setSearchTerm(e.target.value);
  };

  const submitHandler = (e) => {
    getSearchResult(searchTerm);
    history(`/products?q=${encodeURIComponent(searchTerm)}`);
    window.location.reload();
  };

  return (
    <div className="search-result">
      <NavBar />
      <SearchBar searchParams={searchParams.get("q")} />

      <Container className="search-content p-4">
        <Row className="mt-3">
          <h1 className="h3">Search Results for '{searched}'</h1>
        </Row>
        <hr className="hr-line" />
        <Row>
          <ProductCards
            searchTerm={searchTerm}
            searchParams={searchParams.get("q")}
          />
        </Row>
      </Container>
    </div>
  );
};

class ProductCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchTerm: this.props.searchTerm,
      isEmpty: false,
      searchParams: this.props.searchParams,
    };
  }

  async componentDidMount() {
    await axios
      .get("https://localhost:7005/api/SearchProducts/" + this.state.searchTerm)
      .then((res) => {
        this.setState({
          data: res.data,
          isEmpty: res.data.length === 0,
        });
      })
      .catch((e) => console.log(e));
  }

  render() {
    console.log(this.state.data);
    console.log(this.state.searchTerm);
    console.log(this.state.isEmpty);
    if (this.state.isEmpty) {
      return (
        <Col lg="12">
          <h2 className="h4">
            Sorry! No results found for {this.state.searchTerm}
          </h2>
        </Col>
      );
    }
    return this.state.data.map((e) => (
      <Col key={e.productId} lg="4">
        <Card style={{ overflow: "hidden" }}>
          <CardTitle>
            <img
              src={e.imgLink}
              alt={e.productName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </CardTitle>
          <CardBody>
            <CardHeader>{e.productName}</CardHeader>
            <Link
              to={"/product-details/" + e.productId}
              state={{ id: e.productId, searchParams: this.state.searchParams }}
            >
              <button className="buton mt-3 p-2">Compare Prices</button>
            </Link>
          </CardBody>
        </Card>
      </Col>
    ));
  }
}

export default Products;
