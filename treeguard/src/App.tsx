import React from "react";
import { Route, Router, Link } from "react-router-dom";
import "./App.css";
import Launch from "./screens/Launch";
import { createBrowserHistory } from "history";
import Home from "./screens/Home";

function App() {
  return (
    <Router history={createBrowserHistory()}>
      <div>
        <Route path="/" exact component={Launch} />
        <Route path="/home" component={Home} />
      </div>
    </Router>
  );
}

export default App;
