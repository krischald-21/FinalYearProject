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

const ContactForm = () => {
  const [fullname, setFullname] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [messageBody, setMessageBody] = useState("");

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
      <Container>
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
                  <h1 className="h3 p-2">Contact Us</h1>
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
                      type="text"
                      placeholder="Message Subject"
                      value={messageSubject}
                      className="contact-tf"
                      onChange={messageSubjectChange}
                      required
                    />
                  </Row>
                  <Row>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={emailAddress}
                      className="contact-tf"
                      onChange={emailAddressChange}
                      required
                    />
                  </Row>
                  <Row>
                    <textarea
                      type="text"
                      placeholder="Message"
                      value={messageBody}
                      className="contact-ta"
                      onChange={messageBodyChange}
                      required
                    />
                  </Row>
                  <Row>
                    <Col lg="12">
                      <button
                        className="buton"
                        style={{ padding: "0.5em 1em" }}
                      >
                        {console.log(fullname)}
                        {console.log(messageSubject)}
                        {console.log(emailAddress)}
                        {console.log(messageBody)}
                        Submit
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
