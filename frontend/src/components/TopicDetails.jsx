import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import { connect } from "react-redux";

import { apiGetRequest } from "../api/utils";
import strings from "../resources/strings"; // importing language resource file

import "../assets/css/TopicDetails.css";
import "react-toastify/dist/ReactToastify.css";
import CancelIcon from "../assets/images/cancel.svg";
import DeleteIcon from "../assets/images/trash.svg";

function TopicDetails({ props, dispatch }) {
  const history = useHistory();
  const params = useParams();

  // for displaying the modal
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // fetching the details of a topic before rendering
  useEffect(() => {
    // getting the url parameters
    const userid = params.userId;
    const topicid = params.topicId;

    if (userid !== undefined && topicid !== undefined) {
      getTopic(userid, topicid);
    } else {
      history.push("/");
    }

    // eslint-disable-next-line
  }, [params]);

  const notifyError = (message) => toast.error(message);

  const getTopic = (userid, topicid) => {
    apiGetRequest(userid, topicid, "topicDetails").then(
      (response) => {
        dispatch({
          type: "SET_CURRENT_TOPIC_DETAILS",
          payload: response.result,
        });
        setIsLoading(false);
      },
      (reject) => {
        notifyError(reject);
        setIsLoading(false);
      }
    );
  };

  const TopicLink = () => {
    return (
      <div>
        <ul>
          <li>
            {strings.topic.reports.reportUrl}:
            <a
              href={props.topic.reportUrl}
              target="blank"
              className="topic-detail__reportUrl"
            >
              {props.topic.reportUrl}
            </a>
          </li>
        </ul>
      </div>
    );
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const modalStyle = {
    overlay: {
      backgroundColor: "#3a3b3c",
    },
  };

  const DeleteTopicModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="delete-topic__modal"
        style={modalStyle}
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
          <button className="delete-topic__button delete">
            {strings.topic.deleteModal.deleteButtonText}
          </button>
          <button className="delete-topic__button cancel" onClick={closeModal}>
            {strings.topic.deleteModal.cancelButtonText}
          </button>
        </div>
      </Modal>
    );
  };

  const DeleteTopicButton = () => {
    return (
      <button
        type="submit"
        className="delete-topic__button delete"
        onClick={openModal}
      >
        <img className="trash-icon" alt="trash-icon" src={DeleteIcon} />
        {strings.topic.deleteButtonText}
      </button>
    );
  };

  return (
    <div className="topic-details__holder">
      <DeleteTopicModal />
      {isLoading && <div className="topic-loader"></div>}
      {!isLoading && (
        <div className="topic-details">
          <TopicLink />
          <DeleteTopicButton />
        </div>
      )}
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
    topic: state.currentTopicDetails,
  };
  return { props };
};

// getting redux dispatch function for changing global state variables
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicDetails);
