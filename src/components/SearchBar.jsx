import React from "react";
import stringRes from "../resources/strings";
import "../assets/css/SearchBar.css";

function SearchBar(props) {

    let language = process.env.REACT_APP_LANGUAGE;
    let strings = stringRes[language];

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