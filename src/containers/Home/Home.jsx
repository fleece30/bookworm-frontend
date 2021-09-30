import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Home.scss";
import { LoginContext } from "../../contexts/loginContext";

export default function Home() {
  const quotes = [
    {
      quote:
        "Good friends, good books, and a sleepy conscience: this is the ideal life.",
      by: "Mark Twain",
    },
    {
      quote: "Books are a uniquely portable magic.",
      by: "Stephen King",
    },
    {
      quote:
        "... a mind needs books as a sword needs a whetstone, if it is to keep its edge.",
      by: "Tyrion Lannister",
    },
    {
      quote: "If you don’t like to read, you haven’t found the right book.",
      by: "J.K. Rowling",
    },
    {
      quote:
        "That’s the thing about books. They let you travel without moving your feet.",
      by: "Jhumpa Lahiri",
    },
    {
      quote: "A book is a dream you hold in your hands.",
      by: "Neil Gaiman",
    },
    {
      quote:
        "You know you’ve read a good book when you turn the last page and feel a little as if you have lost a friend.",
      by: "Paul Sweeney",
    },
    {
      quote:
        "No matter what anybody tells you, words and ideas can change the world.",
      by: "John Keating",
    },
    {
      quote:
        "It is important to draw wisdom from different places. If you take it from only one place, it becomes rigid and stale.",
      by: "Iroh",
    },
    {
      quote:
        "A reader lives a thousand lives before he dies . . . The man who never reads lives only one.",
      by: "George R.R. Martin",
    },
    {
      quote:
        "Until I feared I would lose it, I never loved to read. One does not love breathing.",
      by: "Harper Lee",
    },
    {
      quote: "She read books as one would breathe air, to fill up and live.",
      by: "Annie Dillard",
    },
  ];
  const { isLoggedIn } = useContext(LoginContext);
  let randInt = Math.floor(Math.random() * 12);
  return (
    <div>
      <section>
        <div className="intro">
          <h1 className="title">BOOKWORM</h1>
          <span>
            Rent and Donate books and share the joy of reading with the world!
          </span>
          <div style={{ display: "flex", columnGap: "2em" }}>
            <Link
              to="/collection"
              style={{
                textDecoration: "none",
              }}
            >
              <button className="browse-collection btn-main">
                Browse the library
              </button>
            </Link>
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
              }}
            >
              <button
                style={{ display: JSON.parse(isLoggedIn) ? "none" : "block" }}
                className="sign-up btn-sec"
              >
                Sign up
              </button>
            </Link>
          </div>
        </div>
        <svg
          className="landing-main-bg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1444.42 935.993"
        >
          <path
            id="Path_1"
            data-name="Path 1"
            d="M475.429,0s27.429,301.714,487.619,329.143,138.667,315.429,377.905,466.286,383.848,145.895,578.9,136.752V0Z"
            transform="translate(-475.429)"
            fill="#e6f7ff"
          />
        </svg>

        <img
          className="landing-reading"
          src={`${process.env.PUBLIC_URL}/images/landing-reading.svg`}
          alt="landing-reading"
        />
      </section>
      <section style={{ background: "#E6F7FF" }} className="about">
        <div className="quote-div">
          <div className="quote">"&nbsp;{quotes[randInt].quote}&nbsp;"</div>
          <div className="by">&#65123;&nbsp;{quotes[randInt].by}</div>
        </div>
      </section>
      <section style={{ background: "yellow" }}>a</section>
      <section style={{ background: "green" }}>a</section>
    </div>
  );
}
