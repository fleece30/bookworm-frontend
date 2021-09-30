import React from "react";
import "./bookCard.scss";

export default function BookCard(props) {
  // , length, instock
  const { book_name, book_img_url, description, author } = props;
  return (
    <div>
      <div className="book-card">
        <div className="card-header">
          <img className="img-bgs" src={book_img_url} alt="awd" />
        </div>
        <img className="book-img" src={book_img_url} alt="" />
        <div className="card-body">
          <h5>{book_name}</h5>
          <p>
            {book_name.length < 17
              ? description.substring(0, 130)
              : book_name.length < 34
              ? description.substring(0, 100)
              : description.substring(0, 60)}
            ...
          </p>
          {/* <div
            // className="length"
            style={{
              display: instock ? "none" : "block",
              cursor: "default",
              position: "absolute",
              right: "0",
              bottom: "10%",
              opacity: "0.6",
              fontWeight: "bold",
            }}
          >
            Out of Stock
          </div> */}
          <div className="book-info">
            <div className="author">
              <span>Author</span>
              {author}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
