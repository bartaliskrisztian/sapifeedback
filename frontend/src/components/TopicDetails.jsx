import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import { connect } from "react-redux";

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
      dispatch({
        type: "SET_CURRENT_TOPIC_ID",
        payload: topicid,
      });
      getTopic(topicid);
      getReports(topicid);
      const date = new Date(props.topic.date).toLocaleDateString();
      setTopicDate(date);
      setIsLoading(false);
    } else {
      history.push("/404");
    }

    // eslint-disable-next-line
  }, [params]);

  const notifyError = (message) => toast.error(message);

  const getTopic = (topicid) => {
    apiGetRequest("topicDetails", { topicId: topicid }).then(
      (response) => {
        if (response.result === null) {
          history.push("/404");
        } else {
          dispatch({
            type: "SET_CURRENT_TOPIC_DETAILS",
            payload: response.result,
          });
          const date = new Date(response.result.date).toLocaleDateString();
          setTopicDate(date);
        }
      },
      (reject) => {
        notifyError(reject);
        setIsLoading(false);
      }
    );
  };

  const getReports = (topicid) => {
    apiGetRequest("topicReports", { topicId: topicid }).then(
      (response) => {
        if (response.result) {
          dispatch({
            type: "SET_CURRENT_TOPIC_REPORTS",
            payload: Object.values(response.result),
          });
        } else {
          dispatch({
            type: "SET_CURRENT_TOPIC_REPORTS",
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
  };

  const TopicLink = () => {
    return (
      <div>
        {t("Link for reporting")}:
        <a
          href={`${window.location.origin}/#/${props.topic.reportUrl}`}
          target="blank"
          className="topic-detail__reportUrl"
        >
          {`${window.location.origin}/#/${props.topic.reportUrl}`}
        </a>
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
        className="delete-topic__button delete"
        onClick={openModal}
      >
        <img className="trash-icon" alt="trash-icon" src={DeleteIcon} />
        {t("Delete")}
      </button>
    );
  };

  const deleteTopic = () => {
    props.reports.forEach((report) => {
      const imageRef = storage.refFromURL(report.imageUrl);
      imageRef.delete();
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

  return (
    <div className="topic-details__holder">
      <DeleteTopicModal />
      {isLoading && <div className="topic-loader"></div>}
      {!isLoading && (
        <div className="topic-details">
          <div>
            {`${t("Created at")} `}
            <label className="topic-details__label">{topicDate}</label>
          </div>
          <div>
            {`${t("Number of feedbacks")} `}
            <label className="topic-details__label">
              {props.topic.reportsUploaded ? props.topic.reportsUploaded : "0"}
            </label>
          </div>
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
        limit={1}
      />
    </div>
  );
}

// getting the global state variables with redux
const mapStateToProps = (state) => {
  const props = {
    topic: state.currentTopicDetails,
    topicId: state.currentTopicId,
    theme: state.appTheme,
    user: state.user,
    reports: state.currentTopicReports,
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
