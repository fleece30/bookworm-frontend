import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { loadUserThunk } from "../../redux/user";
import { useSelector, useDispatch } from "react-redux";
import OrderItem from "../../components/OrderItem/OrderItem";
import BookList from "../../components/BookList/BookList";
import axios from "axios";
import ReactTooltip from "react-tooltip";

export default function Profile(props) {
  const [profileMenuIndex, setProfileMenuIndex] = useState(0);
  const { user } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [editing, setediting] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setaddress] = useState("");
  const [validPhone, setValidPhone] = useState(true);
  const [books, setBooks] = useState([]);
  const dispatch = useDispatch();

  const validatePhone = (e) => {
    let phoneRegex = /^[0-9]{10}$/;
    setValidPhone(phoneRegex.test(e));
    return phoneRegex.test(e);
  };

  const getBooks = (type) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/books/getbookbyid`,
        {
          books: user.data[type],
        },
        config
      )
      .then(({ data }) => {
        setBooks(data);
        setOrders([]);
        // setTitle(type === "savedBooks" ? "My Saved Books" : "Donated Books");
        setProfileMenuIndex(type === "savedBooks" ? 2 : 3);
      })
      .catch((err) => console.log(err));
  };

  const getOrders = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/user/getOrders`,
        {
          id: user.data._id,
        },
        config
      )
      .then(({ data }) => {
        setOrders(data.orders.reverse());
        setBooks([]);

        // setTitle("My Orders");
        setProfileMenuIndex(1);
      })
      .catch((err) => console.log(err));
  };

  const editUserInfo = () => {
    if (editing) {
      if (validatePhone(phone)) {
        axios
          .post(`${process.env.REACT_APP_BASE_URL}/api/user/updateaddress`, {
            userId: user.data._id,
            address: address === "" ? user.data.address : address,
            phone: phone === "" ? user.data.phone : phone,
          })
          .then((data) => setediting(false))
          .catch((err) => console.log(err));
      } else {
        alert("Enter correct number");
      }
    } else {
      setediting(true);
    }
  };

  useEffect(() => {
    dispatch(loadUserThunk());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderUserData = () => {
    switch (profileMenuIndex) {
      default:
      case 0: {
        return (
          <div>
            <div className="user-info">
              <div
                style={{
                  display: "flex",
                  columnGap: "2em",
                  flex: "1 1 50%",
                  marginBottom: "1em",
                }}
              >
                <div style={{ width: "50%" }}>
                  <span style={{ fontSize: "0.8em", color: "#636e72" }}>
                    Username
                  </span>
                  <input
                    type="text"
                    // className="form-control"
                    disabled
                    defaultValue={user === undefined ? "" : user.data.username}
                  />
                </div>
                <div style={{ width: "50%" }}>
                  <span style={{ fontSize: "0.8em", color: "#636e72" }}>
                    Email
                  </span>
                  <input
                    type="text"
                    // className="form-control"
                    disabled
                    defaultValue={user === undefined ? "" : user.data.email}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  columnGap: "2em",
                  flex: "1 1 50%",
                  marginBottom: "1em",
                }}
              >
                <div
                  style={{
                    width: "50%",
                  }}
                >
                  <span style={{ fontSize: "0.8em", color: "#636e72" }}>
                    Phone
                  </span>
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                    }}
                  >
                    <input
                      type="text"
                      // className="form-control"
                      defaultValue={user === undefined ? "" : user.data.phone}
                      disabled={!editing}
                      placeholder="Phone Number"
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                    />
                    <span
                      className="error"
                      style={{
                        display: validPhone ? "none" : "block",
                      }}
                      data-tip
                      data-for="phoneTip"
                    >
                      &#33;
                    </span>
                  </div>
                </div>
                <div style={{ width: "50%" }}></div>
              </div>
              <span style={{ fontSize: "0.8em", color: "#636e72" }}>
                Address
              </span>
              <textarea
                // className="form-control"
                placeholder="Please update address to order"
                rows="6"
                disabled={!editing}
                defaultValue={user.data.address}
                onChange={(e) => setaddress(e.target.value)}
              />
              <div style={{ display: "flex", columnGap: "1em" }}>
                <button
                  className="btn-main"
                  style={{ marginTop: "2em", width: "15em" }}
                  onClick={() => editUserInfo()}
                  // disabled={editing && !validPhone}
                >
                  {editing ? "Save" : "Edit"}
                </button>
                <button
                  className="btn-sec"
                  style={{
                    marginTop: "2em",
                    display: editing ? "block" : "none",
                    width: "15em",
                  }}
                  onClick={() => setediting(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      }
      case 1: {
        return orders.map((item, key) => {
          return (
            <OrderItem key={key} item={item} location={props.match.path} />
          );
        });
      }
      case 2:
      case 3: {
        return books.map((item, key) => {
          return <BookList key={key} item={item} location={props.match.path} />;
        });
      }
    }
  };

  return (
    <div>
      <div className="profile-header">
        <div className="profile-picture">
          <img src={user === null ? "" : user.data.userDP} alt="" />
        </div>
        <div className="user-info">
          <div
            className="user-name"
            style={{ fontSize: "2em", fontWeight: "bold" }}
          >
            {user === null ? "" : user.data.username}
          </div>
          <div className="user-stats">
            <table>
              <tbody>
                <tr>
                  <td>{user === null ? "" : user.data.orders.length}</td>
                  <td>{user === null ? "" : user.data.savedBooks.length}</td>
                  <td>{user === null ? "" : user.data.tokenCount}</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td>Orders</td>
                  <td>Wishlist</td>
                  <td>Tokens</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* User Information */}
      <div className="main-profile">
        <div className="profile-menu">
          <ul>
            <li
              className={profileMenuIndex === 0 ? "active" : ""}
              onClick={() => {
                setProfileMenuIndex(0);
              }}
            >
              <span>My Information</span>
            </li>
            <li
              className={profileMenuIndex === 1 ? "active" : ""}
              onClick={() => {
                setProfileMenuIndex(1);
                getOrders();
              }}
            >
              <span>My Orders</span>
            </li>
            <li
              className={profileMenuIndex === 2 ? "active" : ""}
              onClick={() => {
                setProfileMenuIndex(2);
                getBooks("savedBooks");
              }}
            >
              <span>Wishlist</span>
            </li>
            <li
              className={profileMenuIndex === 3 ? "active" : ""}
              onClick={() => {
                setProfileMenuIndex(3);
                getBooks("donatedBooks");
              }}
            >
              <span>Donated Books</span>
            </li>
          </ul>
        </div>
        <div className="profile">{user === null ? "" : renderUserData()}</div>
      </div>
      <ReactTooltip id="phoneTip" place="top" effect="solid">
        Please enter a valid phone number
      </ReactTooltip>
    </div>
  );
}
