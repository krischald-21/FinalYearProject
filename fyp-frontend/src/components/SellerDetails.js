import React from "react";
import { useLocation } from "react-router-dom";
import { Table, Container } from "reactstrap";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { GetUserProducts } from "./UserProfile";

const SellerDetails = () => {
  const location = useLocation();
  const state = location.state;
  const userId = state.userId;
  const userName = state.userName;
  const baseUrl = "https://localhost:7005/";

  const fetchUserDetails = async (id) => {};

  return (
    <div className="seller-details">
      <NavBar />
      <Container>
        <h1 className="h3">{userName}'s Products</h1>
        <Table className="user-profile-table mt-5" striped hover>
          <thead>
            <tr className="t-head">
              <th>Product Name</th>
              <th>Product Page</th>
            </tr>
          </thead>
          <tbody>
            <GetUserProducts baseUrl={baseUrl} userId={userId} />
          </tbody>
        </Table>
      </Container>
      <Footer />
    </div>
  );
};

export default SellerDetails;
