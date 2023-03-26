import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Badge,
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
import ReactPaginate from "react-paginate";

const Products = ({ itemsPerPage }) => {
  const baseUrl = "https://localhost:7005/";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("q");

  const fetchSearchResults = async (query) => {
    try {
      const response = await axios.get(
        `${baseUrl}api/SearchProducts/${searchTerm}`
      );
      setItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSearchResults(searchTerm);
  }, [searchTerm]);
  console.log(items);

  const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <div>
      <NavBar />
      <SearchBar searchParams={searchParams.get("q")} />
      <Container>
        <Row>
          <Items currentItems={currentItems} searchParams={searchTerm} />
        </Row>
        <ReactPaginate
          className="pagination"
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
        />
      </Container>
    </div>
  );
};

const Items = ({ currentItems, searchParams }) => {
  return (
    <>
      {currentItems &&
        currentItems.map((e) => (
          <Col key={e.productId} lg="4">
            <Card className="mb-3" style={{ overflow: "hidden" }}>
              <CardTitle>
                <img
                  src={e.imgLink}
                  alt={e.productName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </CardTitle>
              <CardBody>
                <CardHeader>{e.productName}</CardHeader>
                <Row>
                  <Chips productId={e.productId} />
                </Row>
                <Link
                  to={"/product-details/" + e.productId}
                  state={{
                    id: e.productId,
                    searchParams: searchParams,
                  }}
                >
                  <button className="buton mt-3 p-2">Compare Prices</button>
                </Link>
              </CardBody>
            </Card>
          </Col>
        ))}
    </>
  );
};

class Chips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      productId: this.props.productId,
    };
  }

  async componentDidMount() {
    await axios
      .get("https://localhost:7005/api/SameProduct/" + this.state.productId)
      .then((res) => {
        this.setState({
          data: res.data,
          isEmpty: res.data.length === 0,
        });
      })
      .catch((e) => console.log(e));
  }

  render() {
    return this.state.data.map((e) => (
      <Col key={e.storeProductId} lg="4">
        <Badge color="dark">{e.store.storeName}</Badge>
      </Col>
    ));
  }
}

export default Products;
