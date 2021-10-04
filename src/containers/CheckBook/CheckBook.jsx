import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./CheckBook.scss";
import { Storage } from "../../firebase/index";
import { Redirect } from "react-router";

export default function CheckBook(props) {
  const id = useRef(props.match.params.id);
  const [data, setData] = useState({});
  const [user, setUser] = useState({});
  const [tokenValue, setTokenValue] = useState(0);
  /*eslint-disable no-unused-vars*/
  const [redirect, setredirect] = useState(false);

  const genreTags = [
    "Action and Adventure",
    "Classics",
    "Comic Book or Graphic Novel",
    "Detective and Mystery",
    "Fantasy",
    "Historical Fiction",
    "Horror",
    "Literary Fiction",
    "Romance",
    "Science Fiction",
    "Short Stories",
    "Suspense and Thriller",
    "Women's Fiction",
    "Biography or Autobiography",
    "Cookbook",
    "History",
    "Memoir",
    "Poetry",
    "Self-Help",
    "True Crime",
  ];

  const [bookName, setBookName] = useState("");
  const [tags, setTags] = useState([]);
  const [author, setAuthor] = useState("");
  const [desc, setDesc] = useState("");
  const [length, setLength] = useState("");

  useEffect(() => {
    if (redirect) {
      return <Redirect to="/" />;
    }
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
      .get(`${process.env.REACT_APP_BASE_URL}/api/books/bookInfo/${id.current}`)
      .then(({ data }) => {
        setBookName(data.book_name);
        setTags(data.tags);
        setAuthor(data.author);
        setDesc(data.description);
        setLength(data["length"]);
        setData({ ...data });
        console.log(data.donatedBy);
        axios
          .post(
            `${process.env.REACT_APP_BASE_URL}/api/admin/getuserbyusername`,
            {
              username: data.donatedBy,
            },
            config
          )
          .then(({ data }) => setUser({ ...data }))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, [redirect]);

  const approveBook = () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/admin/changeVerStatus`,
        {
          id: id.current,
          bookName,
          tags,
          author,
          desc,
          length,
          tokenValue,
        },
        config
      )
      .then((data) => {
        axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/admin/settokens`,
          {
            id: user._id,
          },
          config
        );
        setredirect(true);
      })
      .catch((err) => console.log(err));
  };

  const deleteBook = () => {
    let image = Storage.refFromURL(data.book_img_url);
    image.delete().then(() => {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/api/admin/deletebook`, {
          id: data._id,
        })
        .catch((err) => console.log(err));
    });
  };

  const addTag = (item) => {
    const index = tags.findIndex((o) => o === item);
    if (index === -1) {
      setTags([...tags, item]);
    } else {
      let newTags = tags;
      newTags.splice(index, 1);
      setTags([...newTags]);
    }
  };

  const setBookLength = (e) => {
    setLength(e.target.getAttribute("value"));
  };

  if (redirect) {
    return <Redirect to="/" />;
  }
  if (Object.keys(data).length === 0) {
    return <h4 className="loading-text">Loading...</h4>;
  }
  return (
    <div className="single-book-container">
      <h2>
        <input
          type="text"
          className="form-control"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
        ></input>
      </h2>
      <div className="single-book-grid">
        <div className="card card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <h4>Synopsis: </h4>
              <textarea
                className="form-control"
                cols="30"
                rows="10"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              ></textarea>
            </li>
            <li className="list-group-item">
              <h4>Tags: </h4>
              <div
                className="book-tags"
                style={{ display: "flex", flexWrap: "wrap" }}
              >
                {genreTags.map((item, key) => {
                  return (
                    <div
                      key={key}
                      className={`tagItem ${
                        tags.findIndex((o) => o === item) !== -1
                          ? "selectedTag"
                          : ""
                      }`}
                      value={item}
                      onClick={(e) => addTag(item)}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </li>
            <li
              className="list-group-item"
              style={{
                display: data.thoughts === "" ? "none" : "block",
              }}
            >
              <h4>Donator's thoughts: </h4>
              <span>{data.thoughts}</span>
            </li>
            <li
              className="list-group-item"
              style={{
                display: data.donatedBy === "" ? "none" : "block",
              }}
            >
              <h4>Donated By: </h4>
              <span>{data.donatedBy}</span>
            </li>

            <li className="list-group-item">
              <h4>Author:</h4>
              <input
                type="text"
                className="form-control"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              ></input>
            </li>
            <li className="list-group-item">
              <h4>MRP:</h4>
              <input
                type="text"
                className="form-control"
                required
                onChange={(e) => {
                  if (parseInt(e.target.value) < 50) {
                    setTokenValue(1);
                  } else if (parseInt(e.target.value % 100) >= 50) {
                    setTokenValue(parseInt(e.target.value / 100) + 1);
                  } else {
                    setTokenValue(parseInt(e.target.value / 100));
                  }
                }}
              ></input>
              <br />
              <b>Token Value: </b>
              {tokenValue}
            </li>
            <li className="list-group-item">
              <h4>Book Length:</h4>
              <div
                className={`length-item short ${
                  length === "Short" ? "selected-length-item" : ""
                }`}
                value="Short"
                onClick={(e) => setBookLength(e)}
              >
                Short
              </div>
              <div
                className={`length-item medium ${
                  length === "Medium" ? "selected-length-item" : ""
                }`}
                value="Medium"
                onClick={(e) => setBookLength(e)}
              >
                Medium
              </div>
              <div
                className={`length-item long ${
                  length === "Long" ? "selected-length-item" : ""
                }`}
                value="Long"
                onClick={(e) => setBookLength(e)}
              >
                Long
              </div>
            </li>
          </ul>
          <div
            className="single-book-btns"
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "3em",
            }}
          >
            <button
              className="btn btn-primary"
              disabled={tokenValue < 1}
              onClick={() => approveBook()}
            >
              Approve
            </button>
            <button className="btn btn-primary" onClick={() => deleteBook()}>
              Delete
            </button>
          </div>
        </div>
        <img
          src={data.book_img_url}
          alt={data.book_name}
          style={{ maxWidth: "100%" }}
        />
      </div>
    </div>
  );
}
