import React from "react";
import UnverifiedBooks from "../../components/UnverifiedBooks/UnverifiedBooks";
import ChangeStock from "../../components/ChangeStock/ChangeStock";
import "./AdminHome.scss";

export default function AdminHome() {
  return (
    <div className="home-component">
      <div className="change-stock">
        <ChangeStock />
      </div>
      <div className="main-components">
        <h3>Unverified Books</h3>
        <UnverifiedBooks />
      </div>
    </div>
  );
}
