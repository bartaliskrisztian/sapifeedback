import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import "../assets/css/WordCloud.css";
import "react-toastify/dist/ReactToastify.css";

function WordCloud({ props }) {
  const params = useParams();

  const [wordCloudLoaded, setWordCloudLoaded] = useState(false);
  const [wordCloudSource, setWordCloudSource] = useState("");

  // fetching the details of a topic before rendering
  useEffect(() => {
    createWordcloud();
    // eslint-disable-next-line
  }, []);

  const createWordcloud = () => {
    fetch(
      `http://localhost:3000/api/topic/${params.userId}/${params.topicId}/wordCloud`
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
      {!wordCloudLoaded && <div className="wordcloud-loader"></div>}
      {wordCloudLoaded && <WordCloud />}
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
