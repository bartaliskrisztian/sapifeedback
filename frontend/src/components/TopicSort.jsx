import React from "react";
import Select from "react-dropdown-select"; // importing components
import { withNamespaces } from "react-i18next";
import { connect } from "react-redux";
import "../assets/css/TopicSort.css"; // importing styles

function TopicSort({ t, props }) {
  const options = [
    { label: t("A-Z"), value: "a-z" },
    { label: t("Z-A"), value: "z-a" },
    { label: t("By date ascending"), value: "date-asc" },
    { label: t("By date descending"), value: "date-desc" },
  ];

  const onSortOptionChange = (option) => {
    props.onSortOptionChange(option);
    console.log(option);
  };

  return (
    <div className="topic-sort">
      <div className="topic-sort__label">{t("Sort by")}</div>
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

// getting the global state variables with redux
const mapStateToProps = (state, ownProps) => {
  const props = {
    onSortOptionChange: ownProps.onSortOptionChange,
    sortOption: ownProps.sortOption,
  };
  return { props };
};

export default connect(mapStateToProps)(withNamespaces()(TopicSort));
