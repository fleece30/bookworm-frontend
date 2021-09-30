import React, { useContext, useEffect, useState } from "react";
import "./Nav.scss";
import { NavLink } from "react-router-dom";
import { LoginContext } from "../../contexts/loginContext";
import { getCartThunk } from "../../redux/cart";
import { loadUserThunk } from "../../redux/user";
import { useDispatch, useSelector } from "react-redux";

export default function Nav() {
  const { isLoggedIn, changeLoggedInStatus } = useContext(LoginContext);
  const [isAtTop, setAtTop] = useState(true);
  const dispatch = useDispatch();
  const { cartItemCount, tokens } = useSelector((state) => state.cart);
  const { isAdmin } = useSelector((state) => state.user);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      changeLoggedInStatus(false);
    }
    document.addEventListener("scroll", (e) => {
      let scrolled = document.scrollingElement.scrollTop;
      if (scrolled >= 10) {
        setAtTop(false);
      } else {
        setAtTop(true);
      }
    });
    if (JSON.parse(isLoggedIn)) {
      dispatch(loadUserThunk());
      dispatch(getCartThunk());
    }
  }, [dispatch, isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="nav"
      style={{ background: isAtTop ? "transparent" : "white" }}
    >
      <span
        className="logo"
        style={{
          color: "black",
        }}
      >
        <NavLink to={"/home"}>BOOKWORM</NavLink>
      </span>
      <div className="menu-links">
        <ul>
          <li>
            <NavLink to={"/collection"}>Browse</NavLink>
          </li>
          <li
            style={{
              display: !JSON.parse(isLoggedIn) ? "none" : "inline-block",
            }}
          >
            <NavLink to={"/donate"}>Donate a book</NavLink>
          </li>
          <li>
            {!JSON.parse(isLoggedIn) ? (
              <NavLink to={"/login"}>Login</NavLink>
            ) : (
              <NavLink to={"/profile"}>Profile</NavLink>
            )}
          </li>

          <li
            style={{
              display: !JSON.parse(isLoggedIn) ? "none" : "inline-block",
              color: "black",
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/images/token-icon.png`}
              alt=""
            />
            &nbsp;{tokens}
          </li>
          <li
            style={{
              display: !isAdmin ? "none" : "inline-block",
            }}
          >
            <NavLink to={"/adminhome"}>Admin Panel</NavLink>
          </li>
          <li
            style={{
              display: !JSON.parse(isLoggedIn) ? "none" : "inline-block",
            }}
          >
            <NavLink to={"/cart"}>Cart({cartItemCount})</NavLink>
          </li>
          <li
            style={{
              display: JSON.parse(isLoggedIn) ? "inline-block" : "none",
            }}
          >
            <NavLink
              to={"/login"}
              onClick={() => {
                localStorage.removeItem("token");
                changeLoggedInStatus(false);
              }}
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
