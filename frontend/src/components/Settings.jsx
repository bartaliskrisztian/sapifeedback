import React, { useState } from "react";

// importing components
import Switch from "react-input-switch";
import i18n from "../language";
import { connect } from "react-redux";
import { withNamespaces } from "react-i18next";

import "../assets/css/Settings.css";
import HungaryIcon from "../assets/images/hungary.svg";
import UnitedKingdomIcon from "../assets/images/united-kingdom.svg";

function Settings({ t, props, dispatch }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onThemeChange = () => {
    let t = "dark";
    if (props.theme === "dark") {
      t = "light";
    }
    dispatch({ type: "SET_THEME", payload: t });
  };

  const changeLanguage = (e) => {
    const language = e.target.id;
    i18n.changeLanguage(language);
  };

  return (
    <div className={`settings ${props.page}`}>
      <div
        alt="settings-icon"
        className={`settings-icon ${props.page}`}
        title={t("Settings")}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      ></div>
      <div
        className={`settings-dropdown${dropdownOpen ? " open" : ""} ${
          props.page
        }`}
      >
        <div className="settings__theme">
          <div className="settings__theme-icon"></div>
          <Switch
            on="dark"
            off="light"
            value={props.theme}
            onChange={onThemeChange}
            className="settings__theme-switch"
            styles={{
              track: {
                backgroundColor: "#7c7777",
              },
            }}
          />
        </div>
        <div className="settings__language">
          <img
            alt="hungary"
            id="hu"
            src={HungaryIcon}
            onClick={changeLanguage}
            title={t("Change language to hungarian.")}
            className="settings__language-icon"
          />
          <img
            alt="united-kingdom"
            id="en"
            src={UnitedKingdomIcon}
            onClick={changeLanguage}
            title={t("Change language to english.")}
            className="settings__language-icon"
          />
        </div>
      </div>
    </div>
  );
}

// getting the global state variables with redux
const mapStateToProps = (state, ownProps) => {
  const theme = state.appTheme;
  const page = ownProps.page;
  const props = { theme, page };
  return { props };
};

// getting redux dispatch function for changing global state variables
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(Settings));
