import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

// importing components
import { GoogleLogout } from "react-google-login";
import SearchBar from "./SearchBar";
import { connect } from "react-redux";
import Settings from "./Settings";
import TopicMenus from "./TopicMenus";

import { withNamespaces } from "react-i18next";

// importing styles
import "../assets/css/Navbar.css";
import UserPlaceholder from "../assets/images/user.svg";

function Navbar({ t, props, dispatch }) {
  const history = useHistory();
  // whether to show the profile menu or not
  const [showProfileMenu, _setShowProfileMenu] = useState(false);
  const showProfileMenuRef = useRef(showProfileMenu);
  const setShowProfileMenu = (data) => {
    showProfileMenuRef.current = data;
    _setShowProfileMenu(data);
  };
  const profileMenuRef = useRef();

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
      !profileMenuRef.current?.contains(e.target) &&
      e.target.className !== "user-image"
    ) {
      setShowProfileMenu(false);
    }
  };

  const onSearch = (e) => {
    dispatch({ type: "SET_SEARCHTEXT", payload: e.target.value });
  };

  // on logout we set the user to null and redirect the page
  const logout = () => {
    dispatch({ type: "SET_USER", payload: null });
    history.replace("/login");
  };

  const onImageError = (image) => {
    image.target.src = UserPlaceholder;
  };

  const ProfileMenu = () => {
    return (
      <div className="user-menu" title={t("Your profile")} ref={profileMenuRef}>
        <img
          className="user-image"
          src={props.user.imageUrl}
          alt="Profile"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          onError={onImageError}
        />
        <div className={`profile-dropdown${showProfileMenu ? " open" : ""}`}>
          <img
            className="profile-dropdown__image"
            src={
              props.user.imageUrl === undefined
                ? UserPlaceholder
                : props.user.imageUrl
            }
            alt="Profile"
          />
          <div className="profile-dropdown__content">
            <div>
              {`${t("Name")}: `}
              <label className="profile-dropdown__label">
                {props.user.name}
              </label>
            </div>
            <div>
              {`${t("Email")}: `}
              <label className="profile-dropdown__label">
                {props.user.email}
              </label>
            </div>
          </div>
          <div title={t("Logout")}>
            <GoogleLogout
              clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
              buttonText={t("Logout")}
              onLogoutSuccess={logout}
              className="logout-button"
              theme={props.theme === "light" ? "dark" : "light"}
            ></GoogleLogout>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="navbar">
      {/* we only see the searchbar if we are at the homepage */}
      {props.page === "home" && <SearchBar onSearch={onSearch} />}
      {props.page === "topic" && <TopicMenus place="top" />}
      {props.page === "topic" && props.topic && (
        <div className="navbar__topic-details">
          <div className="navbar__topic-name">{props.topic.topicName}</div>
          {props.topic.isArchived && (
            <div className="navbar__archived-topic">({t("Archived")})</div>
          )}
        </div>
      )}
      <div className="elements-to-end">
        <Settings page="" />
        {props.user && <ProfileMenu />}
      </div>
    </div>
  );
}

// getting the global state variables with redux
const mapStateToProps = (state, ownProps) => {
  const props = {
    theme: state.appTheme,
    user: state.user,
    page: ownProps.page,
    topic: state.currentTopicDetails,
  };
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
)(withNamespaces()(Navbar));
