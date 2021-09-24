import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Signup.scss";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [checkExisting, setCheckExisting] = useState({
    unique_uname: true,
    unique_email: true,
  });
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otps, setotp] = useState("");

  const validateEmail = (e) => {
    let emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    setValidEmail(emailRegex.test(e));
  };

  const validatePhone = (e) => {
    let phoneRegex = /^[0-9]{10}$/;
    setValidPhone(phoneRegex.test(e));
  };

  useEffect(() => {
    if (
      checkExisting.unique_email &&
      checkExisting.unique_uname &&
      username !== "" &&
      password !== "" &&
      conPassword !== "" &&
      email !== ""
    ) {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const otp = parseInt(Math.floor(100000 + Math.random() * 900000));
      const body = JSON.stringify({
        username,
        password,
        email,
        phone,
        otp,
      });

      axios
        .post(`${process.env.REACT_APP_BASE_URL}/api/auth/saveotp`, {
          email,
          otp,
        })
        .then((data) => setShowOtpField(true))
        .catch((err) => console.log(err));
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/user/sendverificationemail`,
          body,
          config
        )
        .then(({ data }) => {
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("token");
        });
    }
  }, [checkExisting]); // eslint-disable-line react-hooks/exhaustive-deps

  const validateOtp = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/auth/verifyotp`, {
        otps,
        email,
        username,
        password,
        phone,
      })
      .then((data) => {
        setShowOtpField(false);
        setShowSuccess(true);
        setShowError(false);
        setEmail("");
        setPassword("");
        setConPassword("");
        setUsername("");
        setPhone("");
      })
      .catch((err) => {
        setShowSuccess(false);
        setShowError(true);
      });
  };

  const register = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/user/checkexisting`, {
        username,
        email,
      })
      .then(({ data }) => {
        const newExistCheck = data.results;
        setCheckExisting({
          ...newExistCheck,
        });
      });
  };
  return (
    <div>
      <div className="signup-container">
        <div className="intro">
          <div className="img-container">
            <img
              src={`${process.env.PUBLIC_URL}/images/signup-image.webp`}
              alt="Book_img"
            />
          </div>
          <div className="intro-content">
            <h2 style={{ color: "#f5f6fa" }}>Intro Here</h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Temporibus veniam delectus, modi consectetur, dolorem iusto quasi,
              mollitia eaque aliquid quisquam quos perspiciatis. Debitis
              blanditiis suscipit cumque autem ratione dignissimos, magnam
              accusamus pariatur incidunt fuga, deleniti nam? Quis eos harum
              iusto, mollitia non, eius vero reiciendis expedita optio
              cupiditate dolore ipsa.
            </p>
          </div>
        </div>
        <div className="reg-form">
          <h2>Sign Up</h2>
          <div className="underline"></div>
          <div className="form">
            <div style={{ display: "flex", position: "relative" }}>
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                value={username || ""}
              />
              <span
                className="error"
                style={{
                  display: checkExisting.unique_uname ? "none" : "block",
                }}
                data-tip
                data-for="userTip"
              >
                &#33;
              </span>
            </div>
            <div style={{ display: "flex", position: "relative" }}>
              <input
                type="text"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                value={email || ""}
              />
              <span
                className="error"
                style={{
                  display: validEmail || email === "" ? "none" : "block",
                }}
                data-tip
                data-for="emailTip"
              >
                &#33;
              </span>
              <span
                className="error"
                style={{
                  display: checkExisting.unique_email ? "none" : "block",
                }}
                data-tip
                data-for="usedemailTip"
              >
                &#33;
              </span>
            </div>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password || ""}
            />
            <div style={{ display: "flex", position: "relative" }}>
              <input
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConPassword(e.target.value)}
                value={conPassword || ""}
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
            <div style={{ display: "flex", position: "relative" }}>
              <input
                type="text"
                placeholder="Phone Number"
                onChange={(e) => {
                  setPhone(e.target.value);
                  validatePhone(e.target.value);
                }}
                value={phone || ""}
              />
              <span
                className="error"
                style={{
                  display: validPhone || phone === "" ? "none" : "block",
                }}
                data-tip
                data-for="phoneTip"
              >
                &#33;
              </span>
            </div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={register}
            disabled={
              !username ||
              !validEmail ||
              !validPhone ||
              password !== conPassword ||
              showOtpField
            }
          >
            Register
          </button>
          <div
            className="otpInput"
            style={{
              display: showOtpField ? "flex" : "none",
              //   display: "flex",
              marginTop: "1em",
              flexDirection: "column",
              rowGap: "1em",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <OtpInput
              value={otps}
              onChange={(otp) => setotp(otp)}
              numInputs={6}
              separator={<span>•</span>}
            />
            <button
              className="btn btn-secondary"
              onClick={validateOtp}
              disabled={otps.length !== 6}
            >
              Validate
            </button>
          </div>
          <div
            className="errorBox"
            style={{
              display: showError ? "flex" : "none",
              alignItems: "center",
              marginTop: "1em",
            }}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 130.2 130.2"
            >
              <circle
                className="path circle"
                fill="none"
                stroke="#D06079"
                strokeWidth="6"
                strokeMiterlimit="10"
                cx="65.1"
                cy="65.1"
                r="62.1"
              />
              <line
                className="path line"
                fill="none"
                stroke="#D06079"
                strokeWidth="6"
                strokeLinecap="round"
                strokeMiterlimit="10"
                x1="34.4"
                y1="37.9"
                x2="95.8"
                y2="92.3"
              />
              <line
                className="path line"
                fill="none"
                stroke="#D06079"
                strokeWidth="6"
                strokeLinecap="round"
                strokeMiterlimit="10"
                x1="95.8"
                y1="38"
                x2="34.4"
                y2="92.2"
              />
            </svg>
            <span>Wrong OTP. Please try again.</span>
          </div>
          <div
            className="successBox"
            style={{
              display: showSuccess ? "flex" : "none",
              alignItems: "center",
              marginTop: "1em",
            }}
          >
            <svg
              id="aaa"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 130.2 130.2"
            >
              <circle
                className="path circle"
                fill="none"
                stroke="#73AF55"
                strokeWidth="6"
                strokeMiterlimit="10"
                cx="65.1"
                cy="65.1"
                r="62.1"
              />
              <polyline
                className="path check"
                fill="none"
                stroke="#73AF55"
                strokeWidth="6"
                strokeLinecap="round"
                strokeMiterlimit="10"
                points="100.2,40.2 51.5,88.8 29.8,67.5 "
              />
            </svg>
            <span>
              Email Verified. <Link to="/login">Login</Link>
            </span>
          </div>
          <div style={{ marginTop: "20px" }}>
            Have an account?{" "}
            <Link to={"/login"} style={{ color: "#636e72" }}>
              Login Here
            </Link>
          </div>
        </div>
      </div>
      <ReactTooltip id="userTip" place="top" effect="solid">
        This username is already in use
      </ReactTooltip>
      <ReactTooltip id="emailTip" place="top" effect="solid">
        PLease enter valid email
      </ReactTooltip>
      <ReactTooltip id="usedemailTip" place="top" effect="solid">
        This email is already in use
      </ReactTooltip>
      <ReactTooltip id="passTip" place="top" effect="solid">
        The passwords do not match
      </ReactTooltip>
      <ReactTooltip id="phoneTip" place="top" effect="solid">
        Please enter a valid phone number
      </ReactTooltip>
    </div>
  );
}
