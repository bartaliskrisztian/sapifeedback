import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import { connect } from "react-redux";
import socket from "../socketConfig";
import { apiGetRequest } from "../api/utils";
import { withNamespaces } from "react-i18next";
import { storage } from "../firebase/Firebase";

import "../assets/css/TopicDetails.css";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "../assets/images/trash.svg";

function TopicDetails({ t, props, dispatch }) {
  const history = useHistory();
  const params = useParams();

  // for displaying the modal
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [topicDate, setTopicDate] = useState("");
  const [topicId, setTopicId] = useState("");

  // fetching the details of a topic before rendering
  useEffect(() => {
    // getting the url parameters
    const topicid = params.topicId;
    setTopicId(topicid);

    if (topicid !== undefined) {
      getTopic(topicid);
      getFeedbacks(topicid);
      const date = new Date(props.topic.date).toLocaleDateString();
      setTopicDate(date);
      setIsLoading(false);
    } else {
      history.push("/404");
    }

    // eslint-disable-next-line
  }, []);

  const notifyError = (message) => toast.error(message);
  const notifyInfo = (message) => toast.info(message);

  const getTopic = (topicid) => {
    apiGetRequest("topicDetails", { topicId: topicid }).then(
      (response) => {
        if (response.result === null) {
          history.push("/404");
        } else {
          if (response.result) {
            dispatch({
              type: "SET_CURRENT_TOPIC_DETAILS",
              payload: response.result,
            });
            const date = new Date(response.result.date).toLocaleDateString();
            setTopicDate(date);
          }
        }
      },
      (reject) => {
        notifyError(reject);
        setIsLoading(false);
      }
    );

    // websocket listening on change
    socket.on("getTopicDetails", (data) => {
      // saving the result in the global state
      if (data) {
        if (data === null) {
          history.push("/404");
        } else {
          if (data.result) {
            dispatch({
              type: "SET_CURRENT_TOPIC_DETAILS",
              payload: data.result,
            });
            const date = new Date(data.result.date).toLocaleDateString();
            setTopicDate(date);
          }
        }
      }
    });
  };

  const getFeedbacks = (topicid) => {
    apiGetRequest("topicFeedbacks", { topicId: topicid }).then(
      (response) => {
        if (response.result) {
          dispatch({
            type: "SET_CURRENT_TOPIC_FEEDBACKS",
            payload: Object.values(response.result).sort((a, b) => {
              return a.date < b.date ? -1 : b.date < a.date ? 1 : 0;
            }),
          });
        } else {
          dispatch({
            type: "SET_CURRENT_TOPIC_FEEDBACKS",
            payload: [],
          });
        }
        setIsLoading(false);
      },
      (reject) => {
        notifyError(reject);
        setIsLoading(false);
      }
    );

    // websocket listening on change
    socket.on("getTopicFeedbacks", (data) => {
      // saving the result in the global state
      if (data.result) {
        dispatch({
          type: "SET_CURRENT_TOPIC_FEEDBACKS",
          payload: Object.values(data.result)
            .sort((a, b) => {
              return a.date < b.date ? -1 : b.date < a.date ? 1 : 0;
            })
            .reverse(),
        });
      } else {
        dispatch({
          type: "SET_CURRENT_TOPIC_FEEDBACKS",
          payload: [],
        });
      }
    });
  };

  const TopicLink = () => {
    return (
      <div className="topic-link__holder">
        {t("Link for giving feedback")}:
        <a
          href={`${window.location.origin}/#/${props.topic.feedbackUrl}`}
          target="blank"
          className="topic-detail__feedbackUrl"
        >
          {`${window.location.origin}/#/${props.topic.feedbackUrl}`}
        </a>
        <div
          className="topic-detail__copy-icon"
          onClick={copyUrlToClipboard}
        ></div>
      </div>
    );
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const DeleteTopicModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={`delete-topic__modal ${props.theme}`}
      >
        <div className="delete-topic__title">
          {`${t("Are you sure you want to delete this topic?")}: ${
            props.topic.topicName
          }? `}
        </div>
        <div className="delete-topic__button-holder">
          <button className="delete-topic__button delete" onClick={deleteTopic}>
            {t("Delete")}
          </button>
          <button className="delete-topic__button cancel" onClick={closeModal}>
            {t("Cancel")}
          </button>
        </div>
      </Modal>
    );
  };

  const DeleteTopicButton = () => {
    return (
      <button
        type="submit"
        className="delete-topic__button delete main"
        onClick={openModal}
      >
        <img className="trash-icon" alt="trash-icon" src={DeleteIcon} />
        {t("Delete topic")}
      </button>
    );
  };

  const deleteTopic = () => {
    props.feedbacks.forEach((feedback) => {
      if (feedback.imageUrl) {
        const imageRef = storage.refFromURL(feedback.imageUrl);
        imageRef.delete();
      }
    });
    apiGetRequest("deleteTopic", {
      userGoogleId: props.user.googleId,
      topicId: topicId,
    }).then(
      (response) => {
        if (response.result === "OK") {
          history.push("/");
        } else {
          notifyError(response.result);
        }
      },
      (reject) => {
        notifyError(reject);
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
    const url = `${window.location.origin}/#/${props.topic.feedbackUrl}`;
    copyToClipboard(url);
    notifyInfo(t("Link copied to clipboard."));
  };

  const copyTopicIdToClipboard = () => {
    copyToClipboard(topicId);
    notifyInfo(t("Topic ID copied to clipboard."));
  };

  return (
    <div className="topic-details__holder">
      <DeleteTopicModal />
      {isLoading && <div className="topic-loader"></div>}
      {!isLoading && props.topic && (
        <div className="topic-details">
          <div>
            {`${t("Topic name")}: `}
            <label className="topic-details__label">
              {props.topic.topicName}
            </label>
          </div>
          <div>
            {`${t("Number of feedbacks")} `}
            <label className="topic-details__label">
              {props.topic.uploadedFeedbacks
                ? props.topic.uploadedFeedbacks
                : "0"}
            </label>
          </div>
          {props.topic && !props.topic.isArchived && <TopicLink />}
          {props.topic && !props.topic.isArchived && (
            <div className="topic-details__name-holder">
              {`${t("Topic ID")}: `}
              <label className="topic-details__label">{topicId}</label>
              <div
                className="topic-detail__copy-icon"
                onClick={copyTopicIdToClipboard}
              ></div>
            </div>
          )}
          <div>
            {`${t("Created at")} `}
            <label className="topic-details__label">{topicDate}</label>
          </div>
          <DeleteTopicButton />
        </div>
      )}
      <ToastContainer
        position="top-center"
        pauseOnHover={false}
        hideProgressBar={true}
        autoClose={1500}
        closeOnClick={false}
        limit={1}
      />
    </div>
  );
}

// getting the global state variables with redux
const mapStateToProps = (state) => {
  const props = {
    topic: state.currentTopicDetails,
    theme: state.appTheme,
    user: state.user,
    feedbacks: state.currentTopicFeedbacks,
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
)(withNamespaces()(TopicDetails));
