// This file includes all the core logic that helps the user functions
// and utile, that are meant to be called from the user-authentication saga, to perform
// all actions needed. Functions like validate all inputs before login
// or registration operation. This file created to save space on the userAuthentication sagas
// itself and to keep it cleaner, and the long and repeatable logic
// to keep here, out of the sagas.

import settings from '../settings/application/settings';
import logicSettings from '../settings/logic/logicSettings';
import translate from '../translate/translate';
import * as enums from '../enums/enums';
import { getNumber } from '../utils/textUtils';
import { validateCharactersLength, validateEmail, validatePassword, validateNumber } from './validationUtils';
import * as storageUtils from './storageUtils';
import { getFunctionName } from '../utils/coreUtils';
import { toUserInstances } from '../modals/conversion/userInstances';

// This function gets all email searcher application's user-authentication credentials saved on localStorage.
const getUserAuthentication = () => {

    // Get all data in localStorage by init email search parameter.
    return Object.values(enums.UserParameter).reduce((acc, userParameter) => ({ ...acc, [userParameter]: storageUtils.getItem(userParameter) }), {});
};

// This function checks if the user is exists and is then check if the user is authenticated.
export const isUserAuthenticated = (userAuthentication) => {

    // If user object is not null, perform check within the
    // isUserAuthenticated method inside it. If empty - It's false.
    return userAuthentication ? userAuthentication.isUserAuthenticated() : false;
};

// This function verifies deep conditional authentication, for any action that their
// is a validation before / after calling the server to verify that only authenticated
// user allowed to call the server. We can say that this function is checking more
// deeply that the user is real is authenticated, by adding more checks on UserAuthentication
// instance class properties.
export const isUserVerifiedAuthentication = (userAuthentication) => {

    // Return deep check of user authentication result.
    return isUserAuthenticated(userAuthentication) || !userAuthentication.userId || !userAuthentication.userToken;
};

// This function sets all users properties of user-authentication credentials on localStorage.
export const setUserAuthentication = (userLocalStorageData) => {

    // Check existence of all required parameters. If one missing or invalid, don't process the operation.
    if (!userLocalStorageData || !userLocalStorageData.userId || !userLocalStorageData.userName || !userLocalStorageData.userToken ||
        !userLocalStorageData.userTokenExpirationDate || !validateNumber(userLocalStorageData.userEmailsTotalCount)) {

        // Stop any further actions.
        return;
    }

    // Set all data in localStorage by init email search parameter
    // (To not override other possible parameters or to be override).
    Object.values(enums.UserParameter).forEach(userParameter => {
        storageUtils.setItem(userParameter, userLocalStorageData[userParameter]);
    });
};

// This function creates an userLocalStorageData object converted from
// userInstances (Both userAuthentication and userEmails instances).
export const getUserLocalStorageData = (userInstances) => {

    // Check and validate the new instanced that has been created. If one missing don't process the operation.
    if (!userInstances || !userInstances.userAuthentication || !userInstances.userEmails) {

        // Stop any further actions.
        return;
    }

    // Create both userAuthentication and userEmails templates to send to save in state and localStorage.
    // Prepare the user-authentication to store in the localStorage and return it.
    return {
        userId: userInstances.userAuthentication.userId,
        userName: userInstances.userAuthentication.userName,
        userToken: userInstances.userAuthentication.userToken,
        userTokenExpirationDate: userInstances.userAuthentication.userTokenExpirationDate,
        userEmailsTotalCount: userInstances.userEmails.userEmailsTotalCount
    };
};

// This function gets data from localStorage if exists,
// Check if the user is authenticated (Usually after the browser is being refreshed).
export const setAuthentication = () => {

    // Return the authentication credentials that are stored in the localStorage (If exists).
    return toUserInstances(getUserAuthentication());
};

// Clear all localStorage of the application with specific data keys of user-authentication.
export const clearUserAuthentication = () => {

    // Clear all data in localStorage by init email search parameter.
    Object.values(enums.UserParameter).forEach(userItem => {
        storageUtils.removeItem(userItem);
    });
};

// This function generates a timeout delay in milliseconds for the user token expiration.
// After this time the user will logout from the system.
export const getTimeOutDelay = (expirationTime) => {

    // Will hold the default number in case no value is available.
    const defaultNumber = 0;

    // Validate the expirationTime parameter. If not exists, return default number.
    if (!expirationTime) {

        // Return zero as default number.
        return defaultNumber;
    }

    // Convert to a number and make sure the conversion is valid.
    expirationTime = getNumber({
        targetNumber: expirationTime,
        defaultNumber: defaultNumber
    });

    // Return the calculated result.
    return expirationTime * settings.apiUserAuthenticationTokenMillisecondsCount;
};

