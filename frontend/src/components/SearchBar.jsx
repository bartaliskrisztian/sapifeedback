import React from "react";
import { withNamespaces } from "react-i18next";
import "../assets/css/SearchBar.css"; // importing styles

function SearchBar({ t }, props) {
  return (
    <div className="searchbar">
      <input
        className="searchbar-input"
        type="text"
        placeholder={t("Search between your topics")}
        onChange={props.onSearch}
      />
    </div>
  );
}

export default withNamespaces()(SearchBar);
