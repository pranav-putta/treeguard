import React from "react";
import { useHistory } from "react-router-dom";
import logo from "../logo.svg";
import "./Launch.css";

function Launch() {
  const history = useHistory();
  
  setTimeout(function () {
    history.push("/home");
  }, 2000);

  return (
    <div className="Launch">
      <header className="Launch-header">
        <img src={logo} className="Launch-logo" alt="logo" />
        <p
          style={{ fontFamily: "sans-serif", fontSize: 36, fontWeight: "bold" }}
        >
          Welcome to Tree Guard
        </p>
        <p>
          <code>getting things setup...</code>
        </p>
      </header>
    </div>
  );
}

export default Launch;
