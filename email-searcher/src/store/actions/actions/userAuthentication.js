// This file implement all user related action functions of the store
// to enable navigating both to the reducer to update directly the state
// without any necessary logic, and to a specific the sagas to perform
// some action or validation and also from there to call other
// sagas or reducers.

import * as actionTypes from '../actionTypes';

// This action function is called when any page first loads to
// reset all the user-authentication state inputs and settings.
export const onUserAuthenticationResetStateSuccess = () => {
    return {
        type: actionTypes.userAuthenticationActions.USER_AUTHENTICATION_RESET_STATE_SUCCESS
    };
};

// This action function called when any input changed start
// to change (Email or password) on the user-authentication page.
export const onUserAuthenticationInputChangeStart = (userAuthenticationInputChangeData) => {
    return {
        type: actionTypes.userAuthenticationActions.USER_AUTHENTICATION_INPUT_CHANGE_START,
        userAuthenticationInputChangeData: userAuthenticationInputChangeData
    };
};

// This action function called when any input changed
// successfully (Email or password) on the user-authentication page.
export const onUserAuthenticationInputChangeSuccess = (userAuthenticationInputChangeData) => {
    return {
        type: actionTypes.userAuthenticationActions.USER_AUTHENTICATION_INPUT_CHANGE_SUCCESS,
        userAuthenticationInputChangeData: userAuthenticationInputChangeData
    };
};

// This action function called when user-authentication mode link
// clicked (Login or Registration) on user-authentication page.
export const onUserAuthenticationModeChangeStart = (userAuthenticationMode) => {
    return {
        type: actionTypes.userAuthenticationActions.USER_AUTHENTICATION_MODE_CHANGE_START,
        userAuthenticationMode: userAuthenticationMode
    };
};

// This action function called when user-authentication mode changed
// successfully (Login or registration) on user-authentication page.
export const onUserAuthenticationModeChangeSuccess = (userAuthenticationMode) => {
    return {
        type: actionTypes.userAuthenticationActions.USER_AUTHENTICATION_MODE_CHANGE_SUCCESS,
        userAuthenticationMode: userAuthenticationMode
    };
};

// This action function is called when the user clicks on
// login / registration button on user-authentication form.
export const onUserAuthenticationProcessStart = (userAuthenticationData) => {
    return {
        type: actionTypes.userAuthenticationActions.USER_AUTHENTICATION_PROCESS_START,
        userAuthenticationData: userAuthenticationData
    };
};

// This action function called after validation was successfully
// passed on the user-authentication process, this action call.
export const onUserAuthenticationProcessPreparation = () => {
    return {
        type: actionTypes.userAuthenticationActions.USER_AUTHENTICATION_PROCESS_PREPARATION
    };
};

// This action function called if the validation failed in any
// of the inputs on the user-authentication process, this action called.
export const onUserAuthenticationProcessValidationError = (userAuthenticationValidationErrorData) => {
    return {
        type: actionTypes.userAuthenticationActions.USER_AUTHENTICATION_PROCESS_VALIDATION_ERROR,
        userAuthenticationValidationErrorData: userAuthenticationValidationErrorData
    };
};

// This action function called after the user-authentication
// process (Login or registration) was completed successfully.
export const onUserAuthenticationProcessSuccess = (userAuthentication) => {
    return {
        type: actionTypes.userAuthenticationActions.USER_AUTHENTICATION_PROCESS_SUCCESS,
        userAuthentication: userAuthentication
    };
};

// This action function is called when the user tries to login and
// enter the wrong email or password, this action is called.
export const onUserAuthenticationProcessFail = (errorMessage) => {
    return {
        type: actionTypes.userAuthenticationActions.USER_AUTHENTICATION_PROCESS_FAIL,
        errorMessage: errorMessage
    };
};

// This action function is called each time there is a need to
// check the validity of the user-authentication token expiration time.
export const onUserAuthenticationCheckTimeout = (userTokenExpirationTime) => {
    return {
        type: actionTypes.userAuthenticationActions.USER_AUTHENTICATION_CHECK_TIMEOUT_START,
        userTokenExpirationTime: userTokenExpirationTime
    };
};

// This action function is called when the application raises
// to check if the user is authenticated or not.
export const onUserAuthenticationCheckState = () => {
    return {
        type: actionTypes.userAuthenticationActions.USER_AUTHENTICATION_CHECK_STATE_START
    };
};

// This action function is called when the user clicks on the
// logout tab and wants to logout from the application.
export const onUserAuthenticationLogoutStart = () => {
    return {
        type: actionTypes.userAuthenticationActions.USER_AUTHENTICATION_LOGOUT_START
    };
};

// This action function called when the logout
// process completed successfully.
export const onUserAuthenticationLogoutSuccess = () => {
    return {
        type: actionTypes.userAuthenticationActions.USER_AUTHENTICATION_LOGOUT_SUCCESS
    };
};