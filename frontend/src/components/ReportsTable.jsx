import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { withNamespaces } from "react-i18next";

// importing styles
import "../assets/css/Reports.css";
import ImagePlaceholder from "../assets/images/image-placeholder.svg";

function ReportsTable({ t, props }) {
  // variables used for table pagination
  const reportsToShow = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [showedReports, setShowedReports] = useState(0);
  const [allReportsCount, setAllReportCount] = useState(0);

  useEffect(() => {
    let reportsCopy = [...props.reports];
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
            pages[currentPage].map((report) => (
              <tr key={report.date} className="topic-reports__row">
                <td className="topic-reports__cell-text">
                  <div className="topic-reports__text">{report.text}</div>
                </td>
                <td className="topic-reports__cell-image">
                  <a
                    href={
                      !report.imageUrl ? window.location.href : report.imageUrl
                    }
                    target="blank"
                    className="topic-reports__image-holder"
                  >
                    <img
                      alt="report"
                      src={report.imageUrl ? report.imageUrl : ImagePlaceholder}
                      onError={onImageError}
                      className="topic-reports__image"
                    />
                  </a>
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

  return (
    <div className="topic-reports__container">
      <TablePagination />
      <ReportTableRow />
      <TablePagination />
    </div>
  );
}

// getting the global state variables with redux
const mapStateToProps = (state) => {
  const props = {
    reports: state.currentTopicReports,
  };
  return { props };
};

export default connect(mapStateToProps)(withNamespaces()(ReportsTable));
