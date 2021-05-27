import React, { useState, useEffect, useRef } from "react";

// importing components
import Switch from "react-input-switch";
import i18n from "../language";
import { connect } from "react-redux";
import { withNamespaces } from "react-i18next";

import "../assets/css/Settings.css";
import HungaryIcon from "../assets/images/country-icons/hungary.svg";
import UnitedKingdomIcon from "../assets/images/country-icons/united-kingdom.svg";

function Settings({ t, props, dispatch }) {
  const [dropdownOpen, _setDropdownOpen] = useState(false);
  const dropDownOpenRef = useRef(dropdownOpen);
  const setDropdownOpen = (data) => {
    dropDownOpenRef.current = data;
    _setDropdownOpen(data);
  };
  const settingsDropdownRef = useRef();

  const handleClick = (e) => {
    if (
      !settingsDropdownRef.current?.contains(e.target) &&
      e.target.className !== "settings-icon"
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);
    // cleanup this component
    return () => {
      window.removeEventListener("click", handleClick);
    };
    // eslint-disable-next-line
  }, []);

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
    <div className={`settings ${props.page}`} ref={settingsDropdownRef}>
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
