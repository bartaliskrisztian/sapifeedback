import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { apiGetRequest } from "../api/utils";

import { withNamespaces } from "react-i18next";

// importing styles
import AddIcon from "../assets/images/plus.svg";

function TopicElement({ t, props, dispatch }) {
  let history = useHistory();
  const [showMoreDropdown, _setShowMoreDropdown] = useState(false);
  const showMoreDropdownRef = useRef(showMoreDropdown);
  const setShowMoreDropdown = (data) => {
    showMoreDropdownRef.current = data;
    _setShowMoreDropdown(data);
  };
  const moreDropdownRef = useRef();

  // fetching the topics based on the user
  useEffect(() => {
    window.addEventListener("click", handleClick);
    // cleanup this component
    return () => {
      window.removeEventListener("click", handleClick);
    };
    // eslint-disable-next-line
  }, []);

  const handleClick = (e) => {
    if (
      !moreDropdownRef.current?.contains(e.target) &&
      e.target.className !== "topic__more-icon"
    ) {
      setShowMoreDropdown(false);
    }
  };

  const onTopicClicked = () => {
    // save the topic's name in the global state
    dispatch({
      type: "SET_CURRENT_TOPIC_NAME",
      payload: props.name,
    });
    history.push(`/topic/${props.topicid}/details`);
  };

  // archive topic
  const archiveTopic = () => {
    apiGetRequest("archiveTopic", {
      topicId: props.topicid,
      userGoogleId: props.userid,
    }).then(
      (response) => {
        if (response.error === "OK") {
          props.onArchive(t("Topic archived successfully."));
          setShowMoreDropdown(false);
        } else {
          props.notifyError(response.error);
          setShowMoreDropdown(false);
        }
      },
      (reject) => {
        props.notifyError(reject);
      }
    );
  };

  // remove topic from the archived topics
  const activateTopic = () => {
    apiGetRequest("activateTopic", {
      topicId: props.topicid,
      userGoogleId: props.userid,
    }).then(
      (response) => {
        if (response.error === "OK") {
          props.onArchive(t("Archiving cancelled."));
          setShowMoreDropdown(false);
        } else {
          props.notifyError(response.error);
          setShowMoreDropdown(false);
        }
      },
      (reject) => {
        props.notifyError(reject);
      }
    );
  };

  const copyToClipboard = (text) => {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(text);
    } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = text;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
        // here the magic happens
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
      });
    }
  };

  // copy topic's url to clipboard
  const copyUrlToClipboard = () => {
    getTopicUrl();
    setShowMoreDropdown(false);
    props.onCopyToClipboard(t("Link copied to clipboard."));
  };

  const copyTopicIdToClipboard = () => {
    copyToClipboard(props.topicid);
    setShowMoreDropdown(false);
    props.onCopyToClipboard(t("Topic ID copied to clipboard."));
  };

  // getting the topic's url
  const getTopicUrl = () => {
    apiGetRequest("topicUrl", {
      topicId: props.topicid,
      userGoogleId: props.userid,
    }).then(
      (response) => {
        const endpoint = response.result;
        const url = `${window.location.href}${endpoint}`;
        copyToClipboard(url);
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
        <div className="topic-add__title">{t("Create topic")}</div>
      </div>
    );
  };

  const TopicCard = () => {
    return (
      <div className="topic-element__content" ref={moreDropdownRef}>
        <img
          alt="more"
          className="topic__more-icon"
          onClick={() => setShowMoreDropdown(!showMoreDropdown)}
        />
        {!props.isArchived && (
          <div
            className={`topic-element__dropdown${
              showMoreDropdown ? " open" : ""
            }`}
          >
            <div className="more-dropdown__element" onClick={archiveTopic}>
              {t("Archive")}
            </div>
            <div
              className="more-dropdown__element"
              onClick={copyUrlToClipboard}
            >
              {t("Copy link")}
            </div>
            <div
              className="more-dropdown__element"
              onClick={copyTopicIdToClipboard}
            >
              {t("Copy topic ID")}
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
              {t("Cancel archiving")}
            </div>
          </div>
        )}

        <div
          className="topic-element__content-elements"
          onClick={onTopicClicked}
        >
          <div className="topic-element__name">{props.name}</div>
          {props.isArchived && (
            <div className="topic-element__archived">{t("Archived")}</div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(TopicElement));
