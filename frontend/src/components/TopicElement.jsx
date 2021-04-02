import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { apiGetRequest } from "../api/utils";

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
    history.push(`/topic/${props.userid}/${props.topicid}/details`);
  };

  // archive topic
  const archiveTopic = () => {
    apiGetRequest(props.userid, props.topicid, "archiveTopic").then(
      (response) => {
        if (response.error === "OK") {
          props.onArchive(strings.userTopics.notification.onArchive);
          setShowMoreDropwdown(false);
        } else {
          props.notifyError(response.error);
          setShowMoreDropwdown(false);
        }
      },
      (reject) => {
        props.notifyError(reject);
      }
    );
  };

  // remove topic from the archived topics
  const activateTopic = () => {
    apiGetRequest(props.userid, props.topicid, "activateTopic").then(
      (response) => {
        if (response.error === "OK") {
          props.onArchive(strings.userTopics.notification.onActivate);
          setShowMoreDropwdown(false);
        } else {
          props.notifyError(response.error);
          setShowMoreDropwdown(false);
        }
      },
      (reject) => {
        props.notifyError(reject);
      }
    );
  };

  // copy topic's url to clipboard
  const copyUrlToClipboard = () => {
    getTopicUrl();
    setShowMoreDropwdown(false);
    props.onCopyToClipboard(strings.userTopics.notification.onCopyToClipboard);
  };

  // getting the topic's url
  const getTopicUrl = () => {
    apiGetRequest(props.userid, props.topicid, "topicUrl").then(
      (response) => {
        navigator.clipboard.writeText(response.result);
        return response.result;
      },
      (reject) => {
        props.notifyError(reject);
      }
    );
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
