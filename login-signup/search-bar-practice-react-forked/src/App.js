import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";


export default function SearchBar() {
  return(
    <div className="App">
      <input
        type="text"
        placeholder="Search"
      />

    </div>

  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<SearchBar />, rootElement);
