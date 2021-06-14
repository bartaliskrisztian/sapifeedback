import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import Modal from "react-modal";
import { withNamespaces } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { apiGetRequest } from "../api/utils";

// importing styles
import "../assets/css/FeedbackTable.css";
import ImagePlaceholder from "../assets/images/image-placeholder.svg";
import CancelIcon from "../assets/images/cancel.svg";
import DeleteIcon from "../assets/images/trash.svg";

function FeedbackTable({ t, props }) {
  const params = useParams();
  const [exportDropwDownOpen, _setExportDropdownOpen] = useState(false);
  const exportDropwDownRef = useRef(exportDropwDownOpen);
  const setExportDropdownOpen = (data) => {
    exportDropwDownRef.current = data;
    _setExportDropdownOpen(data);
  };
  const exportDivRef = useRef();

  // variables used for table pagination
  const feedbacksToShow = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [showedFeedbacks, setShowedFeedbacks] = useState(0);
  const [allFeedbackCount, setAllFeedbackCount] = useState(0);
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [deleteFeedbackModalIsOpen, setDeleteFeedbackModalIsOpen] =
    useState(false);
  const [modalImageSource, setModalImageSource] = useState("");
  const [feedbackIdToDelete, setFeedbackIdToDelete] = useState(null);
  const [topicId, setTopicId] = useState(null);

  useEffect(() => {
    setTopicId(params.topicId);
    let feedbacksCopy = [...props.feedbacks.reverse()];
    setAllFeedbackCount(feedbacksCopy.length);

    // creating smaller arrays from the array of feedbacks,
    // each represents a page in the table
    let p = [];
    while (feedbacksCopy.length > 0) {
      let chunk = feedbacksCopy.splice(0, feedbacksToShow);
      p.push(chunk);
    }
    if (p[0] !== undefined) {
      setShowedFeedbacks(p[0].length);
    }
    setPages(p);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    window.addEventListener("click", handleClick);
    // cleanup this component
    return () => {
      window.removeEventListener("click", handleClick);
    };
    // eslint-disable-next-line
  }, []);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleClick = (e) => {
    if (
      !exportDivRef.current?.contains(e.target) &&
      e.target.className !== "topic-feedbacks__export-holder"
    ) {
      setExportDropdownOpen(false);
    }
  };

  const exportJson = (dataStr) => {
    let dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    let exportFileDefaultName = `${props.topicName}_feedbacks.json`;

    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    setExportDropdownOpen(false);
  };

  const parseJSONToCSVStr = (jsonData) => {
    if (jsonData.length === 0) {
      return "";
    }

    let keys = Object.keys(jsonData[0]);

    let columnDelimiter = ",";
    let lineDelimiter = "\n";

    let csvColumnHeader = keys.join(columnDelimiter);
    let csvStr = csvColumnHeader + lineDelimiter;

    jsonData.forEach((item) => {
      keys.forEach((key, index) => {
        if (index > 0 && index < keys.length) {
          csvStr += columnDelimiter;
        }
        csvStr += item[key];
      });
      csvStr += lineDelimiter;
    });

    return encodeURIComponent(csvStr);
  };

  const exportCSV = (jsonData) => {
    let csvStr = parseJSONToCSVStr(jsonData);
    let dataUri = "data:text/csv;charset=utf-8," + csvStr;

    let exportFileDefaultName = `${props.topicName}_feedbacks.csv`;

    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    setExportDropdownOpen(false);
  };

  // functions for modals
  function openImageModal() {
    setImageModalIsOpen(true);
  }

  function closeImageModal() {
    setImageModalIsOpen(false);
  }

  function openDeleteFeedbackModal() {
    setDeleteFeedbackModalIsOpen(true);
  }

  function closeDeleteFeedbackModal() {
    setDeleteFeedbackModalIsOpen(false);
  }

  const onFeedbackImageClicked = (e) => {
    setModalImageSource(e.target.src);
    openImageModal();
  };

  // go on the first page in the table
  const firstPage = () => {
    setCurrentPage(0);
    setShowedFeedbacks(pages[0].length);
  };

  // go on the last page in the table
  const lastPage = () => {
    setCurrentPage(pages.length - 1);
    setShowedFeedbacks(allFeedbackCount);
  };

  // go on the next page in the table
  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      let newIndex = currentPage + 1;
      setCurrentPage(newIndex);
      setShowedFeedbacks(showedFeedbacks + pages[newIndex].length);
    }
  };

  // go on the previous page in the table
  const prevPage = () => {
    if (currentPage > 0) {
      let newIndex = currentPage - 1;
      setShowedFeedbacks(showedFeedbacks - pages[currentPage].length);
      setCurrentPage(newIndex);
    }
  };

  // if an image cannot be loaded, use placeholder
  const onImageError = (image) => {
    image.target.src = ImagePlaceholder;
  };

  const DeleteFeedbackButton = (props) => {
    return (
      <button
        type="submit"
        className="delete-feedback__button"
        onClick={() => {
          openDeleteFeedbackModal();
          setFeedbackIdToDelete(props.feedbackId);
        }}
      >
        <img className="trash-icon" alt="trash-icon" src={DeleteIcon} />
        {t("Delete")}
      </button>
    );
  };

  const deleteFeedback = () => {
    apiGetRequest("deleteFeedback", {
      topicId: topicId,
      feedbackId: feedbackIdToDelete,
    }).then(
      (response) => {
        if (response.result === "OK") {
          closeDeleteFeedbackModal();
          notifySuccess(t("Feedback deleted successfully"));
        } else {
          notifyError(response.result);
        }
      },
      (reject) => {
        notifyError(reject);
      }
    );
  };

  const FeedbackTableRow = () => {
    return (
      <table className="topic-feedbacks">
        <tbody>
          <tr className="topic-feedbacks__row-header">
            <th className="topic-feedbacks__header text">{t("Text")}</th>
            <th className="topic-feedbacks__header image">
              {t("Attached image")}
            </th>
          </tr>
          {props.feedbacks &&
            pages.length > 0 &&
            pages[currentPage].map((feedback, i) => (
              <tr key={i} className="topic-feedbacks__row">
                <td className="topic-feedbacks__cell-text">
                  <div className="topic-feedbacks__text">{feedback.text}</div>
                  <DeleteFeedbackButton feedbackId={feedback.feedbackId} />
                </td>
                <td className="topic-feedbacks__cell-image">
                  <img
                    alt="feedbacks"
                    src={
                      feedback.imageUrl ? feedback.imageUrl : ImagePlaceholder
                    }
                    onError={onImageError}
                    className="topic-feedbacks__image"
                    onClick={onFeedbackImageClicked}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  };

  const TablePagination = () => {
    return (
      <div className="topic-feedbacks__pagination-container">
        <div
          className="topic-feedbacks__pagination-element"
          onClick={firstPage}
        >
          {t("First")}
        </div>
        <div className="topic-feedbacks__pagination-element" onClick={prevPage}>
          {t("Previous")}
        </div>
        <div className="topic-feedbacks__pagination-element" onClick={nextPage}>
          {t("Next")}
        </div>
        <div className="topic-feedbacks__pagination-element" onClick={lastPage}>
          {t("Last")}
        </div>
        {props.feedbacks && pages.length > 0 && (
          <div className="topic-feedbacks__pagination-element counter">
            {showedFeedbacks}/{allFeedbackCount}
          </div>
        )}
      </div>
    );
  };

  const DeleteFeedbackModal = () => {
    return (
      <Modal
        isOpen={deleteFeedbackModalIsOpen}
        onRequestClose={closeDeleteFeedbackModal}
        className={`delete-feedback__modal ${props.theme}`}
      >
        <div className="delete-feedback__title">
          {t("Are you sure you want to delete this feedback?")}
        </div>
        <div className="delete-feedback__button-holder">
          <button
            className="delete-feedback__button delete"
            onClick={deleteFeedback}
          >
            {t("Delete")}
          </button>
          <button
            className="delete-feedback__button cancel"
            onClick={closeDeleteFeedbackModal}
          >
            {t("Cancel")}
          </button>
        </div>
      </Modal>
    );
  };

  const FeedbackImageModal = () => {
    return (
      <Modal
        closeTimeoutMS={500}
        isOpen={imageModalIsOpen}
        onRequestClose={closeImageModal}
        className={`feedback-image__modal ${props.theme}`}
        style={modalStyle}
      >
        <img
          src={CancelIcon}
          alt="cancel"
          className="modal__cancel-icon"
          onClick={closeImageModal}
        />
        <img
          alt="feedback_image"
          src={modalImageSource}
          className="feedback-image__img"
        />
      </Modal>
    );
  };

  const modalStyle = {
    overlay: {
      backgroundColor: props.theme === "dark" ? "#242526" : "#6b6d6f",
    },
  };

  return (
    <div className="topic-feedbacks__container">
      <div className="topic-feedbacks__top-bar">
        <TablePagination />
        <div className="topic-feedbacks__export-holder" ref={exportDivRef}>
          <div
            className="topic-feedbacks__export"
            onClick={() => setExportDropdownOpen(!exportDropwDownOpen)}
          >
            {t("Export")}
          </div>
          <div
            className={`topic-feedbacks__export-dropdown${
              exportDropwDownOpen ? " open" : ""
            }`}
          >
            <div
              className="export__dropwdown-element"
              onClick={() => {
                exportJson(JSON.stringify(props.feedbacks));
              }}
            >
              JSON
            </div>
            <div
              className="export__dropwdown-element"
              onClick={() => {
                exportCSV(props.feedbacks);
              }}
            >
              CSV
            </div>
          </div>
        </div>
      </div>
      <FeedbackTableRow />
      <TablePagination />
      <FeedbackImageModal />
      <DeleteFeedbackModal />
      <ToastContainer
        position="top-center"
        pauseOnHover={false}
        hideProgressBar={true}
        autoClose={2000}
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
    theme: state.appTheme,
    topicName: state.currentTopicName,
  };
  return { props };
};

export default connect(mapStateToProps)(withNamespaces()(FeedbackTable));
