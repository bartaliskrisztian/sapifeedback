import React, { useState, useEffect } from "react";

// importing components
import SortedTopicElements from "./SortedTopicElements";
import TopicSort from "./TopicSort";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";

import { apiGetRequest, apiPostRequest } from "../api/utils";
import socket from "../socketConfig";

import { withNamespaces } from "react-i18next";

// importing styles
import "react-toastify/dist/ReactToastify.css";
import "../assets/css/UserTopics.css";
import CancelIcon from "../assets/images/cancel.svg";

function UserTopics({ t, props, dispatch }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [topicSortOption, setTopicSortOption] = useState([
    { label: t("Unsorted"), value: "unsorted" },
  ]);

  // fetching the topics based on the user
  useEffect(() => {
    dispatch({
      type: "SET_CURRENT_TOPIC_ID",
      payload: null,
    });

    if (props.user != null) {
      getUserTopics();
    }
    // eslint-disable-next-line
  }, []);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  // getting all topics from a user
  const getUserTopics = () => {
    apiGetRequest("userTopics", { userGoogleId: props.user.googleId }).catch(
      (err) => {
        setIsLoading(false);
        notifyError(err);
      }
    );

    // websocket listening on change
    socket.on("getUserTopics", (data) => {
      // saving the result in the global state
      if (data) {
        dispatch({
          type: "SET_USER_TOPICS",
          payload: Object.entries(data.result),
        });
      }
    });
    setIsLoading(false);
  };

  const showArchivedTopics = () => {
    dispatch({
      type: "SET_SHOW_ARCHIVED_TOPICS",
      payload: !props.showArchivedTopics,
    });
  };

  // functions for modal
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const onTopicNameChange = (e) => {
    setTopicName(e.target.value);
  };

  const createTopic = () => {
    if (topicName === "") {
      notifyError(t("Enter your topic name"));
      return false;
    }

    let ok = true;
    props.userTopics.forEach((topic) => {
      if (topic[1].topicName === topicName) {
        notifyError(t("You already have a topic with this name."));
        ok = false;
      }
    });

    if (ok) {
      const body = JSON.stringify({
        date: Date.now(),
        topicName: topicName,
        userId: props.user.googleId,
      });
      apiPostRequest("createTopic", body).then(
        (response) => {
          if (response.error === "OK") {
            closeModal();
            notifySuccess(t("Topic created."));
          } else {
            notifyError(response.error);
          }
        },
        (reject) => {
          notifyError(reject);
        }
      );
    }
  };

  const modalStyle = {
    overlay: {
      backgroundColor: props.theme === "dark" ? "#242526" : "#6b6d6f",
    },
  };

  Modal.setAppElement("#root");

  return (
    <div className="topics">
      <Modal
        closeTimeoutMS={500}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={`create-topic__modal ${props.theme}`}
        style={modalStyle}
      >
        <img
          src={CancelIcon}
          alt="cancel"
          className="modal__cancel-icon"
          onClick={closeModal}
        />
        <div className="create-topic__title">{t("Create topic")}</div>
        <input
          className="create-topic__input"
          type="text"
          placeholder={t("Enter your topic name")}
          onChange={onTopicNameChange}
        />
        <button
          className="create-topic__button"
          type="submit"
          onClick={createTopic}
        >
          {t("Create")}
        </button>
      </Modal>
      <div className="topic-sort__container">
        <div className="topic-checkbox__container">
          <input
            type="checkbox"
            value="check"
            className="topic-checkbox"
            onClick={showArchivedTopics}
          />
          <label>{t("Show archived topics")}</label>
        </div>
        <TopicSort
          sortOption={topicSortOption}
          onSortOptionChange={setTopicSortOption}
        />
      </div>
      <div>
        {/* filtering the topics by the searchbar input */}
        {isLoading ? (
          <div className="user-topics__loader"></div>
        ) : (
          <SortedTopicElements
            sortOption={topicSortOption[0].value}
            openModal={openModal}
            closeModal={closeModal}
          />
        )}
      </div>
      <ToastContainer
        position="top-center"
        pauseOnHover={false}
        hideProgressBar={true}
        autoClose={3000}
        closeOnClick={false}
      />
    </div>
  );
}

// getting the global state variables with redux
const mapStateToProps = (state) => {
  const props = {
    theme: state.appTheme,
    user: state.user,
    searchText: state.searchText,
    showArchivedTopics: state.showArchivedTopics,
    userTopics: state.userTopics,
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
)(withNamespaces()(UserTopics));
