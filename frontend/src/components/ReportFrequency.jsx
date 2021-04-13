import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import strings from "../resources/strings"; // importing language resource file
import { apiPostRequest } from "../api/utils";

import "../assets/css/ReportFrequency.css";
import "react-toastify/dist/ReactToastify.css";

function ReportFrequency({ props }) {
  const [noReportsText, setNoReportsText] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSource, setImageSource] = useState("");

  // fetching the details of a topic before rendering
  useEffect(() => {
    createReportFrequency(props.reports);
    // eslint-disable-next-line
  }, []);

  const createReportFrequency = (reports) => {
    const dates = reports.map((report) => report.date);

    if (!dates.length) {
      setNoReportsText(strings.topic.noReports);
      setImageLoaded(true);
      return;
    }
    apiPostRequest(
      null,
      null,
      JSON.stringify({
        dates: dates,
      }),
      "reportFrequency"
    ).then(
      (response) => {
        let data = response.result.slice(2);
        data = data.slice(0, -1);
        const src = `data:image/jpg;base64,${data}`;
        setImageSource(src);
        setImageLoaded(true);
      },
      (reject) => {
        notifyError(reject);
      }
    );
  };

  const notifyError = (message) => toast.error(message);

  const FrequencyFigure = () => (
    <img alt="frequency" src={imageSource} className="report-freq__image"></img>
  );

  return (
    <div className="report-freq">
      <div className="report-freq__no-reports">{noReportsText}</div>
      {!imageLoaded && (
        <div>
          <div className="freq-loader"></div>
        </div>
      )}
      {imageLoaded && !noReportsText && <FrequencyFigure />}
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
    reports: state.currentTopicReports,
    topic: state.currentTopicDetails,
  };
  return { props };
};

export default connect(mapStateToProps)(ReportFrequency);
