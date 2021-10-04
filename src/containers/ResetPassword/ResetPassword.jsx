import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "./ResetPassword.scss";

export default function ResetPassword(props) {
  const fromEmail = useRef(props.match.params.token ? true : false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [isSuccess, setSuccess] = useState(false);
  const [isFailure, setFailure] = useState(false);
  const [isSent, setSent] = useState(false);
  const [isErr, setErr] = useState(false);
  const [counter, setCounter] = useState(5);
  const timer = useRef();
  const [counterPaused, setPause] = useState(true);

  const sendPasswordResetlink = () => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/sendpasswordresetlink`,
        {
          email,
        }
      )
      .then((res) => {
        setSent(true);
        setErr(false);
      })
      .catch((err) => {
        setSent(false);
        setErr(true);
      });
  };

  const decreaseCount = () => {
    if (counter > 0) setCounter(counter - 1);
    else if (counter === 0) {
      props.history.replace("/login");
    }
  };

  useEffect(() => {
    if (!counterPaused) {
      timer.current = setInterval(decreaseCount, 1000);
    }
    return () => clearInterval(timer.current);
  }, [counter, counterPaused]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = () => {
    setSuccess(true);
    setFailure(false);
    setPause(false);
  };

  const savePassword = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/user/changepassword`, {
        password,
        token: props.match.params.token,
      })
      .then((res) => handleClick())
      .catch((err) => {
        setFailure(true);
        setSuccess(false);
      });
  };

  if (fromEmail.current) {
    return (
      <div className="reset-pass-container">
        <div className="new-password-form">
          <h4>Set New Password</h4>
          <span>
            Please enter your new password twice. Make sure it is complex to
            ensure security.
          </span>
          <input
            type="password"
            placeholder="Enter new password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ display: "flex", position: "relative" }}>
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConPassword(e.target.value)}
            />
            <span
              className="error"
              style={{
                display:
                  conPassword === "" || conPassword === password
                    ? "none"
                    : "block",
              }}
              data-tip
              data-for="passTip"
            >
              &#33;
            </span>
          </div>
          <button
            className="btn btn-secondary"
            disabled={password !== conPassword || password === ""}
            onClick={() => savePassword()}
          >
            Set Password
          </button>
          <div
            className="alert alert-dismissible alert-danger"
            style={{
              display: isFailure ? "block" : "none",
              padding: "1em 2em",
            }}
          >
            <strong>There was some error!</strong>
            <br /> Please try entering the passwords again and if that doesn't
            work, go through the reset process again. We're sorry for the
            inconvinience.
          </div>
          <div
            className="alert alert-dismissible alert-success"
            style={{
              display: isSuccess ? "block" : "none",
              padding: "1em 2em",
            }}
          >
            <strong>Password changed successfully!</strong>
            <br /> You will be redirected to the login page in {counter} seconds
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="reset-pass-container">
        <div className="reset-pass-form">
          <h4>Reset Password</h4>
          <span>
            Please enter your registered email for verification. We will send a
            link which will allow you to change your password.
          </span>
          <input
            type="text"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="btn btn-secondary"
            onClick={() => sendPasswordResetlink()}
          >
            Send Password Reset Link
          </button>
          <div
            className="alert alert-dismissible alert-danger"
            style={{
              display: isErr ? "block" : "none",
              padding: "1em 2em",
            }}
          >
            <strong>There was some error!</strong>
            <br /> We couldn't find the given email id in our database. Please
            check and enter the correct email.
          </div>
          <div
            className="alert alert-dismissible alert-success"
            style={{
              display: isSent ? "block" : "none",
              padding: "1em 2em",
            }}
          >
            <strong>Reset link send!</strong>
            <br /> We have sent you a link to reset the password. It will be
            valid for 20 minutes. Follow it to set a new password.
          </div>
        </div>
      </div>
    );
  }
}
