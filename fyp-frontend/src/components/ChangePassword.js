import React, { useState } from "react";
import NavBar from "./NavBar";
import {
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import ReactBSAlert from "react-bootstrap-sweetalert";
import {
  CardBody,
  CardHeader,
  CardTitle,
  Container,
  Card,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";

const ChangePassword = () => {
  const [verified, setVerified] = useState(false);
  const [cardTitle, setCardTitle] = useState("Verify Password");

  const [showVPassword, setShowVPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [verifyText, setVerifyText] = useState("Verify");
  const [disableId, setDisableId] = useState("");
  const [disableVBtn, setVDisableBtn] = useState(false);
  const [validation, setValidation] = useState("");

  const [showNPassword, setShowNPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [showNCPassword, setShowNCPassword] = useState(false);
  const [newCPassword, setNewCPassword] = useState("");

  const [btnText, setBtnText] = useState("Change Password");
  const [btnDisable, setBtnDisable] = useState(false);
  const [btnDisableId, setBtnDisableId] = useState("");

  const [alert, setAlert] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user-info"));
  const emailAddress = userData.userEmail;
  const userId = userData.userId;
  const navigate = useNavigate();

  const oldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const newPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const newCPasswordChange = (e) => {
    setNewCPassword(e.target.value);
  };

  const showVPasswordHandler = () => {
    setShowVPassword((e) => !e);
  };

  const showNPasswordHandler = () => {
    setShowNPassword((e) => !e);
  };

  const showNewCPasswordHandler = () => {
    setShowNCPassword((e) => !e);
  };

  const verifyPasswordHandler = async (e) => {
    e.preventDefault();
    setDisableId("btn-disabled");
    setVerifyText("Verifying");

    if (oldPassword.length >= 8) {
      setValidation("");
      await axios
        .post("https://localhost:7005/api/Login", {
          userEmail: emailAddress,
          userPassword: oldPassword,
        })
        .then((res) => {
          if (200 <= res.status && res.status < 300) {
            setVerified(true);
            setVerifyText("Verified");
            setDisableId("btn btn-success btn-disabled ");
            setVDisableBtn(true);
            setValidation("");
            setCardTitle("Change Password");
          } else {
            warningAlert({
              title: "Verification Failed",
              message:
                "There has been an error in verifying the password. Please try again later!!",
            });
            setVerifyText("Verify");
            setDisableId("");
            setVDisableBtn(false);
            setValidation("");
          }
        })
        .catch((e) => {
          if (
            e.response.data.message &&
            e.response.data.message === "INVALID_PASSWORD"
          ) {
            warningAlert({
              title: "Verification Failed",
              message: "Please enter correct Password!!",
            });
          }
          //  else if (
          //   e.response.data.message &&
          //   e.response.data.message === "INVALID_USER"
          // ) {
          //   warningAlert({
          //     title: "Verification Failed",
          //     message: "User not registered in the system!!",
          //   });
          // }
          else {
            warningAlert({
              title: "Verification Failed",
              message: "Log In failed due to network error!!",
            });
          }
          console.log(e);
          setVerifyText("Verify");
          setVDisableBtn(false);
          setValidation("");
          setDisableId("");
        });
    } else {
      setValidation("Passwords must be at least 8 characters");
      setVerifyText("Verify");
      setVDisableBtn(false);
      setDisableId("");
    }
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

  const changePasswordHandler = async (e) => {
    e.preventDefault();

    setBtnDisable(true);
    setBtnText("Changing Password");
    setBtnDisableId("btn-disabled");

    if (newPassword === newCPassword) {
      if (newPassword.length < 8) {
        setValidation("Password should be at least 8 characters");
        setBtnText("Change Password");
        setBtnDisable(false);
        setBtnDisableId("");
      } else {
        await axios
          .post(`https://localhost:7005/api/ChangePassword/${userId}`, {
            oldPassword: oldPassword,
            newPassword: newPassword,
          })
          .then((res) => {
            if (200 <= res.status && res.status < 300) {
              successAlert({
                title: "Password Change Successful",
                message: "Password was changed successfully!!",
              });
            } else {
              warningAlert({
                title: "Password Change Failed",
                message:
                  "There has been an error in changing the password. Please try again later!!",
              });
              setBtnText("Change Password");
              setBtnDisable(false);
              setBtnDisableId("");
              setValidation("");
            }
          })
          .catch((e) => {
            console.log(e);
            warningAlert({
              title: "Password Change Failed",
              message: "Password change failed due to network error!!",
            });
          });
      }
    } else {
      setValidation("Passwords do not match");
      setBtnText("Change Password");
      setBtnDisable(false);
      setBtnDisableId("");
    }
  };

  return (
    <div className="change-password homepage">
      {alert}
      <NavBar />
      <Container className="mt-5" style={{ width: "40%" }}>
        <div className="form-content">
          <Card
            style={{
              backgroundColor: "rgba(255,255,255, 0.9)",
              borderColor: "#8e3ac9",
            }}
            className="p-3"
          >
            <CardHeader>
              <CardTitle>
                <h1 className="h4 p-2">{cardTitle}</h1>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <form onSubmit={verifyPasswordHandler}>
                <Row>
                  <Col lg="9" className="p-0">
                    <FormControl variant="filled" className="w-100">
                      <InputLabel htmlFor="filled-adornment-password">
                        Old Password
                      </InputLabel>
                      <FilledInput
                        id="filled-adornment-password"
                        type={showVPassword ? "text" : "password"}
                        value={oldPassword}
                        disabled={disableVBtn}
                        onChange={oldPasswordChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={showVPasswordHandler}
                              edge="end"
                            >
                              {showVPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Col>
                  <Col lg="3">
                    <button
                      disabled={disableVBtn}
                      className={`buton h-100 w-100 ${disableId}`}
                      id={disableId}
                    >
                      {verifyText}
                    </button>
                  </Col>
                </Row>
              </form>
              {verified ? (
                <form onSubmit={changePasswordHandler}>
                  <Row>
                    <Col lg="12" className="p-0">
                      <FormControl
                        variant="filled"
                        margin="normal"
                        className="w-100"
                      >
                        <InputLabel htmlFor="filled-adornment-password">
                          New Password
                        </InputLabel>
                        <FilledInput
                          id="filled-adornment-password"
                          type={showNPassword ? "text" : "password"}
                          value={newPassword}
                          disabled={btnDisable}
                          onChange={newPasswordChange}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={showNPasswordHandler}
                                edge="end"
                              >
                                {showNPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12" className="p-0">
                      <FormControl
                        variant="filled"
                        margin="normal"
                        className="w-100"
                      >
                        <InputLabel htmlFor="filled-adornment-password">
                          Confirm New Password
                        </InputLabel>
                        <FilledInput
                          id="filled-adornment-password"
                          type={showNCPassword ? "text" : "password"}
                          value={newCPassword}
                          onChange={newCPasswordChange}
                          disabled={btnDisable}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={showNewCPasswordHandler}
                                edge="end"
                              >
                                {showNCPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Col>
                    <Col lg="12 p-0">
                      <button
                        className={`buton w-100 pt-3 pb-3`}
                        disabled={btnDisable}
                        id={btnDisableId}
                      >
                        {btnText}
                      </button>
                    </Col>
                  </Row>
                </form>
              ) : (
                <></>
              )}
              <br />
              <h3 className="h5 text-danger">{validation}</h3>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default ChangePassword;
