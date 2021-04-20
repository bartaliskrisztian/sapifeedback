import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// importing language resource file
import strings from "../resources/strings";

import "../assets/css/TopicSideMenus.css";

function TopicSideMenus() {
  const params = useParams();
  const topicOptions = strings.topic.menus;
  const [selectedMenu, setSelectedMenu] = useState(0);

  useEffect(() => {
    const temp = window.location.hash.split("/");
    const pageType = temp[temp.length - 1];
    setSelectedMenu(pageType);
    // eslint-disable-next-line
  }, [window.location.hash]);

  return (
    <div className="topic__side-menu">
      <div className="side-menu__title">{strings.appName}</div>
      <div className="side-menu__elements" id="side-menu__elements">
        <a
          className={`side-menu__item ${
            setSelectedMenu === "details" ? "selected" : ""
          }`}
          href={`/#/topic/${params.userId}/${params.topicId}/details`}
        >
          <div className="side-menu__content">
            <div className="side-menu__icon details-icon"></div>
            {topicOptions.details}
          </div>
        </a>
        <a
          className={`side-menu__item ${
            setSelectedMenu === "reports" ? "selected" : ""
          }`}
          href={`/#/topic/${params.userId}/${params.topicId}/reports`}
        >
          <div className="side-menu__content">
            <div className="side-menu__icon report-icon"></div>
            {topicOptions.reports}
          </div>
        </a>
        <a
          className={`side-menu__item ${
            setSelectedMenu === "wordcloud" ? "selected" : ""
          }`}
          href={`/#/topic/${params.userId}/${params.topicId}/wordCloud`}
        >
          <div className="side-menu__content">
            <div className="side-menu__icon wordCloud-icon"></div>
            {topicOptions.wordCloud}
          </div>
        </a>
        <a
          className={`side-menu__item ${
            setSelectedMenu === "freq" ? "selected" : ""
          }`}
          href={`/#/topic/${params.userId}/${params.topicId}/freq`}
        >
          <div className="side-menu__content">
            <div className="side-menu__icon frequency-icon"></div>
            {topicOptions.frequency}
          </div>
        </a>
      </div>
    </div>
  );
}

export default TopicSideMenus;
