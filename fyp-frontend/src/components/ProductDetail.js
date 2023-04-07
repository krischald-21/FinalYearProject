import axios from "axios";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import ReactBSAlert from "react-bootstrap-sweetalert";
import Modal from "react-modal";
import LoadingIcons from "react-loading-icons";

const ProductDetail = () => {
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();
  return (
    <div>
      <NavBar />
      <SearchBar searchParams={state.searchParams} />
      <Container>
        <hr className="hr-line"></hr>
        <DetailContent navigate={navigate} id={state.id} />
      </Container>
    </div>
  );
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "14em",
    width: "25em",
  },
};

const userInfo = JSON.parse(localStorage.getItem("user-info"));

class DetailContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      productData: [],
      storeData: [],
      userInfo: userInfo,
      id: this.props.id,
      alert: null,
      navigate: this.props.navigate,
      showModal: false,
      showRemoveModal: false,
      isLoggedIn: localStorage.getItem("user-info") ? true : false,
      isSubscribed: false,
      confirming: false,
      removing: false,
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleRemoveOpenModal = this.handleRemoveOpenModal.bind(this);
    this.handleRemoveCloseModal = this.handleRemoveCloseModal.bind(this);
    this.subscribeHandler = this.subscribeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.removeSubscription = this.removeSubscription.bind(this);
  }

  async subscribeHandler() {
    this.setState({ confirming: true });
    await axios
      .post("https://localhost:7005/api/Subscribe", {
        userId: this.state.userInfo.userId,
        productId: this.state.id,
      })
      .then((res) => {
        if (200 <= res.status && res.status < 300) {
          this.submitHandler();
          this.successAlert({
            title: "Subscription Successful",
            message:
              "User successfully Subscribed for Price drop Alert of this product!!",
          });
        } else {
          this.submitHandler();
          this.warningAlert({
            title: "Subscription Failed",
            message:
              "There has been an error in subscribing the user. Please try again later!!",
          });
        }
      })
      .catch((e) => {
        console.log(e);
        this.submitHandler();
        this.warningAlert({
          title: "Subscription Failed",
          message: "Subscription failed due to network error!!",
        });
      });
  }

  async removeSubscription() {
    console.log(this.state.userInfo.userId);
    console.log(this.state.id);
    this.setState({ removing: true });
    await axios
      .delete(
        `https://localhost:7005/api/RemoveSubscription/${this.state.userInfo.userId}/${this.state.id}`,
        {
          userId: this.state.userInfo.userId,
          productId: this.state.id,
        }
      )
      .then((res) => {
        if (200 <= res.status && res.status < 300) {
          this.successAlert({
            title: "Subscription Removed Successfully",
            message:
              "User's subscription to the Price drop Alert of this product has been removed!!",
          });
        } else {
          this.warningAlert({
            title: "Subscription Not Removed",
            message:
              "There has been an error in removing user's subscription to this product. Please try again later!!",
          });
        }
      })
      .catch((e) => {
        console.log(e);
        this.warningAlert({
          title: "Subscription Not Removed",
          message: "Subscription Removal failed due to network error!!",
        });
      });
  }

  submitHandler() {
    this.setState({ confirming: false });
    this.setState({ removing: false });
    this.handleCloseModal();
    this.handleRemoveCloseModal();
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleRemoveOpenModal() {
    this.setState({ showRemoveModal: true });
  }

  handleRemoveCloseModal() {
    this.setState({ showRemoveModal: false });
  }

  successAlert(props) {
    this.setState({
      alert: (
        <ReactBSAlert
          success
          style={{ display: "block" }}
          title={props.title}
          onConfirm={() => this.state.navigate(0)}
          onCancel={() => this.state.navigate(0)}
          confirmBtnBsStyle="success"
          confirmBtnText="Ok"
          btnSize=""
        >
          {props.message}
        </ReactBSAlert>
      ),
    });
  }

  warningAlert(props) {
    this.setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: "block" }}
          title={props.title}
          confirmBtnBsStyle="warning"
          confirmBtnText="Ok"
          btnSize=""
        >
          {props.message}
        </ReactBSAlert>
      ),
    });
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
    await axios
      .get(
        `https://localhost:7005/api/IsSubscribed/${this.state.userInfo.userId}/${this.state.id}`
      )
      .then((res) => {
        this.setState({
          isSubscribed: res.data,
        });
      })
      .catch((e) => console.log(e));
  }

  render() {
    return (
      <div>
        {this.state.alert}
        <div className="popup-modal">
          <Modal
            isOpen={this.state.showModal}
            contentLabel="Subscribe to Price Drop Alert"
            style={customStyles}
          >
            <Container>
              <span
                onClick={this.handleCloseModal}
                className="fw-bold material-icons"
                style={{
                  position: "absolute",
                  right: "5%",
                  top: "5%",
                  fontSize: "1.5em",
                  cursor: "pointer",
                  color: "#8e3ac9",
                  pointerEvents: this.state.confirming ? "none" : "all",
                }}
              >
                close
              </span>
              <br />
              <Row>
                <Col lg="12">
                  <h1 className="h3">Subscription Confirmation</h1>
                </Col>
              </Row>
              <Row></Row>
              {this.state.isLoggedIn ? (
                <>
                  <Row>
                    <Col lg="12">
                      <p>Please confirm subscription to Price Drop Alert!!</p>
                    </Col>
                  </Row>
                  <Row></Row>
                  {this.state.confirming ? (
                    <Row>
                      <Col lg="6">
                        <button className="btn btn-success" disabled>
                          Confirming
                          <LoadingIcons.TailSpin
                            stroke="white"
                            style={{
                              height: "20px",
                              width: "20px",
                              marginLeft: "1em",
                            }}
                          />
                        </button>
                      </Col>
                    </Row>
                  ) : (
                    <Row>
                      <Col lg="4">
                        <button
                          className="btn btn-outline-success"
                          onClick={this.subscribeHandler}
                        >
                          Confirm
                        </button>
                      </Col>
                      <Col lg="4"></Col>
                      <Col lg="4">
                        <button
                          className="btn btn-outline-danger"
                          onClick={this.handleCloseModal}
                        >
                          Cancel
                        </button>
                      </Col>
                    </Row>
                  )}
                </>
              ) : (
                <>
                  <Row>
                    <Col lg="12">
                      <p>Please Log Into Your Account to Subscribe!!</p>
                    </Col>
                  </Row>
                  <Row></Row>
                  <Row>
                    <Col lg="4">
                      <button
                        className="notub"
                        onClick={() => this.state.navigate("/login-form")}
                      >
                        Log In
                      </button>
                    </Col>
                  </Row>
                </>
              )}
            </Container>
          </Modal>
          <Modal
            isOpen={this.state.showRemoveModal}
            contentLabel="Remove Subscription"
            style={customStyles}
          >
            <Container>
              <span
                onClick={this.handleRemoveCloseModal}
                className="fw-bold material-icons"
                style={{
                  position: "absolute",
                  right: "5%",
                  top: "5%",
                  fontSize: "1.5em",
                  cursor: "pointer",
                  color: "#8e3ac9",
                  pointerEvents: this.state.confirming ? "none" : "all",
                }}
              >
                close
              </span>
              <br />
              <Row>
                <Col lg="12">
                  <h1 className="h3">Subscription Removal</h1>
                </Col>
              </Row>
              <Row></Row>
              <Row>
                <Col lg="12">
                  <p>Please confirm cancellation of Subscription!!</p>
                </Col>
              </Row>
              <Row></Row>
              {this.state.removing ? (
                <Row>
                  <Col lg="6">
                    <button className="btn btn-success" disabled>
                      Removing
                      <LoadingIcons.TailSpin
                        stroke="white"
                        style={{
                          height: "20px",
                          width: "20px",
                          marginLeft: "1em",
                        }}
                      />
                    </button>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col lg="4">
                    <button
                      className="btn btn-outline-success"
                      onClick={this.removeSubscription}
                    >
                      Confirm
                    </button>
                  </Col>
                  <Col lg="4"></Col>
                  <Col lg="4">
                    <button
                      className="btn btn-outline-danger"
                      onClick={this.handleRemoveCloseModal}
                    >
                      Cancel
                    </button>
                  </Col>
                </Row>
              )}
            </Container>
          </Modal>
        </div>
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
            <Card className="p-3">
              <CardTitle>
                <h4 className="h6 mt-3">
                  Laptop available in following stores:
                </h4>
              </CardTitle>
              <CardBody className="bg-dark text-white">
                <div className="available-stores">
                  {this.state.data.map((e) => (
                    <Row className="mt-1 mb-1 h-100" key={e.storeId}>
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
                    </Row>
                  ))}
                </div>
              </CardBody>
            </Card>
            <div className="price-drop-sub w-100">
              <Row>
                {this.state.isSubscribed ? (
                  <>
                    <Col lg="6">
                      <button
                        className="notub-disabled mt-3 p-3 w-100 eye-icon"
                        disabled
                      >
                        Already Subscribed
                      </button>
                    </Col>
                    <Col lg="6">
                      <button
                        className="btn btn-outline-danger mt-3 p-3 w-100"
                        onClick={this.handleRemoveOpenModal}
                      >
                        Remove Subscription
                      </button>
                    </Col>
                  </>
                ) : (
                  <button
                    className="notub mt-3 p-3 w-100"
                    onClick={this.handleOpenModal}
                    disabled={this.state.isSubscribed}
                  >
                    Subscribe for Price Drop Alert
                  </button>
                )}
              </Row>
            </div>
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
                        objectFit: "contain",
                      }}
                    />
                  </Col>
                  <Col lg="3">
                    <CardText>Rs. {e.price}</CardText>
                  </Col>
                  <Col lg="3">
                    <Link to={e.productLink} target="_blank">
                      <button className="notub w-100" style={{ height: "3em" }}>
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
