import React from "react";
import "./Login.scss";
import { Redirect } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { LoginContext } from "../../contexts/loginContext";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, setValid] = useState(false);
  const [loginBtnText, setLoginBtnText] = useState("Login");
  const [showError, setShowError] = useState(false);
  const { changeLoggedInStatus, isLoggedIn } = useContext(LoginContext);

  const login = () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const body = JSON.stringify({
      password,
      email,
    });
    setLoginBtnText("Logging you in...");

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/auth`, body, config)
      .then(({ data }) => {
        localStorage.setItem("token", data.token);
        changeLoggedInStatus(true);
      })
      .catch((err) => {
        setLoginBtnText("Login");
        setShowError(true);
      });
  };

  if (JSON.parse(isLoggedIn)) {
    return <Redirect to="/home" />;
  }
  return (
    <div>
      <div className="login-container">
        <div className="intro">
          <div className="img-container">
            <img
              src={`${process.env.PUBLIC_URL}/images/login-image.webp`}
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
        <div className="login-form">
          <h2>Login</h2>
          <div className="underline"></div>
          <div className="form">
            <div style={{ display: "flex", position: "relative" }}>
              <input
                type="text"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  let emailRegex =
                    /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
                  setValid(emailRegex.test(e.target.value));
                }}
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
            </div>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: "2em" }}
            />
            <div
              className="alert alert-danger"
              style={{
                display: showError ? "block" : "none",
                textAlign: "center",
              }}
            >
              Invalid Credentials
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => {
                login();
              }}
              disabled={!validEmail || !password}
            >
              {loginBtnText}
            </button>
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              New to Kitaabe?{" "}
              <Link to={"/signup"} style={{ color: "#636e72" }}>
                Sign Up Here
              </Link>
            </div>
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <Link to={"/resetpassword"} style={{ color: "#636e72" }}>
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ReactTooltip id="emailTip" place="top" effect="solid">
        Please enter valid email
      </ReactTooltip>
    </div>
  );
}

export default Login;
