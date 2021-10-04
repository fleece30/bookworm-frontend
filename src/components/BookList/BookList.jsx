import React from "react";
import "./BookList.scss";
import { Link } from "react-router-dom";

export default function BookList(props) {
  return (
    <div className="book-list-item">
      <img
        src={props.item.url || props.item.book_img_url}
        alt={props.item.book_name}
        className="book_img"
        // style={{ width: "fit-content" }}
      />
      <div className="book-list-item-info">
        <div
          style={{ display: "flex", flexDirection: "column", rowGap: "1em" }}
        >
          <h4>{props.item.book_name}</h4>
          <div>
            <span className="book-list-item-title">Author: </span>
            <span>{props.item.author}</span>
          </div>
          <div
            style={{ display: props.location === "/cart" ? "block" : "none" }}
          >
            <span className="book-list-item-title">Price: </span>
            <span>
              <img
                src={`${process.env.PUBLIC_URL}/images/token-icon.png`}
                alt=""
                
              />
              &nbsp;{props.item.tokenValue}
            </span>
          </div>
        </div>
      </div>
      <div className="book-action-btns">
          <Link to={{ pathname: `/collection`, id: props.item._id }}>
            <button className="btn-link">More Information</button>
          </Link>
          <button
            className="btn-link"
            onClick={() =>
              props.removeFromCart(props.item.id || props.item._id)
            }
            style={{ display: props.location === "/cart" ? "block" : "none" }}
          >
            Remove from cart
          </button>
        </div>
    </div>
  );
}
