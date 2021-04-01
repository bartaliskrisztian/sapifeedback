import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

// importing components
import Modal from "react-modal";
import Reports from "./Reports";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";

import socket from "../socketConfig";

import strings from "../resources/strings"; // importing language resource file

// importing styles
import "../assets/css/Topic.css";
import "react-toastify/dist/ReactToastify.css";
import CancelIcon from "../assets/images/cancel.svg";
import DeleteIcon from "../assets/images/trash.svg";

function Topic({ props, dispatch }) {
  const history = useHistory();
  const params = useParams();

  // for displaying the modal
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [topicExists, setTopicExists] = useState(true);

  // fetching the details of a topic before rendering
  useEffect(() => {
    // getting the url parameters
    const userid = params.userId;
    const topicid = params.topicId;

    if (userid !== undefined && topicid !== undefined) {
      getTopicDetails(userid, topicid);
    } else {
      history.push("/");
    }

    // eslint-disable-next-line
  }, [params, socket]);

  const notifyError = (message) => toast.error(message);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  // getting the details of a topic
  const getTopicDetails = (userGoogleId, topicId) => {
    fetch(
      `${window.location.origin}/${process.env.REACT_APP_RESTAPI_PATH}/topic/${userGoogleId}/${topicId}/details`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.result) {
          dispatch({
            type: "SET_CURRENT_TOPIC_DETAILS",
            payload: res.result,
          });
          getTopicReports(userGoogleId, topicId);
        } else {
          setTopicExists(false);
        }
      })
      .catch((error) => {
        notifyError(error);
        setIsLoading(false);
      });
    // socket.on("getTopicDetails", (res) => {
    //   if (res.result) {
    //     setTopic(res.result);
    //     dispatch({
    //       type: "SET_CURRENT_TOPIC_DETAILS",
    //       payload: res.result,
    //     });
    //     getTopicReports(userGoogleId, topicId);
    //   } else {
    //     setTopicExists(false);
    //   }
    // });
  };

  // getting all reports from a topic
  const getTopicReports = (userGoogleId, topicId) => {
    fetch(
      `${window.location.origin}/${process.env.REACT_APP_RESTAPI_PATH}/topic/${userGoogleId}/${topicId}/reports`
    )
      .then((res) => res.json())
      .then((res) => {
        dispatch({
          type: "SET_CURRENT_TOPIC_REPORTS",
          payload: Object.values(res.result),
        });
        setIsLoading(false);
      })
      .catch((error) => {
        notifyError(error);
        setIsLoading(false);
      });

    // socket.on("getTopicReports", (data) => {
    //   if (data.result !== null) {
    //     dispatch({
    //       type: "SET_CURRENT_TOPIC_REPORTS",
    //       payload: Object.entries(data.result),
    //     });
    //     console.log(data.result);
    //   } else {
    //     dispatch({
    //       type: "SET_CURRENT_TOPIC_REPORTS",
    //       payload: Object.entries([]),
    //     });
    //   }
    // });
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

  const ReportsTable = () => {
    if (props.topicReports.length > 0) {
      return <Reports />;
    } else {
      return <div className="topic__no-reports">{strings.topic.noReports}</div>;
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
      <div className="topic-detail__holder">
        <DeleteTopicModal />
        {!isLoading ? <ReportsTable /> : <div className="topic-loader"></div>}

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

// getting the global state variables with redux
const mapStateToProps = (state) => {
  const props = {
    topicReports: state.currentTopicReports,
  };
  return { props };
};

// getting redux dispatch function for changing global state variables
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Topic);
