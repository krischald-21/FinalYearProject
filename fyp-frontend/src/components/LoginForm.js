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
import TextField from "@mui/material/TextField";
import NavBar from "./NavBar";
import "./../App.css";
import { useNavigate } from "react-router-dom";
import ReactBSAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import {
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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
        onConfirm={() => navigate("/user-info")}
        onCancel={() => navigate("/user-info")}
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
          if (
            e.response.data.message &&
            e.response.data.message === "INVALID_PASSWORD"
          ) {
            warningAlert({
              title: "Log In Failed",
              message: "Please enter correct Password!!",
            });
          } else if (
            e.response.data.message &&
            e.response.data.message === "INVALID_USER"
          ) {
            warningAlert({
              title: "Log In Failed",
              message: "User not registered in the system!!",
            });
          } else {
            warningAlert({
              title: "Log In Failed",
              message: "Log In failed due to network error!!",
            });
          }
          console.log(e);

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
                backgroundColor: "rgba(255,255,255, 0.9)",
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
                    <TextField
                      id="filled-basic"
                      label="Email Address"
                      variant="filled"
                      type="email"
                      required
                      value={emailAddress}
                      onChange={emailAddressChange}
                      margin="normal"
                      color="primary"
                    />
                  </Row>
                  <Row>
                    <FormControl variant="filled">
                      <InputLabel htmlFor="filled-adornment-password">
                        Password
                      </InputLabel>
                      <FilledInput
                        id="filled-adornment-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={passwordChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={showPassHandler}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Row>
                  <Row>
                    <h3 className="h5 text-danger">{validation}</h3>
                  </Row>
                  <Row>
                    <Col lg="12">
                      Don't have an account?{" "}
                      <a href="/register-form" className="form-link">
                        Register
                      </a>
                    </Col>
                  </Row>
                  <br></br>
                  <Row>
                    <Col lg="12" className="p-0">
                      <button
                        className="buton w-100"
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
