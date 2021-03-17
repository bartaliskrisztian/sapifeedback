import React, {useState, useEffect} from "react";

import stringRes from "../resources/strings"; // importing language resource file

// importing styles
import "../assets/css/Reports.css";
import ImagePlaceholder from "../assets/images/image-placeholder.svg";


function Reports(props) {
  
    // string resources
    let language = process.env.REACT_APP_LANGUAGE;
    let strings = stringRes[language];

    const reportsToShow = 5;
    const [currentPage, setCurrentPage] = useState(0);
    const [pages, setPages] = useState([]);
    const [showedReports, setShowedReports] = useState(0);
    const [allReportsCount, setAllReportCount] = useState(0);

    useEffect(() => {
        let reportsCopy = props.reports;

        setAllReportCount(reportsCopy.length);
        let p = [];
        while(reportsCopy.length > 0) {
            let chunk = reportsCopy.splice(0, reportsToShow);
            p.push(chunk);
        }
        if(p[0] !== undefined) {
            setShowedReports(p[0].length)
        }
        setPages(p);
        // eslint-disable-next-line
    }, []);

    const firstPage = () => {
        setCurrentPage(0);
        setShowedReports(pages[0].length);
    }

    const lastPage = () => {
        setCurrentPage(pages.length - 1);
        setShowedReports(allReportsCount);
    }

    const nextPage = () => {
        if(currentPage < pages.length-1) {
            let newIndex = currentPage + 1;
            setCurrentPage(newIndex);
            setShowedReports(showedReports + pages[newIndex].length);
        }
    }

    const beforePage = () => {
        if(currentPage > 0 ) {
            let newIndex = currentPage - 1;
            setShowedReports(showedReports - pages[currentPage].length);
            setCurrentPage(newIndex);
        }
    }

    const ReportTableRow = () => {
        return (
            <table className="topic-reports">
                <tbody>
                    <tr className='topic-reports__row-header'>
                        <th className='topic-reports__header text'>{strings.topic.reports.reportText}</th>
                        <th className='topic-reports__header image'>{strings.topic.reports.reportImage}</th>
                    </tr>
              {props.reports && pages.length > 0 && pages[currentPage].map((report) => (
                <tr key={report.date} className="topic-reports__row">
                    <td className="topic-reports__cell-text">
                        <div className="topic-reports__text" >
                            {report.text}
                        </div>
                    </td>
                    <td className="topic-reports__cell-image">
                        <a 
                            href={report.imageUrl ? report.imageUrl : ImagePlaceholder} 
                            target="blank"
                            className="topic-reports__image-holder"
                        >
                            <img 
                                alt="report" 
                                src={report.imageUrl ? report.imageUrl : ImagePlaceholder}
                                className="topic-reports__image"
                            /> 
                        </a>
                    </td>
                </tr>
              ))}
              </tbody>
          </table>
        );
    }

    const TablePagination = () => {
        return(
            <div className="topic-reports__pagination-container">
                <div className="topic-reports__pagination-element" onClick={firstPage}>{strings.topic.reports.firstPageButton}</div>
                <div className="topic-reports__pagination-element" onClick={beforePage}>{strings.topic.reports.prevPageButton}</div>
                <div className="topic-reports__pagination-element" onClick={nextPage}>{strings.topic.reports.nextPageButton}</div>
                <div className="topic-reports__pagination-element" onClick={lastPage}>{strings.topic.reports.lastPageButton}</div>
                {props.reports && pages.length > 0 && <div className="topic-reports__pagination-element counter">{showedReports}/{allReportsCount}</div> }
            </div>
        );
    }

    return (
        <div className="topic-reports__container">
            <TablePagination />
            <ReportTableRow />
            <TablePagination />
        </div>
    );
}

export default Reports;