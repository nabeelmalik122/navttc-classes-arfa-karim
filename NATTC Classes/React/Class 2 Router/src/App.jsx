import React from "react";
import { Link, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Route>
        <Link to="/">Home Us</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link>
      </Route>
    </>
  );
}

export default App;
