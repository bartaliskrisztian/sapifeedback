import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// importing components
import ReportsTable from "./ReportsTable";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";

import { apiGetRequest } from "../api/utils";
import socket from "../socketConfig";

import strings from "../resources/strings"; // importing language resource file

// importing styles
import "../assets/css/TopicReports.css";
import "react-toastify/dist/ReactToastify.css";

function TopicReports({ props, dispatch }) {
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);

  // fetching the details of a topic before rendering
  useEffect(() => {
    // getting the url parameters
    const userid = params.userId;
    const topicid = params.topicId;

    if (userid !== undefined && topicid !== undefined) {
      getReports(userid, topicid);
    } else {
      notifyError("Url is not valid.");
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

  const getReports = (userid, topicid) => {
    apiGetRequest(userid, topicid, "topicReports").then(
      (response) => {
        console.log(response);
        dispatch({
          type: "SET_CURRENT_TOPIC_REPORTS",
          payload: Object.values(response.result),
        });
        setIsLoading(false);
      },
      (reject) => {
        notifyError(reject);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="topic-reports__holder">
      {!isLoading ? (
        <TopicReportsTable />
      ) : (
        <div className="reports-loader"></div>
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
