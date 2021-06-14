import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import { withNamespaces } from "react-i18next";
import i18n from "../language";
import { apiPostRequest } from "../api/utils";

import "../assets/css/WordCloud.css";
import "react-toastify/dist/ReactToastify.css";

function WordCloud({ t, props }) {
  const [wordCloudLoaded, setWordCloudLoaded] = useState(false);
  const [noWordCloudText, setNoWordCloudText] = useState("");
  const [wordCloudSource, setWordCloudSource] = useState("");

  // fetching the details of a topic before rendering
  useEffect(() => {
    createWordcloud(props.feedbacks);
    // eslint-disable-next-line
  }, []);

  const createWordcloud = (feedbacks) => {
    const textArray = feedbacks.map((feedback) => feedback.text);
    const text = textArray.join("");
    if (!text.length) {
      setNoWordCloudText(t("There are no feedbacks yet."));
      setWordCloudLoaded(true);
      return;
    }
    apiPostRequest(
      "topicWordCloud",
      JSON.stringify({
        text: text,
        language: i18n.language,
      })
    ).then(
      (response) => {
        if (response === "Error") {
          notifyError(t("A problem has occured"));
        } else {
          let data = response.result.slice(2);
          data = data.slice(0, -1);
          const wordCloudBase64 = `data:image/jpg;base64,${data}`;
          setWordCloudSource(wordCloudBase64);
          setWordCloudLoaded(true);
        }
      },
      (reject) => {
        notifyError(reject);
      }
    );
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
      <div className="word-cloud__no-feedbacks">{noWordCloudText}</div>
      {!wordCloudLoaded && (
        <div>
          <div className="wordcloud-loader"></div>
          <div>{t("Generating wordcloud")}</div>
        </div>
      )}
      {wordCloudLoaded && !noWordCloudText && <WordCloud />}
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

export default connect(mapStateToProps)(withNamespaces()(WordCloud));
