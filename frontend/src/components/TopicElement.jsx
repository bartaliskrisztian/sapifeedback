import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import stringRes from "../resources/strings"; // importing language resource file

// importing styles
import AddIcon from "../assets/images/plus.svg";
import MoreIcon from "../assets/images/more.svg";

function TopicElement(props) {
  let history = useHistory();
  let language = process.env.REACT_APP_LANGUAGE;
  let strings = stringRes[language];
  const [showMoreDropdown, setShowMoreDropwdown] = useState(false);

  const onTopicClicked = () => {
    history.push(`/topic/${props.userid}/${props.topicid}/reports`);
  };

  const archiveTopic = () => {
    fetch(
      `${window.location.origin}/${process.env.REACT_APP_RESTAPI_PATH}/userTopics/archiveTopic/${props.userid}/${props.topicid}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error === "OK") {
          props.onArchive(strings.userTopics.notification.onArchive);
          setShowMoreDropwdown(false);
        } else {
          props.onError(res.error);
          setShowMoreDropwdown(false);
        }
      })
      .catch((e) => props.onError(e));
  };

  const activateTopic = () => {
    fetch(
      `${window.location.origin}/${process.env.REACT_APP_RESTAPI_PATH}/userTopics/activateTopic/${props.userid}/${props.topicid}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error === "OK") {
          props.onArchive(strings.userTopics.notification.onActivate);
          setShowMoreDropwdown(false);
        } else {
          props.onError(res.error);
          setShowMoreDropwdown(false);
        }
      })
      .catch((e) => props.notifyError(e));
  };

  const copyUrlToClipboard = () => {
    let topicUrl = getTopicUrl();
    var textarea = document.createElement("textarea");

    document.body.appendChild(textarea);
    textarea.value = topicUrl;
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    setShowMoreDropwdown(false);
    props.onCopyToClipboard(strings.userTopics.notification.onCopyToClipboard);
  };

  const getTopicUrl = () => {
    fetch(
      `${window.location.origin}/${process.env.REACT_APP_RESTAPI_PATH}/userTopics/getTopicUrl/${props.userid}/${props.topicid}`
    )
      .then((res) => res.json())
      .then((res) => {
        return res.result;
      })
      .catch((e) => props.notifyError(e));
  };

  const AddTopicCard = () => {
    return (
      <div className="topic-add" onClick={props.onClick}>
        <img src={AddIcon} alt="add topic" className="add-icon" />
        <div>{strings.userTopics.createTopicText}</div>
      </div>
    );
  };

  const TopicCard = () => {
    return (
      <div className="topic-element__content">
        <img
          src={MoreIcon}
          alt="more"
          className="topic__more-icon"
          onClick={() => setShowMoreDropwdown(!showMoreDropdown)}
        />
        {!props.isArchived && (
          <div
            className={`topic-element__dropdown${
              showMoreDropdown ? " open" : ""
            }`}
          >
            <div className="more-dropdown__element" onClick={archiveTopic}>
              {strings.userTopics.menu.archive}
            </div>
            <div
              className="more-dropdown__element"
              onClick={copyUrlToClipboard}
            >
              {strings.userTopics.menu.copyLink}
            </div>
          </div>
        )}
        {props.isArchived && (
          <div
            className={`topic-element__dropdown${
              showMoreDropdown ? " open" : ""
            }`}
          >
            <div className="more-dropdown__element" onClick={activateTopic}>
              {strings.userTopics.menu.toActive}
            </div>
          </div>
        )}

        <div
          className="topic-element__content-elements"
          onClick={onTopicClicked}
        >
          <div className="topic-element__name">{props.name}</div>
          {props.isArchived && (
            <div className="topic-element__archived">
              {strings.userTopics.archived}
            </div>
          )}
          <div className="topic-element__date">{props.date}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="topic-element">
      {props.type === "add" && <AddTopicCard />}
      {props.type === "topic" && <TopicCard />}
    </div>
  );
}

export default TopicElement;
