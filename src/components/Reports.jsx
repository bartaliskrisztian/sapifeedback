import React from "react";
import "../assets/css/Reports.css";


function Reports(props) {
  
    const ReportTableRow = () => {
        return (
            <table className="topic-reports">
                <tbody>
              {props.reports && props.reports.map((report) => (
                <tr key={report.date} className="topic-reports__row">
                    <td className="topic-reports__cell">
                        <div className="topic-reports__text" >
                            {report.text}
                        </div>
                    </td>
                    <td className="topic-reports__cell">
                        <img 
                            alt="report" 
                            src={report.imageUrl}
                            className="topic-reports__image"
                        /> 
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