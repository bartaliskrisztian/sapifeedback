import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import strings from "../resources/strings"; // importing language resource file

// importing styles
import AddIcon from "../assets/images/plus.svg";
import MoreIcon from "../assets/images/more.svg";

function TopicElement({ props, dispatch }) {
  let history = useHistory();
  const [showMoreDropdown, setShowMoreDropwdown] = useState(false);

  const onTopicClicked = () => {
    // save the topic's name in the global state
    dispatch({
      type: "SET_CURRENT_TOPIC_NAME",
      payload: props.name,
    });
    history.push(`/topic/${props.userid}/${props.topicid}/reports`);
  };

  // archive topic
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

  // remove topic from the archived topics
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

  // copy topic's url to clipboard
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

  // getting the topic's url
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

// getting the global state variables with redux
const mapStateToProps = (state, ownProps) => {
  const props = {
    name: ownProps.name,
    type: ownProps.type,
    date: ownProps.date,
    isArchived: ownProps.isArchived,
    onClick: ownProps.onClick,
    topicid: ownProps.topicid,
    userid: ownProps.userid,
    onArchive: ownProps.onArchive,
    onError: ownProps.onError,
    onCopyToClipboard: ownProps.onCopyToClipboard,
  };
  return { props };
};

// getting redux dispatch function for changing global state variables
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicElement);
