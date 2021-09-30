import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { loadUserThunk } from "../../redux/user";
import { useSelector, useDispatch } from "react-redux";

export default function Profile() {
  const [profileMenuIndex, setProfileMenuIndex] = useState(0);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUserThunk());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
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
                  <td>{user === null ? "" : user.data.donatedBooks.length}</td>
                  <td>{user === null ? "" : user.data.savedBooks.length}</td>
                  <td>{user === null ? "" : user.data.tokenCount}</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td>Donated</td>
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
              }}
            >
              <span>My Orders</span>
            </li>
            <li
              className={profileMenuIndex === 2 ? "active" : ""}
              onClick={() => {
                setProfileMenuIndex(2);
              }}
            >
              <span>Wishlist</span>
            </li>
            <li
              className={profileMenuIndex === 3 ? "active" : ""}
              onClick={() => {
                setProfileMenuIndex(3);
              }}
            >
              <span>Donated Books</span>
            </li>
          </ul>
        </div>
        <div className="profile"></div>
      </div>
    </div>
  );
}
