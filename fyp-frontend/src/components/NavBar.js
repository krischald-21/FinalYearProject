import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Row,
  Col,
  Container,
  Nav,
  NavbarBrand,
  NavItem,
  NavLink,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";
import Modal from "react-modal";
import axios from "axios";

function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const [showModal, setShowModal] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  const fetchBrands = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7005/api/ProductBrands`
      );
      setBrands(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      height: "12em",
      width: "25em",
    },
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (userInfo) {
      setLoggedIn(true);
    }
    fetchBrands();
  }, []);

  return (
    <div className="nav-bar">
      <div className="popup-modal">
        <Modal
          isOpen={showModal}
          contentLabel="Confirm Log Out"
          style={customStyles}
        >
          <Container>
            <span
              onClick={handleCloseModal}
              className="fw-bold material-icons"
              style={{
                position: "absolute",
                right: "5%",
                top: "5%",
                fontSize: "1.5em",
                cursor: "pointer",
                color: "#8e3ac9",
                pointerEvents: confirming ? "none" : "all",
              }}
            >
              close
            </span>
            <br />
            <Row>
              <Col lg="12">
                <h1 className="h3">Confirm Log Out</h1>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg="4">
                <button
                  className="btn btn-outline-success"
                  onClick={() => {
                    setConfirming(true);
                    localStorage.removeItem("user-info");
                    navigate("/");
                    handleCloseModal();
                    setLoggedIn(false);
                  }}
                >
                  Confirm
                </button>
              </Col>
              <Col lg="4"></Col>
              <Col lg="4">
                <button
                  className="btn btn-outline-danger"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </Col>
            </Row>
          </Container>
        </Modal>
      </div>
      <Navbar expand="md" className="p-3">
        <NavbarBrand
          href="/"
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "1.5em",
            color: "#8e3ac9",
          }}
        >
          KunSasto
        </NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink className="mt-1" id="navLink" href="/">
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="mt-1" id="navLink" href="/contact-form">
              Contact
            </NavLink>
          </NavItem>
          <NavItem>
            <Dropdown
              isOpen={brandOpen}
              toggle={() => setBrandOpen(!brandOpen)}
              className="w-100"
            >
              <DropdownToggle
                caret
                className="w-100 text-left"
                id="navLink"
                style={{
                  backgroundColor: "transparent",
                  marginTop: "0.30em",
                  outline: "none",
                  border: "none",
                }}
              >
                Laptop By Brands
              </DropdownToggle>
              <DropdownMenu className="w-100">
                {brands.map((e) => (
                  <DropdownItem
                    onClick={() =>
                      navigate(`/products?q=${encodeURIComponent(e)}`)
                    }
                  >
                    {e}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </NavItem>
          {loggedIn ? (
            <Dropdown
              isOpen={isOpen}
              toggle={() => setIsOpen(!isOpen)}
              className="w-100"
            >
              <DropdownToggle
                caret
                className="w-100 text-left"
                id="navLink"
                style={{
                  backgroundColor: "transparent",
                  marginTop: "0.30em",
                  outline: "none",
                  border: "none",
                }}
              >
                {userInfo.userFullName}
              </DropdownToggle>
              <DropdownMenu className="w-100">
                <DropdownItem onClick={() => navigate("/user-info")}>
                  User Information
                </DropdownItem>
                <DropdownItem onClick={handleOpenModal}>Log Out</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <>
              <NavItem>
                <NavLink id="navLink" href="/register-form">
                  <button className="notub w-100">Register</button>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink id="navLink" href="/login-form">
                  <button className="notub w-100">Login</button>
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBar;
