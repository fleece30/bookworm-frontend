import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { gql, useApolloClient } from "@apollo/client";
import BookCard from "../../components/BookCard/bookCard";
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

export default function Library() {
  const [data, setData] = useState({});
  const [queryTags, setQueryTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearched, setshowSearched] = useState(false);
  const [books, setBooks] = useState([]);
  const { user } = useSelector((state) => state.user);
  const id = useRef("");
  const client = useApolloClient();

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
    if (books.length === 0 && showSearched) return;
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
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/books/bookInfo/${id.current}`)
      .then(({ data }) => {
        setData({ ...data });
      })
      .catch((err) => console.log(err));
  };

  // function getAllBooks() {

  //   return <div></div>;

  // return (
  //   <div className="all-books-container">
  //     {data === undefined
  //       ? ""
  //       : data.books.map((item, key) => {
  //           return (
  //             <div
  //               key={key}
  //               onClick={() => {
  //                 id.current = item._id;
  //                 getBookInfo();
  //               }}
  //             >
  //               <BookCard
  //                 key={key}
  //                 id={item._id}
  //                 book_name={item.book_name}
  //                 book_img_url={item.book_img_url}
  //                 author={item.author}
  //                 description={item.description}
  //                 length={item["length"]}
  //                 instock={item.inStock}
  //               />
  //             </div>
  //           );
  //         })}
  //   </div>
  // );
  // }

  return (
    <div>
      <h1>Browse the library</h1>
      <div className="library">
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
          <span>
            Select tags to filter results by and press <i>ENTER</i> to search or{" "}
            <i>DEL</i> to clear
          </span>
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
              className="btn-search"
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
              Search
            </button>
            <button
              className="btn-clear"
              onClick={() => {
                setshowSearched(false);
                setQueryTags([]);
                setSearchTerm("");
              }}
            >
              Clear
            </button>
          </div>
          {/* {getAllBooks()} */}
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
        <div className="preview-panel">
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
                </div>
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
