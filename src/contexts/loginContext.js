import React, { createContext, useState, useEffect } from "react";

export const LoginContext = createContext();

export function LoginContextProvider(props) {
  //   const [isLoggedIn, setLoggedIn] = useReducer(reducer, initialState);
  const [isLoggedIn, setLoggedIn] = useState(
    localStorage.getItem("isLoggedIn")
  );
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);
  const changeLoggedInStatus = (newLoggedInStatus) => {
    setLoggedIn(newLoggedInStatus);
  };
  return (
    <LoginContext.Provider value={{ isLoggedIn, changeLoggedInStatus }}>
      {props.children}
    </LoginContext.Provider>
  );
}
