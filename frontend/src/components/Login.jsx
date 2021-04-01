import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

// importing components
import GoogleLogin from "react-google-login";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import strings from "../resources/strings"; // importing language resource file

// importing styles
import "../assets/css/Login.css";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/images/logo.svg";

function Login({ isLoggedIn, dispatch }) {
  let history = useHistory();

  useEffect(() => {
    if (isLoggedIn) {
      // notifying the user about logging out
      notifyLoggingOut();
      dispatch({ type: "SET_IS_LOGGED_IN", payload: false });
    }
    // eslint-disable-next-line
  }, []);

  const notifyLoggingOut = () => toast.info(strings.logoutSuccess);

  // if the login is successful, set the user and go to homepage
  const responseGoogleSuccess = (response) => {
    dispatch({ type: "SET_USER", payload: response.profileObj });
    history.push("/");
  };

  const responseGoogleFailure = (response) => {
    console.log(response);
  };

  return (
    <div className="login">
      <img src={Logo} alt="logo" className="login-logo" />
      <GoogleLogin
        clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
        buttonText={strings.login.loginButtonText}
        onSuccess={responseGoogleSuccess}
        onFailure={responseGoogleFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
        className="login-button"
      />
      <ToastContainer
        position="top-center"
        pauseOnHover={false}
        hideProgressBar={true}
        autoClose={1500}
        closeOnClick={false}
      />
    </div>
  );
}

// getting the global state variables with redux
const mapStateToProps = (state) => {
  const isLoggedIn = state.isLoggedIn;
  return { isLoggedIn };
};

// getting redux dispatch function for changing global state variables
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
