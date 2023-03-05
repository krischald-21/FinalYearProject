import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavbarBrand, NavItem, NavLink } from "reactstrap";

function NavBar() {
  return (
    <div className="nav-bar">
      <Navbar expand="md" className="p-3">
        <NavbarBrand
          id="navLink"
          href="/"
          style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.5em" }}
        >
          KunSasto
        </NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink id="navLink" href="/">
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink id="navLink" href="/">
              Contact
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBar;
