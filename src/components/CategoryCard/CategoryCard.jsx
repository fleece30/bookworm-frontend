import React from "react";
import { Link } from "react-router-dom";
import "./CategoryCard.scss";

export default function CategoryCard(props) {
  return (
    <Link to={`/collection/${props.category}`}>
      <div className="category-card">
        <span style={{ color: "white" }}>{props.category}</span>
        <img src={props.image} alt={props.category} />
      </div>
    </Link>
  );
}
