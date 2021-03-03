import React from "react";
import "../assets/css/Reports.css";


function Reports(props) {
  
    const ReportTableRow = () => {
        return (
            <table className="topic-reports">
                <tbody>
                    <tr className='topic-reports__row-header'>
                        <th className='topic-reports__header text'>Text</th>
                        <th className='topic-reports__header image'>Image</th>
                    </tr>
              {props.reports && props.reports.map((report) => (
                <tr key={report.date} className="topic-reports__row">
                    <td className="topic-reports__cell-text">
                        <div className="topic-reports__text" >
                            {report.text}
                        </div>
                    </td>
                    <td className="topic-reports__cell-image">
                        <a href={report.imageUrl} target="blank">
                            <img 
                                alt="report" 
                                src={report.imageUrl}
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

    return (
        <div className="topic-reports__container">
          <ReportTableRow />
        </div>
    );
}

export default Reports;