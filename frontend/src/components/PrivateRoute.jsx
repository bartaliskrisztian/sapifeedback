import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

function PrivateRoute({ props }) {
  return props.user ? (
    <Route path={props.path} exact={props.exact} component={props.component} />
  ) : (
    <Redirect to="/login" />
  );
}

// getting the global state variables with redux
const mapStateToProps = (state, ownProps) => {
  const props = {
    path: ownProps.path,
    exact: ownProps.exact,
    component: ownProps.component,
    user: state.user,
  };
  return { props };
};

export default connect(mapStateToProps)(PrivateRoute);
