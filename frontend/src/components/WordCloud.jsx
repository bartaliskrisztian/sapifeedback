import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import strings from "../resources/strings"; // importing language resource file

import "../assets/css/WordCloud.css";
import "react-toastify/dist/ReactToastify.css";

function WordCloud({ props }) {
  const params = useParams();

  const [wordCloudLoaded, setWordCloudLoaded] = useState(false);
  const [noWordCloudText, setNoWordCloudText] = useState("");
  const [wordCloudSource, setWordCloudSource] = useState("");

  // fetching the details of a topic before rendering
  useEffect(() => {
    createWordcloud();
    // eslint-disable-next-line
  }, []);

  const createWordcloud = () => {
    const textArray = props.reports.map((report) => report.text);
    const text = textArray.join("");
    if (!text.length) {
      setNoWordCloudText(strings.topic.noReports);
      setWordCloudLoaded(true);
      return;
    }
    fetch(
      `http://localhost:3000/api/topic/${params.userId}/${params.topicId}/wordCloud`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        let data = res.result.slice(2);
        data = data.slice(0, -1);
        const wordCloudBase64 = `data:image/jpg;base64,${data}`;
        setWordCloudSource(wordCloudBase64);
        setWordCloudLoaded(true);
      })
      .catch((error) => notifyError(error));
  };

  const notifyError = (message) => toast.error(message);
  const WordCloud = () => (
    <img
      alt="wordcloud"
      src={wordCloudSource}
      className="word-cloud__image"
    ></img>
  );

  return (
    <div className="word-cloud">
      <div className="word-cloud__no-reports">{noWordCloudText}</div>
      {!wordCloudLoaded && (
        <div>
          <div className="wordcloud-loader"></div>
          <div>{strings.wordCloud.loadingText}</div>
        </div>
      )}
      {wordCloudLoaded && !noWordCloudText && <WordCloud />}
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

export default connect(mapStateToProps)(WordCloud);
