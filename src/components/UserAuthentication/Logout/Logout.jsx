// This component is a shallow one, and enable the user to logout from the site
// application, just redirect the user back to the search-page (Home-page)
// once the userAuthenticationLogoutStartSaga saga ends the process of
// logging-out the user from the site.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Routes from '../../../routes/routes';
import * as actions from '../../../store/actions/actions';

// Components parameter and functions PropTypes validations.
const propTypes = {
    onUserAuthenticationLogoutStart: PropTypes.func.isRequired
};

// Components default values.
const defaultProps = {};

// Dispatch functions from actions to reducers / sagas.
const mapDispatchToProps = (dispatch) => {
    return {
        onUserAuthenticationLogoutStart: () => dispatch(actions.onUserAuthenticationLogoutStart())
    };
};

class Logout extends Component {

    // Perform the userAuthenticationLogoutStartSaga saga.
    componentDidMount() {
        this.props.onUserAuthenticationLogoutStart();
    }

    // After the userAuthenticationLogoutStartSaga saga finished, redirect the user back to search-page (Home-page).
    render() {
        return (
            <Redirect to={Routes.SEARCH} />
        );
    }
}

// Set the PropTypes validations and default values.
Logout.propTypes = propTypes;
Logout.defaultProps = defaultProps;

export default connect(null, mapDispatchToProps)(Logout);