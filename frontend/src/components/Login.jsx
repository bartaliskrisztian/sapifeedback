import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

// importing components
import GoogleLogin from "react-google-login";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Settings from "./Settings";
import { withNamespaces } from "react-i18next";
import { apiPostRequest } from "../api/utils";

// importing styles
import "../assets/css/Login.css";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/images/logo.svg";

function Login({ t, props, dispatch }) {
  let history = useHistory();
  const [topicId, _setTopicId] = useState("");
  const topicIdRef = useRef(topicId);
  const setTopicId = (data) => {
    topicIdRef.current = data;
    _setTopicId(data);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEnterPressed);
    // cleanup this component
    return () => {
      window.removeEventListener("keydown", handleEnterPressed);
    };
    // eslint-disable-next-line
  }, []);

  const handleEnterPressed = (e) => {
    let key = e.keyCode || e.which;
    if (key === 13) {
      goToFeedbackPage();
    }
  };

  const notifyError = (message) => toast.error(message);

  // if the login is successful, set the user and go to homepage
  const responseGoogleSuccess = (response) => {
    dispatch({ type: "SET_USER", payload: response.profileObj });
    apiPostRequest("login", JSON.stringify(response.profileObj)).then(
      (response) => {
        if (response.result === "Error") {
          notifyError(response.result);
        } else {
          history.push("/");
        }
      },
      (reject) => {
        notifyError(reject);
      }
    );
  };

  const responseGoogleFailure = (response) => {
    console.log(response);
  };

  const onSearch = (e) => {
    setTopicId(e.target.value);
  };

  const goToFeedbackPage = () => {
    if (topicIdRef.current !== "") {
      history.push(`/giveFeedback/${topicIdRef.current}`);
    }
  };

  return (
    <div className="login-page">
      <Settings page="login" />
      <div className="login-page__header">
        <img src={Logo} alt="logo" className="login-logo" />
        <div className="login-page__title">{t("Feedback app")}</div>
      </div>
      <div className="login-page__content">
        <div className="login-page__login">
          <div className="login-page__login-title">
            {t("Log in, then create topics for getting feedbacks")}
          </div>
          <GoogleLogin
            clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
            buttonText={t("Sign up or log in with Google Account")}
            onSuccess={responseGoogleSuccess}
            onFailure={responseGoogleFailure}
            cookiePolicy={"single_host_origin"}
            isSignedIn={true}
            theme={props.theme === "light" ? "dark" : "light"}
            className="login-button"
            redirectUri={`${process.env.REACT_APP_FRONTEND_URL}/#/`}
          />
        </div>
        <div className="login-page__feedback">
          <div className="login-page__feedback-title">
            {t("Enter a topic ID and give a feedback anonymously")}
          </div>
          <div className="login-page__feedback-inputs">
            <input
              type="text"
              onChange={onSearch}
              className="login-page__input"
              placeholder={t("Topic ID")}
            />
            <button
              className="login-page__submit-button"
              onClick={goToFeedbackPage}
            >
              {t("Go")}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        pauseOnHover={false}
        hideProgressBar={true}
        autoClose={1500}
        closeOnClick={false}
        limit={1}
      />
    </div>
  );
}

// getting the global state variables with redux
const mapStateToProps = (state) => {
  const props = {
    theme: state.appTheme,
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
)(withNamespaces()(Login));
