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
import { TextField } from "@mui/material";

const ContactForm = () => {
  const [fullname, setFullname] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const [disableId, setDisableId] = useState("");
  const [disableText, setDisableText] = useState("Submit");

  const [alert, setAlert] = useState(null);

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
  const messageSubjectChange = (e) => {
    setMessageSubject(e.target.value);
  };
  const emailAddressChange = (e) => {
    setEmailAddress(e.target.value);
  };
  const messageBodyChange = (e) => {
    setMessageBody(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setDisableBtn(true);
    setDisableText("Submitting");
    setDisableId("btn-disabled");

    axios
      .post("https://localhost:7005/api/Message", {
        fullname: fullname,
        messageSubject: messageSubject,
        emailAddress: emailAddress,
        messageBody: messageBody,
      })
      .then((res) => {
        if (200 <= res.status && res.status < 300) {
          successAlert({
            title: "Message Sent",
            message: "Message has been sent successfully",
          });
        } else {
          warningAlert({
            title: "Message Not Sent",
            message:
              "There has been an error in sending message. Please try again later!!",
          });
          console.log(res);
        }
      })
      .catch((e) => {
        console.log(e);
        warningAlert({
          title: "Message Not Sent",
          message: "Message not sent due to network error!!",
        });
      });
  };

  return (
    <div className="contact-form homepage">
      {alert}
      <NavBar />
      <Container style={{ width: "55%" }}>
        <div className="form-content">
          <form onSubmit={submitHandler}>
            <Card
              style={{
                backgroundColor: "rgba(255,255,255,0.9)",
                borderColor: "#8e3ac9",
              }}
              className="p-3"
            >
              <Container>
                <CardTitle>
                  <h1 className="h3 p-2">Contact Us</h1>
                </CardTitle>
                <CardBody>
                  <Row>
                    <TextField
                      id="filled-basic"
                      label="Full Name"
                      variant="filled"
                      type="text"
                      max="255"
                      required
                      value={fullname}
                      onChange={fullnameChange}
                      margin="normal"
                      color="primary"
                    />
                  </Row>
                  <Row>
                    <TextField
                      id="filled-basic"
                      label="Message Subject"
                      variant="filled"
                      type="text"
                      max="255"
                      required
                      value={messageSubject}
                      onChange={messageSubjectChange}
                      margin="normal"
                      color="primary"
                    />
                  </Row>
                  <Row>
                    <TextField
                      id="filled-basic"
                      label="Email Address"
                      variant="filled"
                      type="email"
                      max="255"
                      required
                      value={emailAddress}
                      onChange={emailAddressChange}
                      margin="normal"
                      color="primary"
                    />
                  </Row>
                  <Row>
                    <TextField
                      multiline
                      rows={3}
                      maxRows={4}
                      variant="filled"
                      label="Message"
                      margin="normal"
                      value={messageBody}
                      onChange={messageBodyChange}
                      required
                    />
                  </Row>
                  <Row>
                    <Col lg="12" className="p-0 mt-3">
                      <button
                        className="buton w-100"
                        style={{
                          padding: "0.5em 1em",
                        }}
                        id={disableId}
                        disabled={disableBtn}
                      >
                        {disableText}
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

export default ContactForm;
