import React, { useEffect, useState, useContext } from "react";
import "./Cart.scss";
import { useDispatch, useSelector } from "react-redux";
import { LoginContext } from "../../contexts/loginContext";
import {
  getCartThunk,
  issueWithTokenThunk,
  removeFromCartThunk,
} from "../../redux/cart";
import { loadUserThunk } from "../../redux/user";
import BookList from "../../components/BookList/BookList";

export default function Cart(props) {
  const { user } = useSelector((state) => state.user);
  const { tokens, cart } = useSelector((state) => state.cart);
  let totalPrice = 0;
  const { isLoggedIn } = useContext(LoginContext);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const dispatch = useDispatch();

  const removeFromCart = (bookId) => {
    dispatch(removeFromCartThunk({ userId: user.data._id, bookId }));
  };

  const issueWithTokens = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    dispatch(getCartThunk());
    if (tokens < totalPrice) {
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => {
        setShowError(false);
      }, 6000);
    } else {
      dispatch(
        issueWithTokenThunk({ userId: user.data._id, books: cart, totalPrice })
      );
      setShowError(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 6000);
    }
  };

  useEffect(() => {
    if (JSON.parse(isLoggedIn)) dispatch(loadUserThunk());
    dispatch(getCartThunk());
    cart.forEach((item) => (totalPrice += item.tokenValue)); // eslint-disable-line react-hooks/exhaustive-deps
  }, [dispatch, isLoggedIn]);

  if (user === null) {
    return <h4>Loading...</h4>;
  }
  return (
    <div
      style={{
        display: "flex",
        marginTop: "2em",
        marginLeft: "-40px",
      }}
    >
      <div className="main-cart">
        <div
          style={{
            margin: "1em 0 1.5em 1em ",
            fontFamily: "Lora",
            fontSize: "2.6em",
            textTransform: "capitalize",
            textAlign: "center",
          }}
        >
          Here's what you're getting!
        </div>
        <div
          className="errorBox"
          style={{
            display: showError ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            margin: "-0.8em 0 2em 0 ",
          }}
        >
          <div>
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
            &nbsp;
            <span style={{ fontWeight: "bold" }}>
              You have insufficient balance.
            </span>
          </div>
        </div>
        <div
          className="successBox"
          style={{
            display: showSuccess ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            margin: "-0.8em 0 2em 0 ",
          }}
        >
          <div>
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
            &nbsp;
            <span style={{ fontWeight: "bold" }}>
              Order Successful. Check your profile for order details!
            </span>
          </div>
        </div>
        <div className="cart-container">
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <img
                  src={`${process.env.PUBLIC_URL}/images/empty-cart.svg`}
                  alt=""
                />
                <div
                  style={{
                    margin: "2em 0 1.5em 1em ",
                    fontFamily: "Lora",
                    fontSize: "1.5em",
                    textTransform: "capitalize",
                    textAlign: "center",
                  }}
                >
                  Such empty, much wow!
                </div>
              </div>
            ) : (
              <div>
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {cart.map((item, key) => {
                    totalPrice += item.tokenValue;
                    return (
                      <li
                        key={key}
                        style={{
                          borderBottom: "1px solid #ececec",
                          padding: "1em 0",
                        }}
                      >
                        <BookList
                          item={item}
                          removeFromCart={removeFromCart}
                          location={props.match.path}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <div
            className="checkout"
            style={{ display: cart.length === 0 ? "none" : "block" }}
          >
            <h4 style={{ textTransform: "capitalize" }}>
              Cart Total:{" "}
              <img
                src={`${process.env.PUBLIC_URL}/images/token-icon.png`}
                alt=""
                style={{ width: "1.3em", top: "-0.1em", position: "relative" }}
              />
              &nbsp;
              {totalPrice}
            </h4>
            <button
              className="btn-main"
              onClick={() => issueWithTokens()}
              disabled={cart.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
