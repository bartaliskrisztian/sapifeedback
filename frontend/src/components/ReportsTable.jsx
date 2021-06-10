import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import { withNamespaces } from "react-i18next";

// importing styles
import "../assets/css/Reports.css";
import ImagePlaceholder from "../assets/images/image-placeholder.svg";
import CancelIcon from "../assets/images/cancel.svg";

function ReportsTable({ t, props }) {
  const [exportDropwDownOpen, _setExportDropdownOpen] = useState(false);
  const exportDropwDownRef = useRef(exportDropwDownOpen);
  const setExportDropdownOpen = (data) => {
    exportDropwDownRef.current = data;
    _setExportDropdownOpen(data);
  };
  const exportDivRef = useRef();

  // variables used for table pagination
  const reportsToShow = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [showedReports, setShowedReports] = useState(0);
  const [allReportsCount, setAllReportCount] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalImageSource, setModalImageSource] = useState("");

  useEffect(() => {
    let reportsCopy = [...props.reports.reverse()];
    setAllReportCount(reportsCopy.length);

    // creating smaller arrays from the array of reports,
    // each represents a page in the table
    let p = [];
    while (reportsCopy.length > 0) {
      let chunk = reportsCopy.splice(0, reportsToShow);
      p.push(chunk);
    }
    if (p[0] !== undefined) {
      setShowedReports(p[0].length);
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

  const handleClick = (e) => {
    if (
      !exportDivRef.current?.contains(e.target) &&
      e.target.className !== "topic-reports__export-holder"
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

  // functions for modal
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const onFeedbackImageClicked = (e) => {
    setModalImageSource(e.target.src);
    openModal();
  };

  // go on the first page in the table
  const firstPage = () => {
    setCurrentPage(0);
    setShowedReports(pages[0].length);
  };

  // go on the last page in the table
  const lastPage = () => {
    setCurrentPage(pages.length - 1);
    setShowedReports(allReportsCount);
  };

  // go on the next page in the table
  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      let newIndex = currentPage + 1;
      setCurrentPage(newIndex);
      setShowedReports(showedReports + pages[newIndex].length);
    }
  };

  // go on the previous page in the table
  const prevPage = () => {
    if (currentPage > 0) {
      let newIndex = currentPage - 1;
      setShowedReports(showedReports - pages[currentPage].length);
      setCurrentPage(newIndex);
    }
  };

  // if an image cannot be loaded, use placeholder
  const onImageError = (image) => {
    image.target.src = ImagePlaceholder;
  };

  const ReportTableRow = () => {
    return (
      <table className="topic-reports">
        <tbody>
          <tr className="topic-reports__row-header">
            <th className="topic-reports__header text">{t("Text")}</th>
            <th className="topic-reports__header image">
              {t("Attached image")}
            </th>
          </tr>
          {props.reports &&
            pages.length > 0 &&
            pages[currentPage].map((report, i) => (
              <tr key={i} className="topic-reports__row">
                <td className="topic-reports__cell-text">
                  <div className="topic-reports__text">{report.text}</div>
                </td>
                <td className="topic-reports__cell-image">
                  <img
                    alt="report"
                    src={report.imageUrl ? report.imageUrl : ImagePlaceholder}
                    onError={onImageError}
                    className="topic-reports__image"
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
      <div className="topic-reports__pagination-container">
        <div className="topic-reports__pagination-element" onClick={firstPage}>
          {t("First")}
        </div>
        <div className="topic-reports__pagination-element" onClick={prevPage}>
          {t("Previous")}
        </div>
        <div className="topic-reports__pagination-element" onClick={nextPage}>
          {t("Next")}
        </div>
        <div className="topic-reports__pagination-element" onClick={lastPage}>
          {t("Last")}
        </div>
        {props.reports && pages.length > 0 && (
          <div className="topic-reports__pagination-element counter">
            {showedReports}/{allReportsCount}
          </div>
        )}
      </div>
    );
  };

  const modalStyle = {
    overlay: {
      backgroundColor: props.theme === "dark" ? "#242526" : "#6b6d6f",
    },
  };

  return (
    <div className="topic-reports__container">
      <div className="topic-reports__top-bar">
        <TablePagination />
        <div className="topic-reports__export-holder" ref={exportDivRef}>
          <div
            className="topic-reports__export"
            onClick={() => setExportDropdownOpen(!exportDropwDownOpen)}
          >
            EXPORT
          </div>
          <div
            className={`topic-reports__export-dropdown${
              exportDropwDownOpen ? " open" : ""
            }`}
          >
            <div
              className="export__dropwdown-element"
              onClick={() => {
                exportJson(JSON.stringify(props.reports));
              }}
            >
              JSON
            </div>
            <div
              className="export__dropwdown-element"
              onClick={() => {
                exportCSV(props.reports);
              }}
            >
              CSV
            </div>
          </div>
        </div>
      </div>
      <ReportTableRow />
      <TablePagination />
      <Modal
        closeTimeoutMS={500}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={`feedback-image__modal ${props.theme}`}
        style={modalStyle}
      >
        <img
          src={CancelIcon}
          alt="cancel"
          className="modal__cancel-icon"
          onClick={closeModal}
        />
        <img
          alt="feedback_image"
          src={modalImageSource}
          className="feedback-image__img"
        />
      </Modal>
    </div>
  );
}

// getting the global state variables with redux
const mapStateToProps = (state) => {
  const props = {
    reports: state.currentTopicReports,
    theme: state.appTheme,
    topicName: state.currentTopicName,
  };
  return { props };
};

export default connect(mapStateToProps)(withNamespaces()(ReportsTable));
