import React from "react";
import "./DonateBook.scss";
import { useState, useRef } from "react";
import axios from "axios";
import { Storage } from "../../firebase/index";
import { useSelector } from "react-redux";
import Resizer from "react-image-file-resizer";
import { v4 as uuidv4 } from "uuid";

export default function DonateBook() {
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

  const [bookName, setBookName] = useState("");
  const [tags, setTags] = useState([]);
  const [imageAdded, setImageAdded] = useState(false);
  const [author, setAuthor] = useState("");
  const [desc, setDesc] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [length, setLength] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [finalImage, setFinalImage] = useState("");
  const { user } = useSelector((state) => state.user);

  const mainForm = useRef();
  const btnRef = useRef();

  const showSuggestions = (e) => {
    let searchString = e.target.value.split(" ").join("+");
    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchString}&country=IN`
      )
      .then(({ data }) => setSuggestions([...data.items]))
      .catch((err) => console.log(err));
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

  const setContent = (item) => {
    setSuggestions([]);
    setBookName(item.volumeInfo.title);
    setAuthor(item.volumeInfo.authors[0]);
    setDesc(item.volumeInfo.description);
    setLength(findLen(item.volumeInfo.pageCount));
  };

  const imagePreview = (e) => {
    if (e.target.files.length > 0) {
      let src = URL.createObjectURL(e.target.files[0]);
      let preview = document.getElementById("previewImage");
      preview.src = src;
      setImageAdded(true);
      resizeImage(e.target.files[0]);
    }
  };

  const resizeImage = (file) => {
    new Promise(() => {
      Resizer.imageFileResizer(
        file,
        600,
        800,
        "WEBP",
        70,
        0,
        (uri) => {
          setFinalImage(uri.split(",")[1]);
        },
        "base64"
      );
    });
  };

  const findLen = (pages) => {
    if (pages <= 200) return "Short";
    else if (pages > 200 && pages < 700) return "Medium";
    else return "Long";
  };

  const saveData = () => {
    btnRef.current.textContent = "Wrapping up your book...";
    let bookId = uuidv4();
    Storage.ref(`book_images/${bookId}.png`)
      .putString(finalImage, "base64", { contentType: "image/webp" })
      .on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
        },
        () => {
          Storage.ref(`book_images/${bookId}.png`)
            .getDownloadURL()
            .then((url) => {
              const userId = user.data._id;
              axios
                .post(`${process.env.REACT_APP_BASE_URL}/api/books/addBook`, {
                  book_img_url: url,
                  book_name: bookName,
                  tags: tags,
                  author: author,
                  description: desc,
                  thoughts: thoughts,
                  donatedBy: user.data.username,
                  length: length,
                })
                .then((res) => {
                  mainForm.current.reset();
                  setBookName("");
                  setTags([]);
                  setImageAdded(false);
                  setAuthor("");
                  setDesc("");
                  setLength("");
                  setThoughts("");
                  setShowSuccess(true);
                  btnRef.current.textContent = "Save Book";
                  axios
                    .post(
                      `${process.env.REACT_APP_BASE_URL}/api/user/donated`,
                      {
                        book: res.data._id,
                        id: userId,
                      }
                    )
                    .then((res) => console.log(res))
                    .catch((err) => console.log(err));
                });
            });
        }
      );
  };

  return (
    <div className="donate-book">
      <div className="edit-panel">
        <h2>Donate a book</h2>
        <form ref={mainForm}>
          <div className="form">
            {/* Input for Book name */}
            <input
              type="text"
              placeholder="Book Name"
              value={bookName}
              onChange={(e) => {
                setBookName(e.target.value);
                if (e.target.value.length > 6) {
                  showSuggestions(e);
                }
              }}
            />

            <div
              className="suggestions"
              style={{ display: suggestions.length === 0 ? "none" : "flex" }}
            >
              {suggestions === undefined
                ? console.log("no res")
                : suggestions.map((item, key) => {
                    if (
                      item.volumeInfo.imageLinks !== undefined &&
                      item.volumeInfo.imageLinks.thumbnail !== undefined &&
                      item.volumeInfo.title !== undefined &&
                      item.volumeInfo.authors
                    ) {
                      return (
                        <div
                          key={key}
                          className="suggestItem"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginRight: "8px",
                          }}
                          onClick={() => setContent(item)}
                        >
                          <img
                            src={item.volumeInfo.imageLinks.thumbnail}
                            alt=""
                            style={{ minHeight: "120px", maxHeight: "120px" }}
                          />
                          <div style={{ fontWeight: "bold" }}>
                            {item.volumeInfo.title.substring(0, 50)}
                          </div>
                          <div>{item.volumeInfo.authors[0]}</div>
                        </div>
                      );
                    } else {
                      return <span key={key}></span>;
                    }
                  })}
            </div>
            <div>
              *The automatic data fetch might not always be correct. Please
              check the information before submitting.
            </div>
            {/* Input for Book Description */}
            <textarea
              autoComplete="off"
              className="descArea"
              id="book-desc"
              placeholder="Book Description"
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows="5"
            />
            {/* Input for Author */}
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
            />
            {/* Input for donator's thoughts */}
            <input
              type="text"
              placeholder="Your thoughts on the book"
              value={thoughts}
              onChange={(e) => {
                setThoughts(e.target.value);
              }}
            />
            {/* Input for length */}
            <h5 style={{ margin: "0.5em 0 0 0" }}>Book Length</h5>
            <div className="length-options">
              <div
                className={`short length-option ${
                  length === "Short" ? "selectedLen" : ""
                }`}
                onClick={() => {
                  setLength("Short");
                }}
              >
                Short
              </div>
              <div
                className={`medium length-option ${
                  length === "Medium" ? "selectedLen" : ""
                }`}
                onClick={() => {
                  setLength("Medium");
                }}
              >
                Medium
              </div>
              <div
                className={`long length-option ${
                  length === "Long" ? "selectedLen" : ""
                }`}
                onClick={() => {
                  setLength("Long");
                }}
              >
                Long
              </div>
            </div>
            <div className="len-legend">
              Short (less than 200 pages) <br /> Medium (200-700 pages) <br />{" "}
              Long (more than 700 pages)
            </div>
            {/* Input for tags */}
            <h5 style={{ margin: "0.5em 0 0 0" }}>Tags</h5>
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
                    onClick={() => addTag(item)}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
            {/* Input for image file */}
            <label className="file-input">
              <input type="file" onChange={(e) => imagePreview(e)} />
              Select book image
            </label>
            <button
              ref={btnRef}
              disabled={
                !bookName ||
                !length ||
                !imageAdded ||
                !desc ||
                !author ||
                tags.length === 0
              }
              onClick={(e) => {
                e.preventDefault();
                saveData();
              }}
            >
              Save Book
            </button>
          </div>
        </form>
        <div
          className="successBox"
          style={{
            display: showSuccess ? "flex" : "none",
            alignItems: "center",
            marginTop: "1em",
          }}
        >
          <svg
            id="aaa"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 130.2 130.2"
          >
            <circle
              className="path circle"
              fill="none"
              stroke="#73AF55"
              strokeWidth="6"
              strokeMiterlimit="10"
              cx="65.1"
              cy="65.1"
              r="62.1"
            />
            <polyline
              className="path check"
              fill="none"
              stroke="#73AF55"
              strokeWidth="6"
              strokeLinecap="round"
              strokeMiterlimit="10"
              points="100.2,40.2 51.5,88.8 29.8,67.5 "
            />
          </svg>
          <span>Book Saved Successfully.</span>
        </div>
        <p
          style={{ fontWeight: "bold", display: showSuccess ? "flex" : "none" }}
        >
          You have just shared the joy of reading with the people around you and
          help in expanding our library. We will review the donation request and
          it will be added to the website in a day or two. You can now donate
          another book or browse books donated by other people. Have a good one!{" "}
        </p>
        {/* Troubleshooting */}
        <div style={{ marginTop: "0.5em" }}>
          <i>
            *If the SAVE BOOK button is disabled, you can troubleshoot using the
            following points:
            <ol>
              <li>
                None of the required (<span style={{ color: "red" }}>*</span>)
                fields are empty.
              </li>
              <li>Make sure you have uploaded a photo of the book.</li>
            </ol>
          </i>
        </div>
      </div>
      {/* Preview */}
      <div className="preview-panel">
        <div className="preview">
          <h1>{bookName}</h1>
          <div className="book-information">
            <div className="info">
              <h5 style={{ display: author !== "" ? "block" : "none" }}>
                Author - {author}
              </h5>
              <p>{desc}</p>
              <div style={{ display: thoughts.length > 0 ? "block" : "none" }}>
                <h5>
                  What {user !== null ? user.data.username : ""} thinks about
                  the book:{" "}
                </h5>
                <p>{thoughts}</p>
              </div>
              <div
                style={{
                  display: length !== "" ? "block" : "none",
                  marginBottom: "1em",
                }}
              >
                <h5>Book Length</h5> <p>{length}</p>
              </div>
              <div style={{ display: tags.length !== 0 ? "block" : "none" }}>
                <h5>Tags</h5>
                <ul>
                  {tags.map((item, key) => {
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
                alt="preview"
                id="previewImage"
                style={{
                  display: imageAdded ? "block" : "none",
                  maxWidth: "100%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
