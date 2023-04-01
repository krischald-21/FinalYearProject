import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";
import NavBar from "./NavBar";
import "./../App.css";
import { useNavigate } from "react-router-dom";
import ReactBSAlert from "react-bootstrap-sweetalert";
import axios from "axios";

const RegisterForm = () => {
  const [fullname, setFullname] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [btnText, setBtnText] = useState("Register");
  const [disableId, setDisableId] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const [validation, setValidation] = useState("");

  const [alert, setAlert] = useState(null);

  const showPassHandler = () => {
    setShowPassword((e) => !e);
  };
  const showCPassHandler = () => {
    setShowCPassword((e) => !e);
  };

  const successAlert = (props) => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block" }}
        title={props.title}
        onConfirm={() => navigate("/")}
        onCancel={() => navigate("/")}
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

  const navigate = useNavigate();

  const fullnameChange = (e) => {
    setFullname(e.target.value);
  };
  const passwordChange = (e) => {
    setPassword(e.target.value);
  };
  const emailAddressChange = (e) => {
    setEmailAddress(e.target.value);
  };
  const confirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setDisableBtn(true);
    setBtnText("Registering");
    setDisableId("btn-disabled");

    if (password === confirmPassword) {
      if (password.length < 8) {
        setValidation("Passwords should have at least 8 characters!!");
        setBtnText("Register");
        setDisableId("");
        setDisableBtn(false);
      } else {
        axios
          .post("https://localhost:7005/api/Register", {
            userFullName: fullname,
            userEmail: emailAddress,
            userTypeId: 1,
            userPassword: password,
          })
          .then((res) => {
            if (200 <= res.status && res.status < 300) {
              successAlert({
                title: "Registered",
                message: "New user has been registered!",
              });
            } else {
              warningAlert({
                title: "Registration Failed",
                message:
                  "There has been an error in registering the user. Please try again later!!",
              });
              setBtnText("Register");
              setDisableId("");
              setValidation("");
              setDisableBtn(false);
            }
          })
          .catch((e) => {
            console.log(e);
            if (e.response.status && e.response.status == 404) {
              warningAlert({
                title: "Registration Failed",
                message: "User with the email already exists!!",
              });
            } else {
              warningAlert({
                title: "Registration Failed",
                message: "Registration failed due to network error!!",
              });
            }

            setBtnText("Register");
            setDisableId("");
            setDisableBtn(false);
            setValidation("");
          });
      }
    } else {
      setValidation("Passwords do not match!!");
      setBtnText("Register");
      setDisableId("");
      setDisableBtn(false);
    }
  };

  return (
    <div className="contact-form homepage">
      {alert}
      <NavBar />
      <Container className="mt-5" style={{ width: "40%" }}>
        <div className="form-content">
          <form onSubmit={submitHandler}>
            <Card
              style={{
                backgroundColor: "rgba(255,255,255,0.3)",
                borderColor: "#8e3ac9",
              }}
              className="p-3"
            >
              <Container>
                <CardTitle>
                  <h1 className="h3 p-2">Register User</h1>
                </CardTitle>
                <CardBody>
                  <Row>
                    <input
                      type="text"
                      max={255}
                      placeholder="Full name"
                      value={fullname}
                      className="contact-tf"
                      onChange={fullnameChange}
                      required
                    />
                  </Row>
                  <Row>
                    <input
                      type="email"
                      max={255}
                      placeholder="Email Address"
                      value={emailAddress}
                      className="contact-tf"
                      onChange={emailAddressChange}
                      required
                    />
                  </Row>
                  <Row>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      min="8"
                      className="contact-tf"
                      onChange={passwordChange}
                      required
                    />
                    {showPassword ? (
                      <span
                        className="material-icons eye-icon"
                        onClick={showPassHandler}
                        style={{
                          position: "absolute",
                          top: "53%",
                          left: "85%",
                          width: "5%",
                        }}
                      >
                        remove_red_eye
                      </span>
                    ) : (
                      <span
                        className="material-icons-outlined eye-icon"
                        onClick={showPassHandler}
                        style={{
                          position: "absolute",
                          top: "53%",
                          left: "85%",
                          width: "5%",
                        }}
                      >
                        remove_red_eye
                      </span>
                    )}
                  </Row>
                  <Row>
                    <input
                      type={showCPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      min="8"
                      className="contact-tf"
                      onChange={confirmPasswordChange}
                      required
                    />
                    {showCPassword ? (
                      <span
                        className="material-icons eye-icon"
                        onClick={showCPassHandler}
                        style={{
                          position: "absolute",
                          top: "69%",
                          left: "85%",
                          width: "5%",
                        }}
                      >
                        remove_red_eye
                      </span>
                    ) : (
                      <span
                        className="material-icons-outlined eye-icon"
                        onClick={showCPassHandler}
                        style={{
                          position: "absolute",
                          top: "69%",
                          left: "85%",
                          width: "5%",
                        }}
                      >
                        remove_red_eye
                      </span>
                    )}
                  </Row>
                  <Row>
                    <h3 className="h5 text-danger">{validation}</h3>
                  </Row>
                  <Row>
                    <Col lg="12">
                      <button
                        className="buton"
                        style={{ padding: "0.5em 1em" }}
                        id={disableId}
                        disabled={disableBtn}
                      >
                        {btnText}
                      </button>
                    </Col>
                  </Row>
                </CardBody>
              </Container>
            </Card>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default RegisterForm;
