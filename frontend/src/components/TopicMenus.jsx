import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";

// importing language resource file
import { withNamespaces } from "react-i18next";
import { connect } from "react-redux";

import "../assets/css/TopicMenus.css";

function TopicMenus({ t, props }) {
  const params = useParams();
  const [selectedMenu, setSelectedMenu] = useState("details");
  const [menuDropdownOpen, _setMenuDropdownOpen] = useState(false);
  const menuDropdownOpenRef = useRef(menuDropdownOpen);
  const setMenuDropdownOpen = (data) => {
    menuDropdownOpenRef.current = data;
    _setMenuDropdownOpen(data);
  };
  const sideMenuRef = useRef();

  useEffect(() => {
    const temp = window.location.hash.split("/");
    const pageType = temp[temp.length - 1];
    setSelectedMenu(pageType);

    window.addEventListener("click", handleClick);
    // cleanup this component
    return () => {
      window.removeEventListener("click", handleClick);
    };
    // eslint-disable-next-line
  }, [window.location.hash]);

  const handleClick = (e) => {
    if (
      !sideMenuRef.current?.contains(e.target) &&
      e.target.className !== "topic__side-menu-icon"
    ) {
      setMenuDropdownOpen(false);
    }
  };

  return (
    <div className={`topic__side-menu ${props.place}`} ref={sideMenuRef}>
      <Link to="/" className="side-menu__title">
        {t("Feedback app")}
      </Link>
      <div
        className="topic__side-menu-icon"
        onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
      ></div>
      <div
        className={`side-menu__elements${menuDropdownOpen ? " open" : ""}`}
        id="side-menu__elements"
      >
        <a
          className={`side-menu__item ${
            selectedMenu === "details" ? "selected" : ""
          }`}
          href={`/#/topic/${params.topicId}/details`}
        >
          <div className="side-menu__content">
            <div className="side-menu__icon details-icon"></div>
            {t("Details")}
          </div>
        </a>
        <a
          className={`side-menu__item ${
            selectedMenu === "feedbacks" ? "selected" : ""
          }`}
          href={`/#/topic/${params.topicId}/feedbacks`}
        >
          <div className="side-menu__content">
            <div className="side-menu__icon feedback-icon"></div>
            {t("Feedbacks")}
          </div>
        </a>
        <a
          className={`side-menu__item ${
            selectedMenu === "wordCloud" ? "selected" : ""
          }`}
          href={`/#/topic/${params.topicId}/wordCloud`}
        >
          <div className="side-menu__content">
            <div className="side-menu__icon wordCloud-icon"></div>
            {t("Word Cloud")}
          </div>
        </a>
        <a
          className={`side-menu__item ${
            selectedMenu === "freq" ? "selected" : ""
          }`}
          href={`/#/topic/${params.topicId}/freq`}
        >
          <div className="side-menu__content">
            <div className="side-menu__icon frequency-icon"></div>
            {t("Feedback frequency")}
          </div>
        </a>
      </div>
    </div>
  );
}

// getting the global state variables with redux
const mapStateToProps = (state, ownProps) => {
  const props = {
    place: ownProps.place,
  };
  return { props };
};

export default connect(mapStateToProps)(withNamespaces()(TopicMenus));
