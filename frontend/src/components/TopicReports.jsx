import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

// importing components
import ReportsTable from "./ReportsTable";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";

import strings from "../resources/strings"; // importing language resource file

// importing styles
import "../assets/css/TopicReports.css";
import "react-toastify/dist/ReactToastify.css";

function TopicReports({ props, dispatch }) {
  const params = useParams();

  // fetching the details of a topic before rendering
  useEffect(() => {
    if (!props.topicReports) {
      notifyError("Error");
    }
    // eslint-disable-next-line
  }, [params]);

  const notifyError = (message) => toast.error(message);

  const TopicReportsTable = () => {
    if (props.topicReports.length > 0) {
      return <ReportsTable />;
    } else {
      return <div className="topic__no-reports">{strings.topic.noReports}</div>;
    }
  };

  return (
    <div className="topic-reports__holder">
      <TopicReportsTable />
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

export default connect(mapStateToProps, mapDispatchToProps)(TopicReports);
