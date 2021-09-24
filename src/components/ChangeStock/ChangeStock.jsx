import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ChangeStock.scss";

export default function ChangeStock() {
  const [data, setdata] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  const getBooks = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/books/searchbook`, {
        searchTerm: searchTerm,
      })
      .then(({ data }) => {
        setdata([...data]);
      })
      .catch((err) => console.log(err));
  };

  const changeStock = (id) => {
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
      .get(
        `${process.env.REACT_APP_BASE_URL}/api/admin/switchStock/${id}`,
        config
      )
      .then((data) => getBooks())
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        onChange={(e) => setsearchTerm(e.target.value)}
      />
      <button className="btn btn-primary" onClick={() => getBooks()}>
        Search
      </button>
      <div className="results">
        {data.map((item, key) => {
          return (
            <div className="search-card" key={key}>
              <div className="image">
                <img src={item.book_img_url} alt={item.book_name} />
              </div>
              <div className="info">
                <h6>{item.book_name}</h6>
                <b>Donated By: </b>
                <span style={{ color: "#111" }}>{item.donatedBy}</span>
                <br />
                <b>In Stock: </b>
                <span style={{ color: "#111" }}>
                  {item.inStock ? "Yes" : "No"}
                </span>
                <div className="action-btns">
                  <button
                    className="btn btn-primary"
                    onClick={() => changeStock(item._id)}
                  >
                    Change status
                  </button>
                  <Link to={`/checkbook/${item._id}`}>
                    <button className="btn btn-secondary">More Info</button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
