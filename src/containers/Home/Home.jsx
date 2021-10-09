import React, { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.scss";
import { LoginContext } from "../../contexts/loginContext";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import TestimonialCard from "../../components/TestimonialCard/TestimonialCard";

export default function Home() {
  const quoteIndices = useRef([]);
  const quotes = [
    {
      quote:
        "Good friends, good books, and a sleepy conscience: this is the ideal life.",
      by: "Mark Twain",
      photo:
        "https://cdn.britannica.com/w:400,h:300,c:crop/83/136283-050-9C9D6ED8/Mark-Twain-1907.jpg",
      whotheyare: "Author of Tom Sawyer stories",
    },
    {
      quote: "Books are a uniquely portable magic.",
      by: "Stephen King",
      photo:
        "https://media.npr.org/assets/img/2020/04/07/stephen-king.by-shane-leonard_wide-f9df986f26c8d66ecb63cf8e49bded6360cbd9d3.jpg?s=1400",
      whotheyare: "Author of IT and The Shining",
    },
    {
      quote:
        "... a mind needs books as a sword needs a whetstone, if it is to keep its edge.",
      by: "Tyrion Lannister",
      photo:
        "https://ficquotes.com/images/characters/tyrion-lannister-game-of-thrones.jpg",
      whotheyare: "Lord of Casterly Rock",
    },
    {
      quote: "If you don’t like to read, you haven’t found the right book.",
      by: "J.K. Rowling",
      photo:
        "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/newscms/2020_26/3155921/191219-j-k-rowling-2018-ac-845p.jpg",
      whotheyare: "Author of the Harry Potter series",
    },
    {
      quote:
        "That’s the thing about books. They let you travel without moving your feet.",
      by: "Jhumpa Lahiri",
      photo:
        "https://media.newyorker.com/photos/5a3bfd95dd90ae25642407f9/master/w_1600%2Cc_limit/122117-Writers-Voice-Jhumpa-Lahiri-CP.jpg",
      whotheyare: "Author of Interpreter of Maladies",
    },
    {
      quote: "A book is a dream you hold in your hands.",
      by: "Neil Gaiman",
      photo:
        "https://images.indulgexpress.com/uploads/user/imagelibrary/2020/6/19/original/NeilGaimanPhotoIANS1.jpg",
      whotheyare: "Author of American Gods",
    },
    {
      quote:
        "No matter what anybody tells you, words and ideas can change the world.",
      by: "John Keating",
      photo:
        "https://pbs.twimg.com/profile_images/1341167665201762313/TVaivmMA_400x400.jpg",
      whotheyare: "English professor at Welton Academy",
    },
    {
      quote:
        "It is important to draw wisdom from different places. If you take it from only one place, it becomes rigid and stale.",
      by: "Iroh",
      photo:
        "https://pbs.twimg.com/profile_images/1276198576574562304/MhImKP8w_400x400.jpg",
      whotheyare: "Tea Enthusiast and former Fire Nation General",
    },
    {
      quote:
        "A reader lives a thousand lives before he dies . . . The man who never reads lives only one.",
      by: "George R.R. Martin",
      photo:
        "https://www.biography.com/.image/t_share/MTgxMTc1MDk2Njg0MDYyMDU2/gettyimages-1134756820.jpg",
      whotheyare: "Author of Game of Thrones",
    },
    {
      quote:
        "Until I feared I would lose it, I never loved to read. One does not love breathing.",
      by: "Harper Lee",
      photo:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuVgst1ABJ8galDua74h-P7QxO20-CqJcYhQ&usqp=CAU",
      whotheyare: "Author of To Kill a Mockingbird",
    },
    {
      quote: "She read books as one would breathe air, to fill up and live.",
      by: "Annie Dillard",
      photo:
        "https://static.ffx.io/images/$zoom_1%2C$multiply_0.2858%2C$ratio_1.777778%2C$width_1312%2C$x_0%2C$y_59/t_crop_custom/q_86%2Cf_auto/0b86aded2a5522b4653568616a43f98e1a09b3b7",
      whotheyare: "Known for her essays on the natural world",
    },
  ];

  const categories = [
    {
      category: "Action and Adventure",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/action-adventure.webp`,
    },
    {
      category: "Classics",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/classics.webp`,
    },
    {
      category: "Comic Book or Graphic Novel",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/comics.webp`,
    },
    {
      category: "Detective and Mystery",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/detective.webp`,
    },
    {
      category: "Fantasy",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/fantasy.webp`,
    },
    {
      category: "Historical Fiction",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/historical-fiction.webp`,
    },
    {
      category: "Horror",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/horror.webp`,
    },
    {
      category: "Literary Fiction",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/lit-fiction.webp`,
    },
    {
      category: "Romance",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/romance.webp`,
    },
    {
      category: "Science Fiction",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/sci-fi.webp`,
    },
    {
      category: "Short Stories",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/short.webp`,
    },
    {
      category: "Suspense and Thriller",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/thriller.webp`,
    },
    {
      category: "Biography or Autobiography",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/bio.webp`,
    },
    {
      category: "Poetry",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/poetry.webp`,
    },
    {
      category: "Self-Help",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/self-help.webp`,
    },
    {
      category: "True Crime",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/crime.webp`,
    },
    {
      category: "Women's Fiction",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/women-fic.webp`,
    },
    {
      category: "Cook Books",
      image: `${process.env.PUBLIC_URL}/images/CategoryImages/cook.webp`,
    },
  ];

  while (quoteIndices.current.length < 3) {
    let r = Math.floor(Math.random() * 11);
    if (quoteIndices.current.indexOf(r) === -1) quoteIndices.current.push(r);
  }

  const { isLoggedIn } = useContext(LoginContext);
  return (
    <div className="home-container">
      <section>
        <div className="intro">
          <h1 className="title">KITAABAE</h1>
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
              to={JSON.parse(isLoggedIn) ? "returnbooks" : "/signup"}
              style={{
                textDecoration: "none",
              }}
            >
              <button className="sign-up btn-sec">
                {JSON.parse(isLoggedIn) ? "Return Books" : "Sign up"}
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
      <section className="about">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1922.345 472.521">
          <g id="Group_1" data-name="Group 1" transform="translate(0 -609.474)">
            <path
              id="Path_2"
              data-name="Path 2"
              d="M0,440.011V912.533H1922.345V629.816Z"
              transform="translate(0 169.462)"
              fill="#e6f7ff"
            />
            <path
              id="Path_1"
              data-name="Path 1"
              d="M0,618.541V932.719H1922.345V777.478Z"
              transform="translate(0 145.67)"
              fill="#a4e2ff"
            />
          </g>
        </svg>

        {/* <div style={{ position: "relative" }}>
          <div className="quote-div">
            <div className="quote">"&nbsp;{quotes[randInt].quote}&nbsp;"</div>
            <div className="by">&#65123;&nbsp;{quotes[randInt].by}</div>
          </div>
        </div>
        <div className="about-us">
          <div className="who-we-are">
            <img
              src={`${process.env.PUBLIC_URL}/images/shelf_man.svg`}
              alt="Shelf man"
            />
            <div className="who-we-are-intro">
              They say that books are a gift you can open again and again.
            </div>
          </div>
        </div> */}
        <div className="about-head">
          <p>Regarding books, from the wise!</p>
        </div>
        <div className="testimonial-cards">
          <TestimonialCard quoteObject={quotes[quoteIndices.current[0]]} />
          <TestimonialCard quoteObject={quotes[quoteIndices.current[1]]} />
          <TestimonialCard quoteObject={quotes[quoteIndices.current[2]]} />
        </div>
      </section>
      <section className="category-section">
        <div
          className="categories"
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            columnGap: "2em",
            rowGap: "3em",
          }}
        >
          {categories.map((item, key) => {
            return (
              <CategoryCard
                key={key}
                category={item.category}
                image={item.image}
              />
            );
          })}
        </div>
      </section>
      <section className="pricing">a</section>
      <div className="footer">
        <img
          src={`${process.env.PUBLIC_URL}/images/kitaabae_logo.svg`}
          alt=""
        />
      </div>
    </div>
  );
}
