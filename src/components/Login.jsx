import React from "react";
import { useHistory } from "react-router-dom";
import GoogleLogin from 'react-google-login';
import Logo from "../assets/images/logo.svg";
import "../assets/css/Login.css";

function Login(props) {

    let history = useHistory();

    const responseGoogleSuccess = (response) => {
        props.setUser(response.profileObj);
        history.push("/home");
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
                buttonText="Login with Google Account"
                onSuccess={responseGoogleSuccess}
                onFailure={responseGoogleFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
                className="login-button"
            />
        </div>
    );
}

export default Login;