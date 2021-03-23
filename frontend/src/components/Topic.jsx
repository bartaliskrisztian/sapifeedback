import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

// importing components
import Modal from "react-modal";
import Reports from "./Reports";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";

import socketIOClient from "socket.io-client";

import stringRes from "../resources/strings"; // importing language resource file

// importing styles
import "../assets/css/Topic.css";
import "react-toastify/dist/ReactToastify.css";
import CancelIcon from "../assets/images/cancel.svg";
import DeleteIcon from "../assets/images/trash.svg";

function Topic({ dispatch }) {
  // string resources
  let language = process.env.REACT_APP_LANGUAGE;
  let strings = stringRes[language];

  const history = useHistory();
  const params = useParams();

  const socket = socketIOClient(
    `${process.env.REACT_APP_SERVER_URL}`,
    { transports: ["websocket"], upgrade: false },
    { "force new connection": true }
  );

  // for displaying the modal
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [topicExists, setTopicExists] = useState(true);

  const [topic, setTopic] = useState({});
  const [topicReports, setTopicReports] = useState([]);

  // fetching the details of a topic before rendering
  useEffect(() => {
    const abortController = new AbortController();

    // getting the url parameters
    const userid = params.userId;
    const topicid = params.topicId;

    if (userid !== undefined && topicid !== undefined) {
      getTopicDetails(userid, topicid);
    } else {
      history.push("/");
    }

    return function cleanup() {
      abortController.abort();
    };
    // eslint-disable-next-line
  }, [params]);

  const notifyError = (message) => toast.error(message);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const getTopicDetails = (userGoogleId, topicId) => {
    fetch(
      `${window.location.origin}/${process.env.REACT_APP_RESTAPI_PATH}/topic/${userGoogleId}/${topicId}/details`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.result) {
          dispatch({
            type: "SET_CURRENT_TOPIC_NAME",
            payload: res.result.topicName,
          });
          setTopic(res.result);
          getTopicReports(userGoogleId, topicId);
        } else {
          setTopicExists(false);
        }
      });
  };

  const getTopicReports = (userGoogleId, topicId) => {
    fetch(
      `${window.location.origin}/${process.env.REACT_APP_RESTAPI_PATH}/topic/${userGoogleId}/${topicId}/reports`
    ).catch((error) => {
      notifyError(error);
      setIsLoading(false);
    });

    socket.on("getTopicReports", (data) => {
      if (data.result !== null) {
        setTopicReports(Object.values(data.result));
      } else {
        setTopicReports([]);
      }
      setIsLoading(false);
    });
  };

  const DeleteTopicModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="delete-topic__modal"
      >
        <img
          src={CancelIcon}
          alt="cancel"
          className="modal__cancel-icon"
          onClick={closeModal}
        />
        <div className="delete-topic__title">
          {strings.topic.deleteModal.title}
        </div>
        <div className="delete-topic__button-holder">
          <button className="delete-topic__button">
            {strings.topic.deleteModal.deleteButtonText}
          </button>
          <button className="delete-topic__button" onClick={closeModal}>
            {strings.topic.deleteModal.cancelButtonText}
          </button>
        </div>
      </Modal>
    );
  };

  const TopicLink = () => {
    return (
      <div>
        <ul>
          <li>
            {strings.topic.reports.reportUrl}:
            <a
              href={topic.reportUrl}
              target="blank"
              className="topic-detail__reportUrl"
            >
              {topic.reportUrl}
            </a>
          </li>
        </ul>
      </div>
    );
  };

  const ReportsTable = () => {
    if (topicReports.length > 0) {
      return <Reports reports={topicReports} />;
    } else {
      return <h1 className="topic__no-reports">{strings.topic.noReports}</h1>;
    }
  };

  const DeleteTopicButton = () => {
    <button type="submit" className="delete-topic__button" onClick={openModal}>
      <img className="trash-icon" alt="trash-icon" src={DeleteIcon} />
      {strings.topic.deleteButtonText}
    </button>;
  };

  if (topicExists) {
    return (
      <div className="topic-detail">
        <DeleteTopicModal />
        {/* eslint eqeqeq: 0 */ <TopicLink />}
        {!isLoading && <ReportsTable />}
        {isLoading && <div className="topic-loader"></div>}
        <ToastContainer
          position="top-center"
          pauseOnHover={false}
          hideProgressBar={true}
          autoClose={3000}
          closeOnClick={false}
        />
      </div>
    );
  } else {
    return (
      <div className="topic-detail">
        <h1 className="topic-detail__notexists">
          {strings.topic.notExistsText}
        </h1>
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
}

// getting redux dispatch function for changing global state variables
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapDispatchToProps)(Topic);
