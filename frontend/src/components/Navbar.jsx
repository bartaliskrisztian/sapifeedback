import React, { useState, useEffect } from "react";
import { useHistory, Redirect, Link, useParams } from "react-router-dom";

// importing components
import { GoogleLogout } from "react-google-login";
import SearchBar from "./SearchBar";
import { connect } from "react-redux";

// importing language resource file
import stringRes from "../resources/strings";

// importing styles
import "../assets/css/Navbar.css";
import UserPlaceholder from "../assets/images/user.svg";

function Navbar({ props, dispatch }) {
  const history = useHistory();

  let language = process.env.REACT_APP_LANGUAGE;
  let strings = stringRes[language];

  // whether to show the profile menu or not
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const params = useParams(); // hook for getting the url's parameters

  useEffect(() => {
    if (props.page === "topic") {
      const temp = window.location.hash.split("/");
      const pageType = temp[temp.length - 1];
      changeMenuColor(pageType);
    }
    // eslint-disable-next-line
  }, [window.location.hash]);

  const onSearch = (e) => {
    dispatch({ type: "SET_SEARCHTEXT", payload: e.target.value });
  };

  // on logout we set the user to null and redirect the page
  const logout = () => {
    history.push("/login");
    dispatch({ type: "SET_USER", payload: null });
  };

  // based on the page type, we change the background of the option buttons
  const changeMenuColor = (topicPage) => {
    let temp = document.getElementById("topic-menu__container");
    if (!temp) {
      return;
    }
    let elements = Array.from(temp.children);
    elements.forEach((element) => {
      if (element.id === topicPage) {
        element.style.background = "#3a3b3c";
      } else {
        element.style.background = "#242526";
      }
    });
  };

  const Menus = () => {
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

  const ProfileMenu = () => {
    return (
      <div className="user-menu">
        <img
          className="user-image"
          src={
            props.user.imageUrl === undefined
              ? UserPlaceholder
              : props.user.imageUrl
          }
          alt="Profile"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
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

  const topicOptions = strings.topic.menus;

  if (props.user) {
    return (
      <div className="navbar">
        {/* we only see the searchbar if we are at the homepage */}
        {props.page === "home" && <SearchBar onSearch={onSearch} />}
        {props.page === "topic" && (
          <div className="topic-name">{props.topicName}:</div>
        )}
        {props.page === "topic" && (
          <div className="topic-menu__container" id="topic-menu__container">
            {topicOptions.map((menu, index) => (
              <a
                className="topic-menu"
                id={menu.value}
                key={index}
                href={`/#/topic/${params.userId}/${params.topicId}/${menu.value}`}
              >
                {menu.name}
              </a>
            ))}
          </div>
        )}
        <Menus />
        <ProfileMenu />
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
