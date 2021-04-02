import React, { useState } from "react";
import { useHistory, Redirect, Link } from "react-router-dom";

// importing components
import { GoogleLogout } from "react-google-login";
import SearchBar from "./SearchBar";
import { connect } from "react-redux";

// importing language resource file
import strings from "../resources/strings";

// importing styles
import "../assets/css/Navbar.css";
import UserPlaceholder from "../assets/images/user.svg";

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

  if (props.user) {
    return (
      <div className="navbar">
        {/* we only see the searchbar if we are at the homepage */}
        {props.page === "home" && <SearchBar onSearch={onSearch} />}
        {props.page === "topic" && (
          <div className="navbar__topic-details">
            <div className="navbar__topic-name">{props.topicName}</div>
          </div>
        )}
        <div className="elements-to-end">
          <UserTopicsMenu />
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
    user: state.user,
    topicName: state.currentTopicName,
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