// This function validates the existence of email and password during both login or registration modes.
// Since the validation logic is identity in both processes, the best idea is to create this function to not repeat the code twice.
const validateLoginPassword = (userAuthenticationDataRequest) => {

    // Create base template result to return.
    const validationResult = {
        isValid: false,
        textBoxType: null,
        errorMessage: null,
        errorToConsole: null
    };

    // Validate existence of email parameter. If empty - Display a message to the user.
    if (!userAuthenticationDataRequest.emailText) {

        // Assign the text-box type.
        validationResult.textBoxType = enums.UserAuthenticationInputType.EMAIL;

        // Assign the error message to display the user.
        validationResult.errorMessage = translate.user_authentication_page_error_empty_email;

        // Return validation results.
        return validationResult;
    }

    // Validate existence of password parameter. If empty - Display a message to the user.
    if (!userAuthenticationDataRequest.passwordText) {

        // Assign the text-box type.
        validationResult.textBoxType = enums.UserAuthenticationInputType.PASSWORD;

        // Assign the error message to display the user.
        validationResult.errorMessage = translate.user_authentication_page_error_empty_password;
    }

    // Return the validation result.
    return validationResult;
};

// This function validates the email and password in case of login process.
export const validateLoginUserAuthenticationModeRequest = (userAuthenticationDataRequest) => {

    // Validate the email and password parameters.
    let validationResult = validateLoginPassword(userAuthenticationDataRequest);

    // Check that the validation result exists. If not, something went wrong.
    // Re-create the object and assign general error message.
    if (!validationResult) {

        // Create base template result to return.
        validationResult = {
            isValid: false,
            textBoxType: null,
            errorMessage: null,
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['validationResult'],
                functionName: getFunctionName()
            }
        };

        // Return the validation result.
        return validationResult;
    }

    // If any error validation exists from the login password validation,
    // no need to proceed. Return the validation results.
    if (validationResult.errorMessage) {

        // Return the validation result.
        return validationResult;
    }

    // Validate the email. If invalid, Display a message to the user.
    if (!validateEmail(userAuthenticationDataRequest.emailText)) {

        // Assign the text-box type.
        validationResult.textBoxType = enums.UserAuthenticationInputType.EMAIL;

        // Assign the error message to display the user.
        validationResult.errorMessage = translate.user_authentication_page_error_email_invalid;

        // Return the validation result.
        return validationResult;
    }

    // If all valid, set the result to true and return.
    validationResult.isValid = true;

    // Return the validation result.
    return validationResult;
};

