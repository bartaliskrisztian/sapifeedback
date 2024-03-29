import React, { useEffect, useState, useRef } from "react";

import TopicElement from "./TopicElement";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";

import "react-toastify/dist/ReactToastify.css";

function SortedTopicElements({ props }) {
  const [topics, setTopics] = useState([]);

  // set the sorted topics, based on the sorting option
  useEffect(() => {
    let sortedTopics = getTopics();
    setTopics(sortedTopics.slice());
    // eslint-disable-next-line
  }, [props.sortOption, props.topics]);

  // toast functions
  const notifySuccess = (message) => toast.success(message);
  // toast notify functions
  const infoToastId = useRef(null);
  const notifyInfo = (message) => {
    if (!toast.isActive(infoToastId.current)) {
      infoToastId.current = toast.info(message);
    }
  };
  const notifyError = (message) => toast.error(message);

  // sort topics by name, ascending order
  const sortByAbcAsc = (userTopics) => {
    let sortedTopics = userTopics.sort((a, b) => {
      let la = a[1].topicName.toLowerCase();
      let lb = b[1].topicName.toLowerCase();
      return la < lb ? -1 : lb < la ? 1 : 0;
    });
    return sortedTopics;
  };

  // sort topics by name, descending order
  const sortByAbcDesc = (userTopics) => {
    let sortedTopics = userTopics.sort((a, b) => {
      let la = a[1].topicName.toLowerCase();
      let lb = b[1].topicName.toLowerCase();
      return la > lb ? -1 : lb > la ? 1 : 0;
    });
    return sortedTopics;
  };

  // sort topics by date, ascending order
  const sortByDateAsc = (userTopics) => {
    let sortedTopics = userTopics.sort((a, b) => {
      let la = a[1].date;
      let lb = b[1].date;
      return la < lb ? -1 : lb < la ? 1 : 0;
    });
    return sortedTopics;
  };

  // sort topics by date, descending order
  const sortByDateDesc = (userTopics) => {
    let sortedTopics = userTopics.sort((a, b) => {
      let la = a[1].date;
      let lb = b[1].date;
      return la > lb ? -1 : lb > la ? 1 : 0;
    });
    return sortedTopics;
  };

  const getTopics = () => {
    switch (props.sortOption) {
      case "a-z":
        return sortByAbcAsc(props.topics);
      case "z-a":
        return sortByAbcDesc(props.topics);
      case "date-asc":
        return sortByDateAsc(props.topics);
      case "date-desc":
        return sortByDateDesc(props.topics);
      default:
        return [];
    }
  };

  // returning sorted topics, including the archived topics too
  const SortedAllTopicElements = () => {
    return (
      topics &&
      topics
        .filter((topic) => {
          return props.searchText === ""
            ? true
            : topic[1].topicName
                .toLowerCase()
                .includes(props.searchText.toLowerCase());
          // eslint-disable-next-line
        })
        .map((topic) => {
          let date = new Date(topic[1].date).toLocaleDateString();
          return (
            <TopicElement
              key={topic[0]}
              type="topic"
              name={topic[1].topicName}
              date={date}
              topicid={topic[0]}
              userid={props.user.googleId}
              onArchive={notifySuccess}
              onCopyToClipboard={notifyInfo}
              notifyError={notifyError}
              isArchived={topic[1].isArchived}
            />
          );
        })
    );
  };

  // returning sorted topics, without the archived ones
  const SortedActiveTopicElements = () => {
    return (
      topics &&
      topics
        .filter((topic) => {
          return props.searchText === ""
            ? true
            : topic[1].topicName
                .toLowerCase()
                .includes(props.searchText.toLowerCase());
          // eslint-disable-next-line
        })
        .map((topic) => {
          if (!topic[1].isArchived) {
            let date = new Date(topic[1].date).toLocaleDateString();
            return (
              <TopicElement
                key={topic[0]}
                type="topic"
                name={topic[1].topicName}
                date={date}
                topicid={topic[0]}
                userid={props.user.googleId}
                onArchive={notifySuccess}
                onError={notifyError}
                onCopyToClipboard={notifyInfo}
                isArchived={topic[1].isArchived}
              />
            );
          } else {
            return null;
          }
        })
    );
  };

  return (
    <div className="topic-list">
      <div>
        <TopicElement type="add" onClick={props.openModal} />
      </div>
      {!props.showArchivedTopics && <SortedActiveTopicElements />}
      {props.showArchivedTopics && <SortedAllTopicElements />}
      <ToastContainer
        position="top-center"
        pauseOnHover={false}
        hideProgressBar={true}
        autoClose={1500}
        closeOnClick={false}
        limit={1}
      />
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  const props = {
    user: state.user,
    searchText: state.searchText,
    showArchivedTopics: state.showArchivedTopics,
    topics: state.userTopics,
    sortOption: ownProps.sortOption,
    openModal: ownProps.openModal,
  };
  return { props };
};

export default connect(mapStateToProps)(SortedTopicElements);
