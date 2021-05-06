import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import { BarChart } from "reaviz";
import { withNamespaces } from "react-i18next";
import { apiPostRequest } from "../api/utils";

import "../assets/css/ReportFrequency.css";
import "react-toastify/dist/ReactToastify.css";

function ReportFrequency({ t, props }) {
  const [noReportsText, setNoReportsText] = useState("");
  const [data, setData] = useState([]);

  // const [imageLoaded, setImageLoaded] = useState(false);
  // const [imageSource, setImageSource] = useState("");

  // fetching the details of a topic before rendering
  useEffect(() => {
    if (!props.reports.length) {
      setNoReportsText(t("There are no reports yet."));
      return;
    }

    const dataTemp = [];
    const dates = props.reports.map((report) => report.date);

    let frequency = {};
    for (let i = 0; i < dates.length; i++) {
      const element = dates[i];
      frequency[element] = frequency[element] ? frequency[element] + 1 : 1;
    }

    Object.keys(frequency).forEach((key1) => {
      const d = new Date(key1);
      const datestring = `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
      const newElement = {
        key: new Date(datestring),
        data: frequency[key1],
      };
      dataTemp.push(newElement);
    });

    dataTemp.sort((a, b) => a.key.valueOf() - b.key.valueOf());
    setData(dataTemp);
    // eslint-disable-next-line
  }, []);

  // const createReportFrequency = (reports) => {
  //   const dates = reports.map((report) => report.date);
  //   if (!dates.length) {
  //     setNoReportsText(t("There are no reports yet."));
  //     setImageLoaded(true);
  //     return;
  //   }
  //   apiPostRequest(
  //     "reportFrequency",
  //     JSON.stringify({
  //       dates: dates,
  //     })
  //   ).then(
  //     (response) => {
  //       let data = response.result.slice(2);
  //       data = data.slice(0, -1);
  //       const src = `data:image/jpg;base64,${data}`;
  //       setImageSource(src);
  //       setImageLoaded(true);
  //     },
  //     (reject) => {
  //       notifyError(reject);
  //     }
  //   );
  // };

  // const FrequencyFigure = () => (
  //   <img alt="frequency" src={imageSource} className="report-freq__image"></img>
  // );

  const notifyError = (message) => toast.error(message);

  const FrequencyChart = () => (
    <div className="frequency-chart__holder">
      <BarChart
        height={300}
        width={500}
        data={data}
        className="frequency-chart"
        gridlines={false}
      />
    </div>
  );

  return (
    <div className="report-freq">
      <div className="report-freq__no-reports">{noReportsText}</div>
      {/* {!imageLoaded && (
        <div>
          <div className="freq-loader"></div>
        </div>
      )}
      {imageLoaded && !noReportsText && <FrequencyFigure />} */}
      {!noReportsText && <FrequencyChart />}
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

export default connect(mapStateToProps)(withNamespaces()(ReportFrequency));
