import React from "react";

// importing language resource file
import stringRes from "../resources/strings";

// importing styles
import "../assets/css/SearchBar.css";

function SearchBar(props) {

    // string resources
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