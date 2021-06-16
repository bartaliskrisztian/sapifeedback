import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

// importing components
import FeedbackTable from "./FeedbackTable";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";

import { withNamespaces } from "react-i18next";

// importing styles
import "../assets/css/TopicFeedbacks.css";
import "react-toastify/dist/ReactToastify.css";

function TopicFeedbacks({ t, props }) {
  const params = useParams();

  // fetching the details of a topic before rendering
  useEffect(() => {
    if (!props.topicFeedbacks) {
      notifyError("Error");
    }
    // eslint-disable-next-line
  }, [params]);

  const notifyError = (message) => toast.error(message);

  const TopicFeedbacksTable = () => {
    if (props.topicFeedbacks.length > 0) {
      return <FeedbackTable />;
    } else {
      return (
        <div className="topic__no-feedbacks">
          {t("There are no feedbacks yet.")}
        </div>
      );
    }
  };

  return (
    <div className="topic-feedbacks__holder">
      <TopicFeedbacksTable />
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
    topicFeedbacks: state.currentTopicFeedbacks,
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
)(withNamespaces()(TopicFeedbacks));
