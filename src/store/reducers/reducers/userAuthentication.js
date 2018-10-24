// This file reducer contains the initial state of the user-authentication class and
// the user related parameters and properties, and contains all the
// functions that update the state, includes deep cloning to enable healthy
// status of the state. We update the state that related the user only by
// functions that implemented in this file reducer.

import * as actionTypes from '../../actions/actionTypes';
import * as enums from '../../../enums/enums';
import { updateObject } from '../../../utils/coreUtils';
import { initialState } from '../initialStates/userAuthentication';

// This reducer function resets the state to initial position and called when the page first load.
// Why we do this? Since the inputs of the state not erase when the user redirect to another page.
const onUserAuthenticationResetStateSuccess = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            userAuthenticationMode: enums.UserAuthenticationModeType.REGISTRATION,
            isLoading: false,
            emailText: '',
            passwordText: '',
            emailError: null,
            passwordError: null,
            generalError: null
        }
    });
};

// This reducer function track the changes of email / password inputs by
// updating the state each time ant of these inputs’ changes.
const onUserAuthenticationInputChangeSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            [`${action.userAuthenticationInputChangeData.textBoxType}Text`]: action.userAuthenticationInputChangeData.textBoxValue
        }
    });
};

// This reducer function updates the state after the user change
// the user-authentication mode was successful (Login to registration
// and via versa).
const onUserAuthenticationModeChangeSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            userAuthenticationMode: action.userAuthenticationMode,
            isLoading: false,
            emailText: '',
            passwordText: '',
            emailError: null,
            passwordError: null,
            generalError: null
        }
    });
};

// This reducer function runs after validation success, updates the state
// with loading to true so the user will see loading animation.
const onUserAuthenticationProcessPreparation = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isLoading: true,
            emailError: null,
            passwordError: null,
            generalError: null
        }
    });
};

// This reducer function updates the state when the validation failed
// with one of the inputs (Email or password). Clear any previous errors before that.
export const onUserAuthenticationProcessValidationError = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            emailError: null,
            passwordError: null,
            generalError: null,
            [`${action.userAuthenticationValidationErrorData.textBoxType}Error`]: action.userAuthenticationValidationErrorData.errorMessage
        }
    });
};

// This reducer function update the state after successful
// login / registration process with user credentials.
const onUserAuthenticationProcessSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            userAuthentication: action.userAuthentication,
            isLoading: false,
            emailText: '',
            passwordText: '',
            emailError: null,
            passwordError: null,
            generalError: null
        }
    });
};

// This reducer function updates the
// state when user failed to login / register.
const onUserAuthenticationProcessFail = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isLoading: false,
            emailText: '',
            passwordText: '',
            emailError: null,
            passwordError: null,
            generalError: action.errorMessage
        }
    });
};

// This reducer function updates the state (Clear all user-authentication credentials
// and bring back the userAuthenticationMode to registration) when logout was successful.
const onUserAuthenticationLogoutSuccess = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            userAuthentication: null,
            userAuthenticationMode: enums.UserAuthenticationModeType.REGISTRATION
        }
    });
};

// This reducer function switches case by the relevant action called.
const userReducer = (state = initialState, action) => {

    // Switch the action according to the type passed.
    switch (action.type) {
        case actionTypes.userAuthenticationActions.USER_AUTHENTICATION_RESET_STATE_SUCCESS:
            return onUserAuthenticationResetStateSuccess(state);
        case actionTypes.userAuthenticationActions.USER_AUTHENTICATION_INPUT_CHANGE_SUCCESS:
            return onUserAuthenticationInputChangeSuccess(state, action);
        case actionTypes.userAuthenticationActions.USER_AUTHENTICATION_MODE_CHANGE_SUCCESS:
            return onUserAuthenticationModeChangeSuccess(state, action);
        case actionTypes.userAuthenticationActions.USER_AUTHENTICATION_PROCESS_PREPARATION:
            return onUserAuthenticationProcessPreparation(state);
        case actionTypes.userAuthenticationActions.USER_AUTHENTICATION_PROCESS_VALIDATION_ERROR:
            return onUserAuthenticationProcessValidationError(state, action);
        case actionTypes.userAuthenticationActions.USER_AUTHENTICATION_PROCESS_SUCCESS:
            return onUserAuthenticationProcessSuccess(state, action);
        case actionTypes.userAuthenticationActions.USER_AUTHENTICATION_PROCESS_FAIL:
            return onUserAuthenticationProcessFail(state, action);
        case actionTypes.userAuthenticationActions.USER_AUTHENTICATION_LOGOUT_SUCCESS:
            return onUserAuthenticationLogoutSuccess(state);
        default:

            // If not match case found - Don't do anything.
            break;
    }

    // Return the updated state.
    return state;
};

export default userReducer;