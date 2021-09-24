import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({
  component: Component,
  ...otherProps
}) {
  const { isAdmin } = useSelector((state) => state.user);
  return (
    <Route
      {...otherProps}
      render={(props) =>
        isAdmin ? <Component {...props} /> : <Redirect to="/home" />
      }
    />
  );
}