// This function validates email and password in case of registration process.
export const validateRegistrationUserAuthenticationModeRequest = (userAuthenticationDataRequest) => {

    // Basic validation - Existence of parameters, before any other complex validation.

    // Validate the email and password parameters.
    let validationResult = validateLoginPassword(userAuthenticationDataRequest);

    // Check that the validation result exists. If not, something went wrong.
    // Re-create the object and assign general error message.
    if (!validationResult) {

        // Create base template result to return.
        validationResult = {
            isValid: false,
            textBoxType: null,
            errorMessage: null,
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['validationResult'],
                functionName: getFunctionName()
            }
        };

        // Return the validation result.
        return validationResult;
    }

    // If any error validation exists from the login password validation,
    // no need to proceed. Return the validation results.
    if (validationResult.errorMessage) {

        // Return the validation result.
        return validationResult;
    }

    // Email validation.

    // Check that the email is not exceeded maximum length. If invalid - Display a message to the user.
    if (!validateCharactersLength({
            value: userAuthenticationDataRequest.emailText,
            validationType: enums.ValidateCharactersType.MAXIMUM,
            charactersCount: logicSettings.maximumUserEmailLength
        })) {

        // Assign the text-box type.
        validationResult.textBoxType = enums.UserAuthenticationInputType.EMAIL;

        // Assign the error message to display the user.
        validationResult.errorMessage = translate.user_authentication_page_error_email_length_exceeds.replace('#count#', logicSettings.maximumUserEmailLength);

        // Return the validation result.
        return validationResult;
    }

    // Check that the email is not under minimum length. If invalid - Display a message to the user.
    if (!validateCharactersLength({
            value: userAuthenticationDataRequest.emailText,
            validationType: enums.ValidateCharactersType.MINIMUM,
            charactersCount: logicSettings.minimumUserEmailLength
        })) {

        // Assign the text-box type.
        validationResult.textBoxType = enums.UserAuthenticationInputType.EMAIL;

        // Assign the error message to display the user.
        validationResult.errorMessage = translate.user_authentication_page_error_email_length_under.replace('#count#', logicSettings.minimumUserEmailLength);

        // Return the validation result.
        return validationResult;
    }

    // Validate the email. If invalid - Display a message to the user.
    if (!validateEmail(userAuthenticationDataRequest.emailText)) {

        // Assign the text-box type.
        validationResult.textBoxType = enums.UserAuthenticationInputType.EMAIL;

        // Assign the error message to display the user.
        validationResult.errorMessage = translate.user_authentication_page_error_email_invalid;

        // Return the validation result.
        return validationResult;
    }

    // Password validation.

    // Check that the password is not exceeded maximum length. If invalid - Display a message to the user.
    if (!validateCharactersLength({
            value: userAuthenticationDataRequest.passwordText,
            validationType: enums.ValidateCharactersType.MAXIMUM,
            charactersCount: logicSettings.maximumUserPasswordLength
        })) {

        // Assign the text-box type.
        validationResult.textBoxType = enums.UserAuthenticationInputType.PASSWORD;

        // Assign the error message to display the user.
        validationResult.errorMessage = translate.user_authentication_page_error_password_length_exceeds.replace('#count#', logicSettings.maximumUserPasswordLength);

        // Return the validation result.
        return validationResult;
    }

    // Check that the password is not under minimum length. If invalid - Display a message to the user.
    if (!validateCharactersLength({
            value: userAuthenticationDataRequest.passwordText,
            validationType: enums.ValidateCharactersType.MINIMUM,
            charactersCount: logicSettings.minimumUserPasswordLength
        })) {

        // Assign the text-box type.
        validationResult.textBoxType = enums.UserAuthenticationInputType.PASSWORD;

        // Assign the error message to display the user.
        validationResult.errorMessage = translate.user_authentication_page_error_password_length_under.replace('#count#', logicSettings.minimumUserPasswordLength);

        // Return the validation result.
        return validationResult;
    }

    // Validate the password. If invalid - Display a message to the user.
    if (!validatePassword(userAuthenticationDataRequest.passwordText)) {

        // Assign the text-box type.
        validationResult.textBoxType = enums.UserAuthenticationInputType.PASSWORD;

        // Assign the error message to display the user.
        validationResult.errorMessage = translate.user_authentication_page_error_invalid_password;

        // Return the validation result.
        return validationResult;
    }

    // If all valid, set the result to true and return.
    validationResult.isValid = true;

    // Return the validation result.
    return validationResult;
};

// This function determines with method to send with the API request to the server (Login or registration).
export const getUserAPIMethodType = (userAuthenticationMode) => {

    // Select the function to call the API server for authentication, login or registration.
    let authenticationMethodType = null;
    switch (userAuthenticationMode) {
        case enums.UserAuthenticationModeType.LOGIN:
            authenticationMethodType = enums.UserAuthenticationAPIMethod.VERIFY_PASSWORD;
            break;
        case enums.UserAuthenticationModeType.REGISTRATION:
            authenticationMethodType = enums.UserAuthenticationAPIMethod.SIGNUP_NEW_USER;
            break;
        default:

            // If not match case found - Don't do anything.
            return;
    }

    // Return the authentication method needed for the Firebase API.
    return authenticationMethodType;
};

// This function generates the error message to display the user after API call returned an error.
export const getUserErrorMessage = (error) => {

    // Console the user the error message if needed (For developers).
    console.error(error);

    // Check if the parameter of the error is existing. If not, return general error.
    let errorMessage = translate.error_general;
    if (!error || !error.response || !error.response.data || !error.response.data.error || !error.response.data.error.message) {

        // Return the general error message.
        return errorMessage;
    }

    // Check if the error is a common error to display friendly message to the user.
    switch (error.response.data.error.message) {
        case enums.ErrorAuthenticationType.EMAIL_EXISTS:
            errorMessage = translate.user_authentication_page_error_email_exists;
            break;
        case enums.ErrorAuthenticationType.INVALID_EMAIL:
            errorMessage = translate.user_authentication_page_error_email_invalid;
            break;
        case enums.ErrorAuthenticationType.MISSING_PASSWORD:
            errorMessage = translate.user_authentication_page_error_empty_password;
            break;
        case enums.ErrorAuthenticationType.EMAIL_NOT_FOUND:
            errorMessage = translate.user_authentication_page_error_authentication_incorrect;
            break;
        default:
            errorMessage = error.response.data.error.message;
            break;
    }

    // Return the error message to the user.
    return errorMessage;
};