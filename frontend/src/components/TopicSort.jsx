import React from "react";
import Select from "react-dropdown-select"; // importing components
import stringRes from "../resources/strings"; // importing language resource file
import "../assets/css/TopicSort.css"; // importing styles

function TopicSort(props) {

    let language = process.env.REACT_APP_LANGUAGE;
    let strings = stringRes[language];

    const options = [
        { label: strings.userTopics.sort.unsorted, value: "unsorted" },
        { label: strings.userTopics.sort.byAbcAsc, value: "a-z" },
        { label: strings.userTopics.sort.byAbcDesc, value: "z-a" },
        { label: strings.userTopics.sort.byDateAsc, value: "date-asc" },
        { label: strings.userTopics.sort.byDateDesc, value: "date-desc" },
      ];

      const onSortOptionChange = (option) => {
        props.onSortOptionChange(option);
      }

      return (
        <div className="topic-sort">
          <label className="topic-sort__label">{strings.userTopics.sort.title}</label>
          <Select
            className="topic-sort__select"
            options={options}
            searchable={false}
            values={props.sortOption}
            onChange={onSortOptionChange}
          />
        </div>
      );
}


export default TopicSort;