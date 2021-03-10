import React, {useEffect} from "react";

// importing components
import UserTopics from "./UserTopics";
import { ToastContainer, toast } from 'react-toastify';
import { connect } from "react-redux";

// importing language resource file
import stringRes from "../resources/strings";

// importing styles
import 'react-toastify/dist/ReactToastify.css';

function Home({isLoggedIn, dispatch}) {

    let language = process.env.REACT_APP_LANGUAGE;
    let strings = stringRes[language];

    useEffect(() => {
        // on rendering we notify the user about successful login with a toast
        if(!isLoggedIn) {
            notifyLoggingIn();
            dispatch({type: "SET_IS_LOGGED_IN", payload: true});
        }
        // eslint-disable-next-line
    }, []);

    const notifyLoggingIn = () => toast.info(strings.loginSuccess);

    return (
        <div className="home">
            <UserTopics />
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
    return { isLoggedIn }
}

// getting redux dispatch function for changing global state variables
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);