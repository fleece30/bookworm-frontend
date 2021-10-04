import React from "react";
import BookList from "../BookList/BookList";
import "./OrderItem.scss";

export default function OrderItem(props) {
  return (
    <div className="order-container">
      <ul className="list-group order-header">
        <li
          className="list-group-item"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            <b>Ordered on:</b> {props.item.date.slice(0, 10)}
          </span>
          <span>
            <b>Items: </b>
            {props.item.books.length}
          </span>
          <span
            className="alert alert-success"
            style={{ borderRadius: "0.4em" }}
          >
            <b>Status:</b> {props.item.status}
          </span>
        </li>
        <li style={{ border: "1px solid #dfdfdf", borderTop: "none" }}>
          <ul className="orderList">
            {props.item.books.map((item, key) => {
              return (
                <li key={key}>
                  <BookList item={item} location={props.location} />
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    </div>
  );
}
