import React from "react";

import "./style.css";

const Header = () => {
  return (
    <div className="header">
      <h1 className="header-title">
        <i className="fas fa-book-open"></i> BasicBookStore
      </h1>
      <div className="links-box">
        <div className="basket">
          <i className="fas fa-shopping-basket"></i>
        </div>
      </div>
    </div>
  );
};

export default Header;
