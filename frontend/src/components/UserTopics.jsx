import React, { useState, useEffect, useRef } from "react";

// importing components
import { useHistory } from "react-router-dom";
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
  const history = useHistory();

  const [modalIsOpen, _setIsOpen] = useState(false);
  const modalIsOpenRef = useRef(modalIsOpen);
  const setIsOpen = (data) => {
    modalIsOpenRef.current = data;
    _setIsOpen(data);
  };

  const [topicName, _setTopicName] = useState("");
  const topicNameRef = useRef(topicName);
  const setTopicName = (data) => {
    topicNameRef.current = data;
    _setTopicName(data);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [topicSortOption, setTopicSortOption] = useState([
    { label: t("By date descending"), value: "date-desc" },
  ]);

  // fetching the topics based on the user
  useEffect(() => {
    if (props.user != null) {
      getUserTopics();
    } else {
      history.push("/login");
    }

    dispatch({
      type: "SET_CURRENT_TOPIC_ID",
      payload: null,
    });

    window.addEventListener("keydown", handleEnterPressed);
    // cleanup this component
    return () => {
      window.removeEventListener("keydown", handleEnterPressed);
    };
    // eslint-disable-next-line
  }, []);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleEnterPressed = (e) => {
    let key = e.keyCode || e.which;
    if (key === 13 && modalIsOpenRef.current) {
      createTopic();
    }
  };

  // getting all topics from a user
  const getUserTopics = () => {
    apiGetRequest("userTopics", { userGoogleId: props.user.googleId })
      .then(
        (data) => {
          if (data) {
            dispatch({
              type: "SET_USER_TOPICS",
              payload: Object.entries(data.result),
            });
            console.log("ut");
            setIsLoading(false);
          }
        },
        (reject) => {
          setIsLoading(false);
          notifyError(reject);
        }
      )
      .catch((err) => {
        setIsLoading(false);
        notifyError(err);
      });

    // websocket listening on change
    socket.on("getUserTopics", (data) => {
      // saving the result in the global state
      if (data) {
        dispatch({
          type: "SET_USER_TOPICS",
          payload: Object.entries(data.result),
        });
        console.log("socket");
      }
      setIsLoading(false);
    });
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
    setTopicName("");
  }

  const onTopicNameChange = (e) => {
    setTopicName(e.target.value);
  };

  const createTopic = () => {
    if (topicNameRef.current === "") {
      notifyError(t("Enter your topic name"));
      return false;
    }

    let ok = true;
    props.userTopics.forEach((topic) => {
      if (topic[1].topicName === topicNameRef.current) {
        notifyError(t("You already have a topic with this name."));
        ok = false;
      }
    });

    if (ok) {
      const body = JSON.stringify({
        date: Date.now(),
        topicName: topicNameRef.current,
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

  Modal.setAppElement("#root");

  return (
    <div className="topics">
      <Modal
        closeTimeoutMS={500}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={`create-topic__modal ${props.theme}`}
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
          />
        )}
      </div>
      <ToastContainer
        position="top-center"
        pauseOnHover={false}
        hideProgressBar={true}
        autoClose={3000}
        closeOnClick={false}
        limit={1}
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
