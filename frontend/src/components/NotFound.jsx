import React from "react";
import { withNamespaces } from "react-i18next";
import { Link } from "react-router-dom";

import ErrorIcon from "../assets/images/404-error.svg";
import "../assets/css/NotFound.css";

function NotFound({ t }) {
  return (
    <div className="not-found">
      <img src={ErrorIcon} alt="404-error" className="error404__icon" />
      <div className="error404__container">
        <div className="error404__text">{t("Page not found")}</div>
        <Link className="error404__button" to="/">
          {t("Go to Home")}
        </Link>
      </div>
    </div>
  );
}

export default withNamespaces()(NotFound);
