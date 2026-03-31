// This container is responsible for the login and registration process of the user
// to the site application. In this page the user can switch between modes, and to
// login or register to the site. The user must enter a valid email and password to
// enter the site and enable him to search / view / add / remove emails in the site.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Routes from '../../routes/routes';
import * as actions from '../../store/actions/actions';
import * as enums from '../../enums/enums';
import translate from '../../translate/translate';
import { isUserAuthenticated } from '../../utils/userAuthenticationUtils';
import userAuthenticationShape from '../../models/proptypes/userAuthentication';
import { Auxiliary } from '../../hoc';
import { PageTitle } from '../../components/UI';
import { RegisterLogin } from '../../components/UserAuthentication';

// Components parameter and functions PropTypes validations.
const propTypes = {
    history: PropTypes.object,
    userAuthentication: userAuthenticationShape,
    userAuthenticationMode: PropTypes.string.isRequired,
    emailText: PropTypes.string,
    passwordText: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    generalError: PropTypes.string,
    emailError: PropTypes.string,
    passwordError: PropTypes.string,
    onUserAuthenticationResetStateSuccess: PropTypes.func.isRequired,
    onUserAuthenticationProcessStart: PropTypes.func.isRequired,
    onUserAuthenticationInputChangeStart: PropTypes.func.isRequired,
    onUserAuthenticationModeChangeStart: PropTypes.func.isRequired
};

// Components default values.
const defaultProps = {
    history: null,
    userAuthentication: null,
    emailText: '',
    passwordText: '',
    generalError: '',
    emailError: '',
    passwordError: ''
};

// State properties from sagas.
const mapStateToProps = (state) => {
    return {
        userAuthentication: state.userAuthentication.userAuthentication,
        userAuthenticationMode: state.userAuthentication.userAuthenticationMode,
        emailText: state.userAuthentication.emailText,
        passwordText: state.userAuthentication.passwordText,
        isLoading: state.userAuthentication.isLoading,
        generalError: state.userAuthentication.generalError,
        emailError: state.userAuthentication.emailError,
        passwordError: state.userAuthentication.passwordError
    };
};

// Dispatch functions from actions to reducers / sagas.
const mapDispatchToProps = (dispatch) => {
    return {
        onUserAuthenticationResetStateSuccess: () => dispatch(actions.onUserAuthenticationResetStateSuccess()),
        onUserAuthenticationProcessStart: (userAuthenticationData) => dispatch(actions.onUserAuthenticationProcessStart(userAuthenticationData)),
        onUserAuthenticationInputChangeStart: (userAuthenticationInputChangeData) => dispatch(actions.onUserAuthenticationInputChangeStart(userAuthenticationInputChangeData)),
        onUserAuthenticationModeChangeStart: (userAuthenticationMode) => dispatch(actions.onUserAuthenticationModeChangeStart(userAuthenticationMode))
    };
};

// Represent the user-authentication page to login / register the user into the system.
class UserAuthentication extends Component {

    constructor(props) {
        super(props);

        // Bind all the functions.
        this.handleUserAuthenticationModeChangeClick = this.handleUserAuthenticationModeChangeClick.bind(this);
        this.handleUserAuthenticationInputChange = this.handleUserAuthenticationInputChange.bind(this);
    }

    // This life-cycle handler method checks if the user is
    // authenticated and reset all the state on load of the page.
    componentDidMount() {

        // Take the scoped props.
        const { props } = this;

        // If user is authenticated (After login or registration) redirect back to search-page (Home-page).
        if (isUserAuthenticated(props.userAuthentication)) {

            // Redirect to search-page (Home-page).
            props.history.push(Routes.SEARCH);
        }

        // Reset all states (If old state exists).
        props.onUserAuthenticationResetStateSuccess();
    }

    // This handler method tracks the changes of email / password inputs.
    handleUserAuthenticationInputChange = (e) => {

        // Create the userAuthenticationInputChangeData to send and start the onUserAuthenticationProcessStart saga.
        this.props.onUserAuthenticationInputChangeStart({
            textBoxType: e.currentTarget.dataset.id,
            textBoxValue: e.target.value
        });
    }

    // This handler method handles the submit click button on the login / registration form.
    // After all validation succeeded - Load and make after successful call to API
    // (Login / Registration) and redirect to search-page (Home-page).
    handleUserAuthenticationLoginRegisterClick = (e) => {

        // Stop any default actions.
        e.preventDefault();

        // Take the scoped props.
        const { props } = this;

        // Create the userAuthenticationData to send and start the onUserAuthenticationProcessStart saga.
        // Start the onUserAuthenticationProcessStart saga.
        props.onUserAuthenticationProcessStart({
            userAuthenticationMode: props.userAuthenticationMode,
            emailText: props.emailText,
            passwordText: props.passwordText
        });
    }

    // This handler method handles the click of changing the mode of
    // user-authentication (Login to registration and vice versa).
    handleUserAuthenticationModeChangeClick = (e) => {

        // Stop any default actions.
        e.preventDefault();

        // Start the onUserAuthenticationModeChangeStart saga with the opposite value of the Id that has been clicked.
        this.props.onUserAuthenticationModeChangeStart(e.currentTarget.dataset.id ===
            enums.UserAuthenticationModeType.LOGIN ? enums.UserAuthenticationModeType.REGISTRATION : enums.UserAuthenticationModeType.LOGIN);
    }

    render() {

        // Take the scoped props. Can be split into specific props, but due to saving memory, we can avoid this.
        const { props } = this;

        return (
            <Auxiliary>
                <PageTitle title={translate[`user_authentication_page_${props.userAuthenticationMode}_title`]} />
                <RegisterLogin
                    isLoading={props.isLoading}
                    userAuthenticationMode={props.userAuthenticationMode}
                    generalError={props.generalError}
                    emailError={props.emailError}
                    passwordError={props.passwordError}
                    onUserAuthenticationLoginRegisterClick={this.handleUserAuthenticationLoginRegisterClick}
                    onUserAuthenticationInputChange={this.handleUserAuthenticationInputChange}
                    onUserAuthenticationModeChangeClick={this.handleUserAuthenticationModeChangeClick}
                />
            </Auxiliary>
        );
    }
}

// Set the PropTypes validators and default values.
UserAuthentication.propTypes = propTypes;
UserAuthentication.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserAuthentication);