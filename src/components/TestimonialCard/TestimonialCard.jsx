import React from "react";
import "./TestimonialCard.scss";

export default function TestimonialCard(props) {
  return (
    <div className={`main-card ${props.id}`}>
      <p style={{ fontSize: "1.1em" }}>{props.quoteObject.quote}</p>
      <div
        className="quote-pic"
        style={{ backgroundImage: `url(${props.quoteObject.photo})` }}
      ></div>
      <div className="quote-name">{props.quoteObject.by}</div>
      <div className="who-they-are">{props.quoteObject.whotheyare}</div>
    </div>
  );
}
