import React, {useState, useEffect} from "react";

// importing language resource file
import stringRes from "../resources/strings";

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

    useEffect(() => {
        let p = [];
        while(props.reports.length > 0) {
            let chunk = props.reports.splice(0, reportsToShow);
            p.push(chunk);
        }
        setPages(p);
        // eslint-disable-next-line
    }, []);

    const firstPage = () => {
        setCurrentPage(0);
    }

    const lastPage = () => {
        setCurrentPage(pages.length - 1);
    }

    const nextPage = () => {
        if(currentPage < pages.length-1) {
            setCurrentPage(currentPage + 1);
        }
    }

    const beforePage = () => {
        if(currentPage > 0 ) {
            setCurrentPage(currentPage - 1);
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
                        {/* <div>{new Date(report.date*1000).toString()}</div> */}
                    </td>
                </tr>
              ))}
              </tbody>
          </table>
        );
    }

    return (
        <div className="topic-reports__container">
            <ReportTableRow />
            <div className="topic-reports__pagination-container">
                <div className="topic-reports__pagination-element" onClick={firstPage}>Első</div>
                {currentPage > 0 &&  
                    <div className="topic-reports__pagination-element" onClick={beforePage}>Előző</div>}
                {currentPage < pages.length-1 && 
                    <div className="topic-reports__pagination-element" onClick={nextPage}>Következő</div>}
                <div className="topic-reports__pagination-element" onClick={lastPage}>Utolsó</div>
            </div>
        </div>
    );
}

export default Reports;