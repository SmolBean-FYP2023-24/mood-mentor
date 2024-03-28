import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import React, { useEffect } from "react";

function TopNav(props) {
  useEffect(() => {
    console.log("This is rerendered");
  });

  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary"
      bg="dark"
      data-bs-theme="dark"
      sticky="top"
      //   fixed="top"
    >
      <Container className="px-5" fluid>
        <Navbar.Brand href={"/"}>MoodMentor</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto column-gap-5" id="menu">
            <Nav.Link href={"/"}>Home</Nav.Link>
            <Nav.Link href={"/lex"}>Listening Exercise</Nav.Link>
            <Nav.Link href={"/eex"}>Expression Exercise</Nav.Link>
            <Nav.Link href={"/profile"}>Profile</Nav.Link>
            <Nav.Link
              className={`${props.showLogin !== 0 ? "d-none" : ""}`}
              href={"/auth"}
            >
              Login
            </Nav.Link>
            <NavDropdown
              title="Dropdown"
              id="basic-nav-dropdown"
              className="d-none"
            >
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNav;
