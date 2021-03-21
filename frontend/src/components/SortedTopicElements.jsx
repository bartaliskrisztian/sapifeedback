import React, { useEffect, useState } from "react";

import TopicElement from "./TopicElement";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";

import "react-toastify/dist/ReactToastify.css";

function SortedTopicElements({ props }) {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const sortedTopics = getTopics();
    setTopics(sortedTopics);
    // eslint-disable-next-line
  }, [props.sortOption, props.topics]);

  const notifySuccess = (message) => toast.success(message);
  const notifyInfo = (message) => toast.info(message);
  const notifyError = (message) => toast.error(message);

  const sortByAbcAsc = (userTopics) => {
    let sortedTopics = userTopics.sort((a, b) => {
      let la = a[1].topicName.toLowerCase();
      let lb = b[1].topicName.toLowerCase();
      return la < lb ? -1 : lb < la ? 1 : 0;
    });
    return sortedTopics;
  };

  const sortByAbcDesc = (userTopics) => {
    let sortedTopics = userTopics.sort((a, b) => {
      let la = a[1].topicName.toLowerCase();
      let lb = b[1].topicName.toLowerCase();
      return la > lb ? -1 : lb > la ? 1 : 0;
    });
    return sortedTopics;
  };

  const sortByDateAsc = (userTopics) => {
    let sortedTopics = userTopics.sort((a, b) => {
      let la = a[1].date;
      let lb = b[1].date;
      return la < lb ? -1 : lb < la ? 1 : 0;
    });
    return sortedTopics;
  };

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
      case "unsorted":
        return props.topics;
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
              isArchived={topic[1].isArchived}
            />
          );
        })
    );
  };

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
          }
        })
    );
  };

  return (
    <div className="topic-list">
      <div>
        <TopicElement
          type="add"
          onClick={props.openModal}
          onClose={props.closeModal}
        />
      </div>
      {!props.showArchivedTopics && <SortedActiveTopicElements />}
      {props.showArchivedTopics && <SortedAllTopicElements />}
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

const mapStateToProps = (state, ownProps) => {
  const props = {
    user: state.user,
    searchText: state.searchText,
    showArchivedTopics: state.showArchivedTopics,
    topics: state.userTopics,
    sortOption: ownProps.sortOption,
    openModal: ownProps.openModal,
    closeModal: ownProps.closeModal,
  };
  return { props };
};

export default connect(mapStateToProps)(SortedTopicElements);
