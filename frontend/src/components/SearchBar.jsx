import React from "react";
import strings from "../resources/strings"; // importing language resource file
import "../assets/css/SearchBar.css"; // importing styles

function SearchBar(props) {
  return (
    <div className="searchbar">
      <input
        className="searchbar-input"
        type="text"
        placeholder={strings.navbar.searchBarText}
        onChange={props.onSearch}
      />
    </div>
  );
}

export default SearchBar;
