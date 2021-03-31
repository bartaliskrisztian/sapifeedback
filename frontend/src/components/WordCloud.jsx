import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";

import "../assets/css/WordCloud.css";

function WordCloud({ props }) {
  const params = useParams();

  // fetching the topics based on the user
  useEffect(() => {
    //fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = () => {
    fetch(
      `http://localhost:3000/api/topic/${params.userId}/${params.topicId}/wordCloud`
    )
      .then((res) => res.json())
      .then((res) => {
        //console.log(res);
        console.log(JSON.parse(res.result));
      });
  };
  return (
    <div className="word-cloud">
      {props.topic.wordCloudUrl == undefined && (
        <button>Create wordcloud</button>
      )}
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
