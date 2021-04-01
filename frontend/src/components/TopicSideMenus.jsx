import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

// importing language resource file
import stringRes from "../resources/strings";

import "../assets/css/TopicSideMenus.css";

function TopicSideMenus() {
  let language = process.env.REACT_APP_LANGUAGE;
  let strings = stringRes[language];
  const params = useParams();
  const topicOptions = strings.topic.menus;

  useEffect(() => {
    const temp = window.location.hash.split("/");
    const pageType = temp[temp.length - 1];
    changeMenuColor(pageType);
    // eslint-disable-next-line
  }, [window.location.hash]);

  // based on the page type, we change the background of the option buttons
  const changeMenuColor = (topicPage) => {
    let temp = document.getElementById("side-menu__elements");
    if (!temp) {
      return;
    }
    let elements = Array.from(temp.children);
    elements.forEach((element) => {
      if (element.id === topicPage) {
        element.style.background = "#3a3b3c";
      }
    });
  };

  return (
    <div className="topic__side-menu">
      <div className="side-menu__title">Feedback</div>
      <div className="side-menu__elements" id="side-menu__elements">
        <a
          className="side-menu__item"
          id="reports"
          href={`/#/topic/${params.userId}/${params.topicId}/reports`}
        >
          <div className="side-menu__content">
            <div className="side-menu__icon report-icon"></div>
            {topicOptions.reports}
          </div>
        </a>
        <a
          className="side-menu__item"
          id="wordCloud"
          href={`/#/topic/${params.userId}/${params.topicId}/wordCloud`}
        >
          <div className="side-menu__content">
            <div className="side-menu__icon wordCloud-icon"></div>
            {topicOptions.wordCloud}
          </div>
        </a>
      </div>
    </div>
  );
}

export default TopicSideMenus;