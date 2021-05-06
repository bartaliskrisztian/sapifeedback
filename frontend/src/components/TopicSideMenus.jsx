import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// importing language resource file
import { withNamespaces } from "react-i18next";

import "../assets/css/TopicSideMenus.css";

function TopicSideMenus({ t }) {
  const params = useParams();
  const [selectedMenu, setSelectedMenu] = useState("details");

  useEffect(() => {
    const temp = window.location.hash.split("/");
    const pageType = temp[temp.length - 1];
    setSelectedMenu(pageType);
    // eslint-disable-next-line
  }, [window.location.hash]);

  return (
    <div className="topic__side-menu">
      <Link to="/" className="side-menu__title">
        {t("Feedback app")}
      </Link>
      <div className="side-menu__elements" id="side-menu__elements">
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
            selectedMenu === "reports" ? "selected" : ""
          }`}
          href={`/#/topic/${params.topicId}/reports`}
        >
          <div className="side-menu__content">
            <div className="side-menu__icon report-icon"></div>
            {t("Reports")}
          </div>
        </a>
        <a
          className={`side-menu__item ${
            selectedMenu === "wordcloud" ? "selected" : ""
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
            {t("Report frequency")}
          </div>
        </a>
      </div>
    </div>
  );
}

export default withNamespaces()(TopicSideMenus);
