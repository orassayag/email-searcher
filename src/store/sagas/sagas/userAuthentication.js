// This file contains all user related saga, that include call to the API
// server to perform login and registration actions, and other related action sagas.

import { delay } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import translate from '../../../translate/translate';
import * as enums from '../../../enums/enums';
import * as apiUserAuthentication from '../../../api/routes/userAuthentication';
import * as actions from '../../actions/actions';
import * as userAuthenticationUtils from '../../../utils/userAuthenticationUtils';
import { validateEnumValue } from '../../../utils/validationUtils';
import { getFunctionName } from '../../../utils/coreUtils';
import { printErrorToConsole } from '../../../utils/textUtils';
import { toUserInstances } from '../../../modals/conversion/userInstances';
import { userGetEmailsTotalCountSaga } from '../sagas/userEmails';
import UISettings from '../../../settings/logic/UISettings';

// This saga function called when the user enter input on
// email / password text-boxes on user-authentication form.
export function* userAuthenticationInputChangeStartSaga(action) {

    // Check the existence of the userAuthenticationInputChangeData and textBoxType parameter.
    // If not exists - Show a message to the user and console error.
    if (!action.userAuthenticationInputChangeData || !action.userAuthenticationInputChangeData.textBoxType) {

        // Call the error saga to show error message to the user.
        // Assign the error details to print to the console.
        yield call(userAuthenticationErrorSaga, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['userAuthenticationInputChangeData', 'textBoxType'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Validate that the textBoxType is valid.
    // Check the validity of the textBoxType parameter. If invalid - Show a message to the user and console error.
    switch (action.userAuthenticationInputChangeData.textBoxType) {
        case enums.UserAuthenticationInputType.EMAIL:
        case enums.UserAuthenticationInputType.PASSWORD:
            break;
        default:

            // Assign the error details to print to the console.
            // Call the error saga to show error message to the user.
            yield call(userAuthenticationErrorSaga, {
                errorToConsole: {
                    errorType: enums.ErrorType.INVALID,
                    parameters: ['textBoxType'],
                    functionName: getFunctionName()
                }
            });

            // Stop any further actions.
            return;
    }

    // If all valid - Continue to change the state of emailText or passwordText.
    yield put(actions.onUserAuthenticationInputChangeSuccess(action.userAuthenticationInputChangeData));
}

// This saga function called when the user clicks
// on "login / register" link on the bottom of the user-authentication form.
export function* userAuthenticationModeChangeStartSaga(action) {

    // Display the loading animation.
    yield put(actions.onUserAuthenticationProcessPreparation());

    // Check the existence of the userAuthenticationMode parameter. If not exists - Show a message to the user and console error.
    if (!action.userAuthenticationMode) {

        // Assign the error details to print to the console.
        // Call the error saga to show error message to the user.
        yield call(userAuthenticationErrorSaga, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['userAuthenticationMode'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Validate that the userAuthenticationMode is valid. Check the validity of the userAuthenticationMode
    // parameter. If invalid - Show a message to the user and console error.
    if (!validateEnumValue({
        enum: enums.UserAuthenticationModeType,
        value: action.userAuthenticationMode
    })) {

        // Assign the error details to print to the console.
        // Call the error saga to show error message to the user.
        yield call(userAuthenticationErrorSaga, {
            errorType: enums.ErrorType.INVALID,
            parameters: ['userAuthenticationMode'],
            functionName: getFunctionName()
        });

        // Stop any further actions.
        return;
    }

    // Delay for fade-in effect look & feel.
    yield delay(UISettings.userAuthenticationSwitchModeDelay);

    // If all valid - Continue to change the state of userAuthenticationMode. The delay is for the fade-in animation.
    yield put(actions.onUserAuthenticationModeChangeSuccess(action.userAuthenticationMode));
}

// This saga function called to handles in case the user decides to logout from the application.
export function* userAuthenticationLogoutStartSaga() {

    // Preform redirect to search-page (Home-page).
    yield call(userLogoutSuccessSaga);
}

// This saga function called to set a delay and after that time logout the user (After the user token is expired).
export function* userAuthenticationCheckTimeoutStartSaga(action) {

    // Delay time for user token expiration.
    yield delay(userAuthenticationUtils.getTimeOutDelay(action.userTokenExpirationTime));

    // Preform redirect to search-page (Home-page).
    yield call(userLogoutSuccessSaga);
}

// This saga function called to handle the login / registration process.
export function* userAuthenticationProcessStartSaga(action) {

    // Check for existence of the userAuthenticationData parameter. If not found - Show an error message to the user.
    if (!action.userAuthenticationData) {

        // Assign the error details to print to the console.
        // Call the error saga to show error message to the user.
        yield call(userAuthenticationErrorSaga, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['userAuthenticationData'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Create the data to validate and to send and API request.
    const userAuthenticationDataRequest = {
        userAuthenticationMode: action.userAuthenticationData.userAuthenticationMode,
        emailText: action.userAuthenticationData.emailText,
        passwordText: action.userAuthenticationData.passwordText,
        apiMethod: userAuthenticationUtils.getUserAPIMethodType(action.userAuthenticationData.userAuthenticationMode)
    };

    // Validate the email and the password parameters before any call to the API (Client-side validation).
    // If empty result - There was a general error not related to the validation, just return.
    const validationResult = yield call(validateAuthenticationProcessSaga, userAuthenticationDataRequest);
    if (!validationResult) {

        // Assign the error details to print to the console.
        // Call the error saga to show error message to the user.
        yield call(userAuthenticationErrorSaga, {
            errorToConsole: {
                errorType: enums.ErrorType.INVALID,
                parameters: ['validationResult'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // If the validation failed to pass - Generate the error of the problematic text-box.
    if (!validationResult.isValid) {

        // Call the error saga to show error message to the user.
        yield put(actions.onUserAuthenticationProcessValidationError(validationResult));

        // Stop any further actions.
        return;
    }

    // Validate the authentication API method type.
    if (!userAuthenticationDataRequest.apiMethod) {

        // Assign the error details to print to the console.
        // Call the error saga to show error message to the user.
        yield call(userAuthenticationErrorSaga, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['apiMethod'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Prepare the user-authentication process to start - Show the user a loading animation.
    yield put(actions.onUserAuthenticationProcessPreparation());

    // Will hold the response from the server.
    let response = null;

    try {

        // Call the API to perform login / registration.
        response = yield call(apiUserAuthentication.userAuthentication, userAuthenticationDataRequest);

    } catch (error) {

        // Error may occur due:
        // General error / Service unavailable / Username or password incorrect (On login process) / Email already exists (On registration process) in the database.
        // Assign the error details to print to the console.
        const errorMessage = yield call(userAuthenticationUtils.getUserErrorMessage, error);

        // Call the error saga to show error message to the user.
        yield put(actions.onUserAuthenticationProcessFail(errorMessage));

        // Stop any further actions.
        return;
    }

    // Validate the existence of received parameters on the response from the API server.
    // In case of no response - Show general error message to the user and console the error.
    if (!response || !response.data || !response.data.idToken || !response.data.localId || !response.data.expiresIn) {

        // Assign the error details to print to the console.
        // Call the error saga to show error message to the user.
        yield call(userAuthenticationErrorSaga, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['response', 'response.data', 'response.data.idToken', 'response.data.localId', 'response.data.expiresIn'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // At this point we know that the login / registration process was successful.

    // If the user just logged-in, get the total number of his emails from the database.
    // If the userAuthenticationMode is register process - The default emails count is 0.
    // ToDo: In Node.js API bring its altogether.
    let userEmailsTotalCount = 0;
    if (action.userAuthenticationData.userAuthenticationMode === enums.UserAuthenticationModeType.LOGIN) {

        // Check if the results exists. If not - Something went wrong - Display error message to the user.
        const userEmailsTotalCountResult = yield call(userGetEmailsTotalCountSaga, {
            userAuthentication: {
                userId: response.data.localId,
                userToken: response.data.idToken
            }
        });

        // Check the validity of the result.
        if (!userEmailsTotalCountResult) {

            // Assign the error details to print to the console.
            // Call the error saga to show error message to the user.
            yield call(userAuthenticationErrorSaga, {
                errorToConsole: {
                    errorType: enums.ErrorType.MISSING,
                    parameters: ['userEmailsTotalCountResult'],
                    functionName: getFunctionName()
                }
            });

            // Stop any further actions.
            return;
        }

        // Check if error exists from the API server call. If so - Something went wrong.
        // Display error message to the user and print to console.
        if (userEmailsTotalCountResult.errorMessage) {

            // Call the error saga to show error message to the user.
            yield call(userAuthenticationErrorSaga, userEmailsTotalCountResult);

            // Stop any further actions.
            return;
        }

        // Assign the update emails total count.
        userEmailsTotalCount = userEmailsTotalCountResult.userEmailsTotalCount;
    }

    // Create the UserAuthentication and UserEmails instances and save it on state and localStorage.
    const userInstances = yield call(toUserInstances, {
        userId: response.data.localId,
        userName: action.userAuthenticationData.emailText,
        userPassword: action.userAuthenticationData.passwordText,
        userToken: response.data.idToken,
        userTokenExpireInSeconds: response.data.expiresIn,
        userTokenExpirationDate: null,
        userEmailsTotalCount: userEmailsTotalCount
    });

    // Create userLocalStorageData instance template to save into the state and to localStorage.
    const userLocalStorageData = yield call(userAuthenticationUtils.getUserLocalStorageData, userInstances);

    // Set all the data to localStorage.
    yield call(userAuthenticationUtils.setUserAuthentication, userLocalStorageData);

    // Preform success action (Remove any error and redirect the user to search-page (Home-page)).
    // Set the userAuthentication and the userEmails class instances in state.
    yield call(userLoginSuccessSaga, userInstances);

    // Check if the user token already expired (Need to be false, of course).
    yield put(actions.onUserAuthenticationCheckTimeout(response.data.expiresIn));
}

// This saga function called to check if the user is authenticated each time the application raise.
export function* userAuthenticationCheckStateStartSaga() {

    // Get result is the user is authenticated or not.
    const userInstances = yield call(userAuthenticationUtils.setAuthentication);

    // Validate existence of result. Is invalid - Logout the user.
    if (!userInstances || !userInstances.userAuthentication || !userInstances.userEmails) {

        // Something went wrong - Perform logout operation as default action.
        yield call(userLogoutSuccessSaga);

        // Stop any further actions.
        return;
    }

    // Check if the user is authenticated (If refreshed by the browser and has credentials data saved on localStorage).
    if (userInstances.userAuthentication.isUserAuthenticated()) {

        // Set credentials and the emails count back to the state from localStorage.
        yield call(userLoginSuccessSaga, userInstances);

        // Renew the delay time of the user token by the time left since user got the user token.
        yield put(actions.onUserAuthenticationCheckTimeout(userInstances.userAuthentication.getUserTokenLeftTime()));

    } else {

        // If user is not authenticated - Just in case - Delete any credentials may be stored.
        // And perform redirect to search-page (Home-page) if not there.
        yield call(userLogoutSuccessSaga);
    }
}

// This inner saga function called to handle all the actions need to be called after the user
// logout from the site (Or his user authentication token has been expired).
function* userLogoutSuccessSaga() {

    // Clear any credential from localStorage.
    yield call(userAuthenticationUtils.clearUserAuthentication);

    // Clear the state of the userAuthentication class instance.
    yield put(actions.onUserAuthenticationLogoutSuccess());

    // Clear the state of the userEmails class instance.
    yield put(actions.onUserEmailsAuthenticationLogoutSuccess());
}

// This inner saga function called to handle all the actions need to be called after the user
// logged-in / register to the site (Or even after a refresh of the browser
// after successful authentication operation and logged-in to the site).
function* userLoginSuccessSaga(userInstances) {

    // Set the userEmails class instance in state.
    yield put(actions.onUserEmailsAuthenticationProcessSuccess(userInstances.userEmails));

    // Set the userAuthentication class instance in state.
    yield put(actions.onUserAuthenticationProcessSuccess(userInstances.userAuthentication));
}

// This inner saga function called to validate the email and the
// password parameters before any call to the API (Client-side validation).
function* validateAuthenticationProcessSaga(userAuthenticationDataRequest) {

    // Will hold the final validation result.
    let validationResult = null;

    // Go to the validation function according to the userAuthenticationMode parameter.
    switch (userAuthenticationDataRequest.userAuthenticationMode) {
        case enums.UserAuthenticationModeType.LOGIN:
            validationResult = yield call(userAuthenticationUtils.validateLoginUserAuthenticationModeRequest, userAuthenticationDataRequest);
            break;
        case enums.UserAuthenticationModeType.REGISTRATION:
            validationResult = yield call(userAuthenticationUtils.validateRegistrationUserAuthenticationModeRequest, userAuthenticationDataRequest);
            break;
        default:

            // In case no mode is selected - Throw exception.
            // Assign the error details to print to the console.
            yield call(userAuthenticationErrorSaga, {
                errorToConsole: {
                    errorType: enums.ErrorType.INVALID,
                    parameters: ['userAuthenticationMode'],
                    functionName: getFunctionName()
                }
            });

            // Stop any further actions.
            return;
    }

    // Return result validation.
    return validationResult;
}

// This inner saga function called to handle any case of error on user-authentication process.
function* userAuthenticationErrorSaga(userAuthenticationErrorData) {

    // Validate for existence of userAuthenticationErrorData parameter. If not exists - Don't do nothing.
    if (!userAuthenticationErrorData) {

        // Assign the error details to print to the console.
        // Print the error to the console.
        yield call(printErrorToConsole, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['userAuthenticationErrorData'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;

    }

    // Print error message to the console.
    yield call(printErrorToConsole, userAuthenticationErrorData);

    // Display an error message to the user.
    yield put(actions.onUserAuthenticationProcessFail(translate.error_general));
}