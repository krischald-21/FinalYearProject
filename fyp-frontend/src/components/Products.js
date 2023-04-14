import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingIcons from "react-loading-icons";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";
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
      setLoading(false);
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
        {loading ? (
          <LoadingIcons.TailSpin stroke="#7A62E4" />
        ) : (
          <>
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
          </>
        )}
      </Container>
    </div>
  );
};

const Items = ({ currentItems, searchParams }) => {
  if (!currentItems || currentItems.length === 0) {
    return <p className="fw-bold">No results found for {searchParams}</p>;
  }
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
      .get("https://localhost:7005/api/AvailableStores/" + this.state.productId)
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
      <Col key={e} lg="4">
        {/* <Badge color="dark">{e}</Badge> */}
        {e === "daraz" ? (
          <img
            src="https://superdesk-pro-c.s3.amazonaws.com/sd-nepalitimes/20221109141144/636baf8d9c7e80680e078059png.png"
            alt="daraz_logo"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <></>
        )}
        {e === "sastodeal" ? (
          <img
            src="https://s3-us-west-2.amazonaws.com/cbi-image-service-prd/modified/6267e600-c16f-4a47-8be1-c2e511ae0498.png"
            alt="sastodeal_logo"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <></>
        )}
        {e === "itti" ? (
          <img
            src="https://itti.com.np/pub/media/logo/stores/1/itti-logo.png"
            alt="itti_logo"
            className="bg-dark"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <></>
        )}
      </Col>
    ));
  }
}

export default Products;
