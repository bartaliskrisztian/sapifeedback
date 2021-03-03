import React from "react";
import { useHistory } from "react-router-dom";
import GoogleLogin from 'react-google-login';
import Logo from "../assets/images/logo.svg";
import stringRes from "../resources/strings";
import "../assets/css/Login.css";

function Login(props) {

    let history = useHistory();
    let language = process.env.REACT_APP_LANGUAGE;
    let strings = stringRes[language];
    
    // if the login is successful, set the user and go to homepage
    const responseGoogleSuccess = (response) => {
        props.setUser(response.profileObj);
        history.push("/");
    }

    const responseGoogleFailure = (response) => {
        console.log(response);
    }

    return (
        <div className="login">
            <img 
                src={Logo} 
                alt="logo" 
                className="login-logo"
            />
            <GoogleLogin 
                clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
                buttonText={strings.login.loginButtonText}
                onSuccess={responseGoogleSuccess}
                onFailure={responseGoogleFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={false}
                className="login-button"
            />
        </div>
    );
}

export default Login;