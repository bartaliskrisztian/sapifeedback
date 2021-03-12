import React, {useState} from "react";

// importing components
import Select from "react-dropdown-select";
import { connect } from "react-redux";

// importing language resource file
import stringRes from "../resources/strings";

// importing styles
import "../assets/css/TopicSort.css";

function TopicSort({isLoggedIn, dispatch}) {

    let language = process.env.REACT_APP_LANGUAGE;
    let strings = stringRes[language];

    const options = [
        { label: strings.userTopics.sort.unsorted, value: "unsorted" },
        { label: strings.userTopics.sort.byAbcAsc, value: "az" },
        { label: strings.userTopics.sort.byAbcDesc, value: "za" },
        { label: strings.userTopics.sort.byDateAsc, value: "date-asc" },
        { label: strings.userTopics.sort.byDateDesc, value: "date_desc" },
      ];
      return (
        <div className="topic-sort">
          <label className="topic-sort__label">{strings.userTopics.sort.title}</label>
          <Select
            className="topic-sort__select"
            options={options}
            searchable={false}
          />
        </div>
      );
}

// getting the global state variables with redux
const mapStateToProps = (state) => {
    return state;
}

// getting redux dispatch function for changing global state variables
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicSort);