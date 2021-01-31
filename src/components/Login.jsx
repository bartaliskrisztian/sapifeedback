import React, {useState} from "react";
import GoogleLogin from 'react-google-login';

function Login(props) {

    const [profileObj, setProfileObj] = useState({});

    const responseGoogleSuccess = (response) => {
        setProfileObj(response.profileObj);
        props.history.push("/home");
    }

    const responseGoogleFailure = (response) => {
        console.log(response);
    }

    return (
        <div className="login">
            <GoogleLogin 
                clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
                buttonText="Login with Google Account"
                onSuccess={responseGoogleSuccess}
                onFailure={responseGoogleFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    );
}

export default Login;