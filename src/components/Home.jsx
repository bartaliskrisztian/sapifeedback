import React, {useEffect} from "react";
import UserTopics from "./UserTopics";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from "react-redux";

function Home({isLoggedIn, dispatch}) {

    useEffect(() => {
        if(!isLoggedIn) {
            notifyLoggingIn();
            dispatch({type: "SET_IS_LOGGED_IN", payload: true});
        }
        // eslint-disable-next-line
    }, []);

    const notifyLoggingIn = () => toast.info("Sikeres bejelentkezés.");

    return (
        <div className="home">
            <UserTopics />
            <ToastContainer 
                position="top-center"
                pauseOnHover={false}
                hideProgressBar={true}
                autoClose={3000}
                closeOnClick={false}
            />
        </div>
    );
}

const mapStateToProps = (state) => {
    const isLoggedIn = state.isLoggedIn;
    return { isLoggedIn }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);