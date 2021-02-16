import React from "react";
import strings_EN from "../resources/strings_EN";
import "../assets/css/SearchBar.css";

function SearchBar(props) {

    let strings = strings_EN;

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