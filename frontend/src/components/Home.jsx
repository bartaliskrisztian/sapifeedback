import React, { useEffect } from "react";
// importing components
import UserTopics from "./UserTopics";
import { connect } from "react-redux";
import { withNamespaces } from "react-i18next";

function Home({ t, isLoggedIn, dispatch }) {
  useEffect(() => {
    // on rendering we notify the user about successful login with a toast
    if (!isLoggedIn) {
      dispatch({ type: "SET_IS_LOGGED_IN", payload: true });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="home">
      <UserTopics />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(Home));
