import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import {
  Container,
  Card,
  Table,
  CardBody,
  Button,
  CardHeader,
} from "reactstrap";
import axios from "axios";
import LoadingIcons from "react-loading-icons";

const UserProfile = () => {
  const baseUrl = "https://localhost:7005/";
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const userId = userInfo.userId;

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
        <div className="row">
          <div className="col-lg-9">
            <Table className="user-profile-table" striped hover>
              <thead>
                <tr className="t-head">
                  <th>Subscribed Products</th>
                  <th>Current Price</th>
                  <th>Go to Product</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Subscription 1</td>
                  <td>Active</td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>Subscription 2</td>
                  <td>Expired</td>
                </tr>
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
      </Container>
    </div>
  );
};

export default UserProfile;
