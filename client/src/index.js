import React from "react";

import { render } from "react-dom";

import "./style.css";

import Header from "./components/layout/Header";

const App = () => {
  return (
    <div className="app">
      <Header />
      <div className="scroll-box"></div>
    </div>
  );
};

render(<App />, document.getElementById("root"));
