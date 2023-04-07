import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  NavbarBrand,
  NavItem,
  NavLink,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";

function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      setLoggedIn(true);
    }
  }, []);
  return (
    <div className="nav-bar">
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
                <DropdownItem
                  onClick={() => {
                    localStorage.removeItem("user-info");
                    navigate(0);
                  }}
                >
                  Log Out
                </DropdownItem>
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
