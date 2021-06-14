import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";

import { BarChart } from "reaviz";
import { withNamespaces } from "react-i18next";
//import { apiPostRequest } from "../api/utils";

import "../assets/css/FeedbackFrequency.css";
import "react-toastify/dist/ReactToastify.css";

function FeedbackFrequency({ t, props }) {
  const [noFeedbacksText, setNoFeedbacksText] = useState("");
  const [data, setData] = useState([]);

  // const [imageLoaded, setImageLoaded] = useState(false);
  // const [imageSource, setImageSource] = useState("");

  // fetching the details of a topic before rendering
  useEffect(() => {
    if (!props.feedbacks.length) {
      setNoFeedbacksText(t("There are no feedbacks yet."));
      return;
    }

    const dataTemp = [];
    const dates = props.feedbacks.map((feedback) => feedback.date);

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

  // const createFeedbackFrequency = (feedbacks) => {
  //   const dates = feedbacks.map((feedback) => feedback.date);
  //   if (!dates.length) {
  //     setNoFeedbacksText(t("There are no feedbacks yet."));
  //     setImageLoaded(true);
  //     return;
  //   }
  //   apiPostRequest(
  //     "feedbackFrequency",
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
  //   <img alt="frequency" src={imageSource} className="feedback-freq__image"></img>
  // );

  //const notifyError = (message) => toast.error(message);

  const FrequencyChart = () => (
    <div className="frequency-chart__holder">
      <BarChart
        height={500}
        width={900}
        data={data}
        className="frequency-chart"
        gridlines={false}
      />
    </div>
  );

  return (
    <div className="feedback-freq">
      <div className="feedback-freq__no-feedbacks">{noFeedbacksText}</div>
      {/* {!imageLoaded && (
        <div>
          <div className="freq-loader"></div>
        </div>
      )}
      {imageLoaded && !noFeedbacksText && <FrequencyFigure />} */}
      {!noFeedbacksText && <FrequencyChart />}
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
    feedbacks: state.currentTopicFeedbacks,
    topic: state.currentTopicDetails,
  };
  return { props };
};

export default connect(mapStateToProps)(withNamespaces()(FeedbackFrequency));
