import React from "react";
import { withNamespaces } from "react-i18next";
import { connect } from "react-redux";
import "../assets/css/SearchBar.css"; // importing styles

function SearchBar({ t, props }) {
  return (
    <div className="searchbar">
      <div className="searchbar-input__icon"></div>
      <input
        className="searchbar-input"
        type="text"
        placeholder={t("Search between your topics")}
        onChange={props.onSearch}
      />
    </div>
  );
}

// getting the global state variables with redux
const mapStateToProps = (state, ownProps) => {
  const props = {
    onSearch: ownProps.onSearch,
  };
  return { props };
};

export default connect(mapStateToProps)(withNamespaces()(SearchBar));
