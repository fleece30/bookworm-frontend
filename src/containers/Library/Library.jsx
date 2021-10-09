import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { gql, useApolloClient } from "@apollo/client";
import BookCard from "../../components/BookCard/bookCard";
import { loadUserThunk } from "../../redux/user";
import { addToCartThunk } from "../../redux/cart";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import "./Library.scss";

const BOOK_QUERY = gql`
  query BookQuery {
    books {
      _id
      book_name
      book_img_url
      author
      description
      length
      inStock
    }
  }
`;

const SEARCH_QUERY = gql`
  query BookQuery($queryTags: [String!], $searchTerm: String!) {
    books_search(queryTags: $queryTags, searchTerm: $searchTerm) {
      _id
      book_name
      book_img_url
      author
      description
      length
      inStock
    }
  }
`;

export default function Library(props) {
  const [data, setData] = useState({});
  const [queryTags, setQueryTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearched, setshowSearched] = useState(false);
  const [books, setBooks] = useState([]);
  const [inSaved, setInSaved] = useState(false);
  const [btnText, setBtnText] = useState("");
  const [isPreviewActive, setPreviewActive] = useState(false);
  const [fromCategory, setfromCategory] = useState(false);
  const { user } = useSelector((state) => state.user);
  const id = useRef("");
  const scrollYValue = useRef(0);
  const client = useApolloClient();
  const dispatch = useDispatch();

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
    "History",
    "Poetry",
    "Self-Help",
    "True Crime",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (Object.keys(props.match.params).length !== 0) {
      setfromCategory(true);
      try {
        client
          .query({
            query: SEARCH_QUERY,
            variables: {
              queryTags: [props.match.params.category],
              searchTerm,
            },
          })
          .then(({ data }) => {
            setBooks([...data.books_search]);
          });
        setshowSearched(true);
      } catch (e) {
        console.log(e);
      }
    } else if (props.location.id !== null && props.location.id !== undefined) {
      id.current = props.location.id;
      getBookInfo();
      setPreviewActive(true);
    } else {
      try {
        client
          .query({
            query: BOOK_QUERY,
          })
          .then(({ data }) => {
            setBooks([...data.books]);
          });
      } catch (e) {
        console.log(e);
      }
    }
    dispatch(loadUserThunk());
    if (books.length === 0 && showSearched) return;
  }, [client]); // eslint-disable-line react-hooks/exhaustive-deps

  const addTag = (item) => {
    const index = queryTags.findIndex((o) => o === item);
    if (index === -1) {
      setQueryTags([...queryTags, item]);
    } else {
      let newTags = queryTags;
      newTags.splice(index, 1);
      setQueryTags([...newTags]);
    }
  };

  const getBookInfo = () => {
    setInSaved(false);
    if (user && user.data.cart.some((obj) => obj._id === id.current)) {
      setBtnText("Already in cart");
    } else {
      setBtnText("Add to cart");
    }
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/books/bookInfo/${id.current}`)
      .then(({ data }) => {
        setData({ ...data });
        if (
          user !== undefined &&
          user.data.savedBooks.findIndex((o) => o === data._id) !== -1
        ) {
          setInSaved(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const addToCart = () => {
    dispatch(addToCartThunk({ userId: user.data._id, book: data }));
    setBtnText("Already in cart");
  };

  const saveBook = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    if (!inSaved) {
      const userId = user.data._id;
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/user/addtosaved`,
          {
            bookId: id.current,
            id: userId,
          },
          config
        )
        .then((res) => setInSaved(true))
        .catch((err) => console.log(err));
    } else {
      const userId = user.data._id;
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/user/removefromsaved`,
          {
            bookId: id.current,
            userId: userId,
          },
          config
        )
        .then((res) => setInSaved(false))
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      <h1>Browse the library</h1>
      <div className={`library ${isPreviewActive ? "preview-active" : ""}`}>
        <div className="items">
          <div className="searchbar">
            <input
              type="text"
              placeholder="Search by book name or author"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              value={searchTerm}
            />
          </div>
          <div
            className="book-tags"
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            {genreTags.map((item, key) => {
              return (
                <div
                  key={key}
                  className={`tagItem ${
                    queryTags.findIndex((o) => o === item) !== -1
                      ? "selectedTag"
                      : ""
                  }`}
                  value={item}
                  onClick={() => addTag(item)}
                >
                  {item}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", columnGap: "2em" }}>
            <button
              className="btn-search btn-main"
              style={{
                width:
                  searchTerm === "" && queryTags.length === 0
                    ? "fit-content"
                    : "10em",
              }}
              onClick={async (e) => {
                try {
                  client
                    .query({
                      query: SEARCH_QUERY,
                      variables: {
                        queryTags,
                        searchTerm,
                      },
                    })
                    .then(({ data }) => setBooks([...data.books_search]));
                  setshowSearched(true);
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              {searchTerm === "" && queryTags.length === 0
                ? "Show All Books"
                : "Search"}
            </button>
            <Link to={"/collection"}>
              <button
                className="btn-clear btn-sec"
                style={{ width: "10em" }}
                onClick={() => {
                  setshowSearched(false);
                  setQueryTags([]);
                  setSearchTerm("");
                }}
              >
                Clear
              </button>
            </Link>
          </div>
          {/* {getAllBooks()} */}
          {fromCategory ? (
            <h4 style={{ margin: "1.2em 0" }}>
              {props.match.params.category} books
            </h4>
          ) : (
            ""
          )}
          <div className="all-books-container">
            {books === undefined || books.length === 0 ? (
              showSearched ? (
                <h4>No results</h4>
              ) : (
                ""
              )
            ) : (
              books.map((item, key) => {
                return (
                  <div
                    key={key}
                    onClick={() => {
                      id.current = item._id;
                      getBookInfo();
                      setPreviewActive(true);
                      scrollYValue.current = window.scrollY;
                      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                    }}
                  >
                    <BookCard
                      key={key}
                      id={item._id}
                      book_name={item.book_name}
                      book_img_url={item.book_img_url}
                      author={item.author}
                      description={item.description}
                      length={item["length"]}
                      instock={item.inStock}
                    />
                  </div>
                );
              })
            )}
          </div>
          {/* )} */}
        </div>
        <div className={`preview-panel ${isPreviewActive ? "slide" : ""}`}>
          {Object.keys(data).length === 0 ? (
            ""
          ) : (
            <div className="preview">
              <h1>{data.book_name}</h1>
              <div className="book-information">
                <div className="info">
                  <h5>Author - {data.author}</h5>
                  <p>{data.description}</p>
                  <div
                    style={{
                      display: data.thoughts.length > 0 ? "block" : "none",
                    }}
                  >
                    <h5>
                      What {user !== null ? user.data.username : ""} thinks
                      about the book:{" "}
                    </h5>
                    <p>{data.thoughts}</p>
                  </div>
                  <div
                    style={{
                      marginBottom: "1em",
                    }}
                  >
                    <h5>Book Length</h5> <p>{data["length"]}</p>
                  </div>
                  <div
                    style={{
                      display: data.tags.length !== 0 ? "block" : "none",
                      marginBottom: "1em",
                    }}
                  >
                    <h5>Tags</h5>
                    <ul>
                      {data.tags.map((item, key) => {
                        return (
                          <li key={key}>
                            <p style={{ marginBottom: "0" }}>{item}</p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div>
                    <h5>Borrow for</h5>
                    <img
                      src={`${process.env.PUBLIC_URL}/images/token-icon.png`}
                      alt=""
                      style={{
                        width: "1.4em",
                        position: "relative",
                        top: "-0.1em",
                      }}
                    />
                    &nbsp;<b>{data.tokenValue}</b>
                  </div>
                </div>
                <div>
                  <div className="image">
                    <img
                      src={data.book_img_url}
                      alt="preview"
                      id="previewImage"
                      style={{
                        maxWidth: "100%",
                      }}
                    />
                  </div>
                  <div className="call-to-action">
                    <button
                      className="add-to-cart btn-main"
                      onClick={() => addToCart()}
                      disabled={btnText === "Already in cart" ? true : false}
                    >
                      {btnText}
                    </button>
                    <button
                      className="add-to-saved btn-sec"
                      onClick={() => saveBook()}
                    >
                      {inSaved ? "Remove from Wishlist" : "Add to Wishlist"}
                    </button>
                    <button
                      className="add-to-saved btn-sec"
                      onClick={() => {
                        setPreviewActive(false);
                        setTimeout(() => {
                          setData([]);
                        }, 500);
                      }}
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div
            className={`go-to-location ${
              scrollYValue.current === 0 || !isPreviewActive ? "hide" : ""
            }`}
            onClick={() =>
              window.scrollTo({ top: scrollYValue.current, behavior: "smooth" })
            }
            data-tip
            data-for="scroll-to-location"
          >
            <i className="fal fa-arrow-down fa-2x"></i>
          </div>
        </div>
      </div>
      <ReactTooltip id="scroll-to-location" place="top" effect="solid">
        Scroll to your last <br />
        browsing location
      </ReactTooltip>
    </div>
  );
}
