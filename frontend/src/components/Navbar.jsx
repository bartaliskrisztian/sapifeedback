import React, { useState } from "react";
import { useHistory, Redirect, Link } from "react-router-dom";

// importing components
import Switch from "react-input-switch";
import { GoogleLogout } from "react-google-login";
import SearchBar from "./SearchBar";
import { connect } from "react-redux";

// importing language resource file
import strings from "../resources/strings";

// importing styles
import "../assets/css/Navbar.css";
import UserPlaceholder from "../assets/images/user.svg";
import HungaryIcon from "../assets/images/hungary.svg";
import UnitedKingdomIcon from "../assets/images/united-kingdom.svg";

function Navbar({ props, dispatch }) {
  const history = useHistory();

  // whether to show the profile menu or not
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const onSearch = (e) => {
    dispatch({ type: "SET_SEARCHTEXT", payload: e.target.value });
  };

  // on logout we set the user to null and redirect the page
  const logout = () => {
    history.push("/login");
    dispatch({ type: "RESET_STATE", payload: null });
  };

  const UserTopicsMenu = () => {
    return (
      <div className="navbar-menus">
        {/* if we are the user topics page, this button is unnecessary */}
        {window.location.hash !== "#/" && (
          <Link className="navbar-menus__element" to="/">
            {strings.navbar.myTopicsMenu}
          </Link>
        )}
      </div>
    );
  };

  const onThemeChange = () => {
    let theme = "dark";
    if (props.theme === "dark") {
      theme = "light";
    }
    dispatch({ type: "SET_THEME", payload: theme });
  };

  const onImageError = (image) => {
    image.target.src = UserPlaceholder;
  };
  const ProfileMenu = () => {
    return (
      <div className="user-menu">
        <img
          className="user-image"
          src={props.user.imageUrl}
          alt="Profile"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          onError={onImageError}
        />
        <div className={`profile-dropdown${showProfileMenu ? " open" : ""}`}>
          <div className="settings"></div>
          <img
            className="profile-dropdown__image"
            src={
              props.user.imageUrl === undefined
                ? UserPlaceholder
                : props.user.imageUrl
            }
            alt="Profile"
          />
          <div className="profile-dropdown__name">{props.user.name}</div>
          <div>{props.user.email}</div>
          <GoogleLogout
            clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
            buttonText={strings.navbar.logoutButtonText}
            onLogoutSuccess={logout}
            className="logout-button"
          ></GoogleLogout>
        </div>
      </div>
    );
  };

  const Settings = () => {
    return (
      <div className="settings">
        <div className="settings__theme">
          <label className="settings__theme-label">
            Theme:
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
          </label>
        </div>
        <div className="settings__language">
          <img
            alt="hungary"
            src={HungaryIcon}
            className="settings__language-icon"
          />
          <img
            alt="united-kingdom"
            src={UnitedKingdomIcon}
            className="settings__language-icon"
          />
        </div>
      </div>
    );
  };

  if (props.user) {
    return (
      <div className="navbar">
        {/* we only see the searchbar if we are at the homepage */}
        {props.page === "home" && <SearchBar onSearch={onSearch} />}
        {props.page === "topic" && (
          <div className="navbar__topic-details">
            <div className="navbar__topic-name">{props.topic.topicName}</div>
          </div>
        )}
        <div className="elements-to-end">
          <UserTopicsMenu />
          <Settings />
          <ProfileMenu />
        </div>
      </div>
    );
  } else {
    // if the user is null, redirect to login page
    return <Redirect to="/login" />;
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
