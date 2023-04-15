import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import {
  Container,
  Card,
  Table,
  CardBody,
  Row,
  Col,
  CardHeader,
} from "reactstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingIcons from "react-loading-icons";
import Footer from "./Footer";

const UserProfile = () => {
  const baseUrl = "https://localhost:7005/";
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const userId = userInfo.userId;
  const userTypeId = userInfo.userTypeId;

  const fetchUserData = async (query) => {
    try {
      const response = await axios.get(`${baseUrl}api/Users/${query}`);
      setLoading(false);
      setUserData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchUserData(userId);
  }, userId);

  if (loading) {
    return (
      <>
        <LoadingIcons.TailSpin stroke="#7A62E4" />
      </>
    );
  }
  return (
    <div className="profile">
      <NavBar />
      <Container className="w-100 mt-3 user-profile-container">
        <h1 className="h3">My Subscriptions</h1>
        <div className="row mt-5">
          <div className="col-lg-9">
            <Table className="user-profile-table" striped hover>
              <thead>
                <tr className="t-head">
                  <th>Subscribed Products</th>
                  <th>Product Page</th>
                </tr>
              </thead>
              <tbody>
                <GetUserSubscriptions userId={userId} />
              </tbody>
            </Table>
          </div>
          <div className="col-lg-3">
            <Card className="user-profile-card">
              <CardHeader className="user-profile-header">
                <h4 className="user-profile-fullname">
                  {userData.userFullName}
                </h4>
              </CardHeader>
              <CardBody>
                <p className="user-profile-email">{userData.userEmail}</p>
                <div className="user-profile-header-section">
                  <a href="/change-password">
                    <button className="buton">Change Password</button>
                  </a>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
        {userTypeId === 1 ? (
          <>
            <hr className="hr-line mt-5" />
            <h1 className="h3">Seller's Information</h1>
            <Row className="mt-4 mb-3">
              <Col lg="9"></Col>
              <Col lg="3">
                <a href="/register-seller">
                  <button className="buton w-50">Add Sellers</button>
                </a>
              </Col>
            </Row>
            <Row>
              <Table className="user-profile-table" striped hover>
                <thead>
                  <tr className="t-head">
                    <th>Seller's Name</th>
                    <th>Seller's Email</th>
                  </tr>
                </thead>
                <tbody>
                  <GetSellers />
                </tbody>
              </Table>
            </Row>
          </>
        ) : (
          <></>
        )}
        {userTypeId === 6 ? (
          <>
            <hr className="hr-line mt-5" />
            <h1 className="h3">My Products</h1>
            <Row className="mt-4 mb-3">
              <Col lg="9"></Col>
              <Col lg="3">
                <a href="/add-products">
                  <button className="buton w-50">Add Products</button>
                </a>
              </Col>
            </Row>
            <Row>
              <Table className="user-profile-table" striped hover>
                <thead>
                  <tr className="t-head">
                    <th>Product Name</th>
                    <th>Product Page</th>
                  </tr>
                </thead>
                <tbody>
                  <GetUserProducts userId={userId} baseUrl={baseUrl} />
                </tbody>
              </Table>
            </Row>
          </>
        ) : (
          <></>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export class GetUserProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      userId: this.props.userId,
      baseUrl: this.props.baseUrl,
    };
  }
  async componentDidMount() {
    await axios
      .get(`${this.state.baseUrl}api/UserProducts/${this.state.userId}`)
      .then((res) => {
        this.setState({
          data: res.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <>
        {this.state.data.map((e) => (
          <tr key={e.productId}>
            <td>{e.productName}</td>
            <td>
              <Link
                to={"/product-details/" + e.productId}
                state={{
                  id: e.productId,
                  searchParams: "",
                }}
              >
                <button className="notub">Visit Page</button>
              </Link>
            </td>
          </tr>
        ))}
      </>
    );
  }
}

class GetSellers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      baseUrl: "https://localhost:7005/",
      loading: true,
    };
  }

  async componentDidMount() {
    await axios
      .get(`${this.state.baseUrl}api/Sellers`)
      .then((res) => {
        this.setState({
          data: res.data,
          loading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    if (this.state.loading) {
      return <LoadingIcons.TailSpin stroke="#7A62E4" />;
    }
    return (
      <>
        {this.state.data.map((e) => (
          <tr key={e.userId}>
            <td>
              <Link
                to="/seller-details"
                className="names"
                state={{
                  userId: e.userId,
                  userName: e.userFullName,
                }}
              >
                {e.userFullName}
              </Link>
            </td>
            <td>
              <a className="mail-link" href={`mailto:${e.userEmail}`}>
                {e.userEmail}
              </a>
            </td>
          </tr>
        ))}
      </>
    );
  }
}

class GetUserSubscriptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      userId: this.props.userId,
      baseUrl: "https://localhost:7005/",
    };
  }

  async componentDidMount() {
    await axios
      .get(`${this.state.baseUrl}api/UserSubscriptions/${this.state.userId}`)
      .then((res) => {
        this.setState({
          data: res.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <>
        {this.state.data.map((e) => (
          <tr key={e.productId}>
            <td>{e.productName}</td>
            <td>
              <Link
                to={"/product-details/" + e.productId}
                state={{
                  id: e.productId,
                  searchParams: "",
                }}
              >
                <button className="notub">Visit Page</button>
              </Link>
            </td>
          </tr>
        ))}
      </>
    );
  }
}

export default UserProfile;
