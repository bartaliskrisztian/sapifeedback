import React from "react";
import "../assets/css/SearchBar.css";

function SearchBar(props) {
    return (
        <div className="searchbar">
            <input 
                className="searchbar-input"
                type="text"  
                placeholder="Search between your topics"
                onChange={props.onSearch}
            />
        </div>
    );
}

export default SearchBar;