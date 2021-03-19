import React, { useEffect } from "react";

function Statistics() {
  // fetching the topics based on the user
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = () => {
    fetch("/")
      .then((res) => res.text())
      .then((res) => {
        let temp = document.createElement("div");
        temp.innerHTML = res;
        console.log(temp.innerHTML);
      });
  };

  return <div className="statistics"></div>;
}

export default Statistics;
