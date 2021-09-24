import "./App.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Route, Switch } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Nav/Nav";
import Home from "./containers/Home/Home";
import Login from "./containers/Login/Login";
import AdminHome from "./containers/AdminHome/AdminHome";
import CheckBook from "./containers/CheckBook/CheckBook";
import Library from "./containers/Library/Library";
// import SearchBooks from "./containers/SearchBooks/SearchBooks";
// import Profile from "./containers/Profile/Profile";
import DonateBook from "./containers/DonateBook/DonateBook";
import Signup from "./containers/Signup/Signup";
// import SingleBook from "./containers/SingleBook/SingleBook";
// import BookByLen from "./containers/BookByLen";
// import ActivationPage from "./containers/ActivationPage";
// import BooksByCategory from "./containers/BooksByCategory/BooksByCategory";
// import ResetPassword from "./containers/ResetPassword/ResetPassword";
// import Cart from "./containers/Cart/Cart";

function App() {
  const client = new ApolloClient({
    uri: `${process.env.REACT_APP_BASE_URL}/graphql`,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <>
            <Nav />
            {/* <div style={{ minHeight: "30px" }}></div> */}
            <Route exact path={["/home", "/"]} component={Home} />
            <ProtectedRoute exact path="/adminhome" component={AdminHome} />
            <Route path="/donate" component={DonateBook} />
            <Route path="/collection" component={Library} />
            <Route exact path="/checkbook/:id" component={CheckBook} />
            {/*<Route path="/search" component={SearchBooks} />
            <Route path="/profile" component={Profile} />
            
            <Route path="/book/:id" component={SingleBook} />
            <Route path="/books/:length" component={BookByLen} />
            <Route path="/cart" component={Cart} />
            <Route path="/resetpassword/:token" component={ResetPassword} />
            <Route exact path="/resetpassword" component={ResetPassword} />
            <Route
              exact
              path="/category/:category"
              component={BooksByCategory}
            /> */}
          </>
        </Switch>
      </div>
    </ApolloProvider>
  );
}

export default App;
