import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function Statistics() {
  const params = useParams();

  // fetching the topics based on the user
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = () => {
    fetch(
      `http://localhost:3000/topic/${params.userId}/${params.topicId}/statistics`
    )
      .then((res) => res.json())
      .then((res) => {
        //console.log(res);
        console.log(JSON.parse(res.result));
      });
  };

  return <div className="statistics"></div>;
}

export default Statistics;
