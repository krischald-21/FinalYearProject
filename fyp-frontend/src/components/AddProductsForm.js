import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import SelectSearch from "react-select-search";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Container,
  Row,
  Col,
} from "reactstrap";
import { TextField } from "@mui/material";
import axios from "axios";
import LoadingIcons from "react-loading-icons";
import ReactBSAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";

const AddProductsForm = () => {
  const userInfo = JSON.parse(localStorage.getItem("user-info"));

  const [storeId, setStoreId] = useState();
  const [product, setProduct] = useState([]);
  const [productLink, setProductLink] = useState(userInfo.userEmail);
  const [price, setPrice] = useState(0);
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState();

  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const [btnText, setBtnText] = useState("Add Product");
  const [disabledId, setDisableId] = useState("");
  const [btnDisable, setBtnDisable] = useState(false);
  const [validation, setValidation] = useState("");

  const [loading, setLoading] = useState(true);
  const userTypeId = userInfo.userTypeId;
  const userId = userInfo.userId;
  const baseUrl = "https://localhost:7005/";

  const priceChange = (e) => {
    setPrice(e.target.value);
  };

  const productNameChange = (e) => {
    setProductName(e.target.value);
    setProductId();
  };

  const handleProductClick = (e) => {
    setProductName(e.productName);
    setProductId(e.productId);
    console.log(e.productName, e.productId);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setDisableId("btn-disabled");
    setBtnText("Adding");
    setBtnDisable(true);
    setValidation("");

    if (price <= 0) {
      setValidation("Price should be above Rs. 0!!");
      setDisableId("");
      setBtnText("Add Product");
      setBtnDisable(false);
    } else if (!productId) {
      setValidation("Please select a valid product or contact admin!!");
      setDisableId("");
      setBtnText("Add Product");
      setBtnDisable(false);
    } else {
      await axios
        .post(`${baseUrl}api/StoreProducts`, {
          storeId: storeId,
          productId: productId,
          price: price,
          productLink: productLink,
        })
        .then((res) => {
          if (200 <= res.status && res.status < 300) {
            successAlert({
              title: "Product Added Successfully",
              message: "Your Product was added successfully!!",
            });
          } else {
            warningAlert({
              title: "Product Adding Failed",
              message:
                "There has been an error in adding the product. Please try again later!!",
            });
            setDisableId("");
            setBtnText("Add Product");
            setBtnDisable(false);
            setValidation("");
          }
        })
        .catch((e) => {
          console.log(e);
          warningAlert({
            title: "Product Adding Failed",
            message: "Product Adding failed due to network error!!",
          });
          setDisableId("");
          setBtnText("Add Product");
          setBtnDisable(false);
          setValidation("");
        });
    }
  };

  const successAlert = (props) => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block" }}
        title={props.title}
        onConfirm={() => navigate("/user-info")}
        onCancel={() => navigate("/user-info")}
        confirmBtnBsStyle="success"
        confirmBtnText="Ok"
        btnSize=""
      >
        {props.message}
      </ReactBSAlert>
    );
  };

  const warningAlert = (props) => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block" }}
        title={props.title}
        onConfirm={() => navigate(0)}
        onCancel={() => navigate(0)}
        confirmBtnBsStyle="warning"
        confirmBtnText="Ok"
        btnSize=""
      >
        {props.message}
      </ReactBSAlert>
    );
  };

  const fetchStore = async (userId) => {
    try {
      const response = await axios.get(`${baseUrl}api/UserStores/${userId}`);
      setStoreId(response.data.storeId);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}api/Products`);
      setProduct(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchStore(userId);
    fetchProducts();
    setLoading(false);
  }, [userId]);

  if (loading) {
    return <LoadingIcons.TailSpin stroke="#8e3ac9" />;
  }

  if (userTypeId == 6 && !loading) {
    return (
      <div className="add-products homepage">
        {alert}
        <NavBar />
        <Container style={{ width: "40%" }}>
          <Card
            style={{
              backgroundColor: "rgba(255,255,255, 0.9)",
              borderColor: "#8e3ac9",
            }}
            className="p-3"
          >
            <CardHeader>
              <CardTitle>
                <h1 className="h3">Add Products</h1>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <form onSubmit={submitHandler}>
                <Row>
                  <Col lg="12">
                    <TextField
                      id="filled-basic"
                      label="Product"
                      placeholder="Search for Products"
                      variant="filled"
                      className="w-100"
                      type="text"
                      required
                      value={productName}
                      onChange={productNameChange}
                      margin="normal"
                      color="primary"
                      disabled={btnDisable}
                    />
                    <div className="items w-100">
                      {product
                        .filter((item) => {
                          const searchTerm = productName.toLowerCase();
                          const pName = item.productName.toLowerCase();
                          return (
                            searchTerm &&
                            pName.startsWith(searchTerm) &&
                            pName !== searchTerm
                          );
                        })
                        .map((item) => (
                          <div
                            key={item.productId}
                            className="dropdown-row"
                            onClick={() => handleProductClick(item)}
                          >
                            {item.productName}
                          </div>
                        ))}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg="12">
                    <TextField
                      id="filled-basic"
                      label="Price"
                      variant="filled"
                      className="w-100"
                      type="number"
                      required
                      value={price}
                      onChange={priceChange}
                      margin="normal"
                      color="primary"
                      disabled={btnDisable}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg="12">
                    <button
                      className="buton pt-2 pb-2 w-100"
                      id={disabledId}
                      disabled={btnDisable}
                    >
                      {btnText}
                    </button>
                  </Col>
                </Row>
                <Row>
                  <h2 className="h4 text-danger">{validation}</h2>
                </Row>
              </form>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }
};

export default AddProductsForm;
