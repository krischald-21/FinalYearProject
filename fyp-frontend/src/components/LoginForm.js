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

const LoginForm = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [btnText, setBtnText] = useState("Log In");
  const [disableId, setDisableId] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const [validation, setValidation] = useState("");
  const [name, setName] = useState("");

  const [alert, setAlert] = useState(null);

  const showPassHandler = () => {
    setShowPassword((e) => !e);
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

  const passwordChange = (e) => {
    setPassword(e.target.value);
  };
  const emailAddressChange = (e) => {
    setEmailAddress(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnText("Logging In");
    setDisableBtn(true);
    setDisableId("btn-disabled");

    if (password.length < 8) {
      setValidation("Password should be at least 8 characters!!");
      setBtnText("Log In");
      setDisableBtn(false);
      setDisableId("");
    } else {
      await axios
        .post("https://localhost:7005/api/Login", {
          userEmail: emailAddress,
          userPassword: password,
        })
        .then((res) => {
          setName(res.data.userFullName);
          localStorage.setItem("user-info", JSON.stringify(res.data));
          console.log(res.data.userFullName);
          if (200 <= res.status && res.status < 300) {
            successAlert({
              title: "Logged In",
              message: "User logged in successfully!",
            });
          } else {
            warningAlert({
              title: "Log In Failed",
              message:
                "There has been an error in logging in the user. Please try again later!!",
            });
            setBtnText("Log In");
            setDisableBtn(false);
            setValidation("");
            setDisableId("");
          }
        })
        .catch((e) => {
          console.log(e);
          warningAlert({
            title: "Registration Failed",
            message: "Registration failed due to network error!!",
          });
          setBtnText("Log In");
          setDisableBtn(false);
          setValidation("");
          setDisableId("");
        });
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
                  <h1 className="h3 p-2">Log In</h1>
                </CardTitle>
                <CardBody>
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
                          top: "56%",
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
                          top: "56%",
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

export default LoginForm;
