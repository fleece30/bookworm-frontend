import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UnverifiedBooks.scss";

export default function UnverifiedBooks() {
  const [unverifiedBooks, setunverifiedBooks] = useState([]);
  useEffect(() => {
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
      .get(`${process.env.REACT_APP_BASE_URL}/api/admin/unverified`, config)
      .then(({ data }) => setunverifiedBooks(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="unverified-books">
      <h5 style={{ display: unverifiedBooks.length === 0 ? "block" : "none" }}>
        No unverified books
      </h5>
      <table
        className="table"
        style={{ display: unverifiedBooks.length > 0 ? "block" : "none" }}
      >
        <thead className="thead-dark">
          <tr>
            <th>S.no.</th>
            <th>Image</th>
            <th>Book Name</th>
            <th>Author</th>
            <th>Donated By</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {unverifiedBooks.map((item, key) => {
            return (
              <tr key={key}>
                <td>{key + 1}</td>
                <td>
                  <img src={item.book_img_url} alt={item.book_name} />
                </td>
                <td>{item.book_name}</td>
                <td>{item.author}</td>
                <td>{item.donatedBy}</td>
                <td>
                  <Link to={`/checkBook/${item._id}`}>
                    <button className="btn btn-secondary">Check book</button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
