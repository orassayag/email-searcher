// This file contains all user emails related saga, that include call to the API
// server to perform get emails and delete emails actions, and add email to the user emails
// list, get the user emails count and other related action sagas.

import { delay } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import translate from '../../../translate/translate';
import logicSettings from '../../../settings/logic/logicSettings';
import * as enums from '../../../enums/enums';
import * as apiUserEmails from '../../../api/routes/userEmails';
import * as userEmailsUtils from '../../../utils/userEmailsUtils';
import * as actions from '../../actions/actions';
import { getFunctionName } from '../../../utils/coreUtils';
import { printErrorToConsole, getObjectKeysLength } from '../../../utils/textUtils';
import { validateArrayItems, validateAPIResponse } from '../../../utils/validationUtils';
import { toUserEmails } from '../../../modals/conversion/userEmails';
import { toManageEmail } from '../../../modals/conversion/manageEmail';
import UserEmailsTotalCountResult from '../../../modals/helpers/UserEmailsTotalCountResult';

// This saga function called to handle the user emails count process.
export function* userGetEmailsTotalCountSaga(action) {

    // Will hold the final results of the user emails count. The default is 0.
    const userEmailsTotalCountResult = new UserEmailsTotalCountResult();

    // Validate the existence of parameters. If not exists, generates an error.
    if (!action.userAuthentication || !action.userAuthentication.userId || !action.userAuthentication.userToken) {

        // Assign the error details to print to the console.
        userEmailsTotalCountResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['userAuthentication', 'userId', 'userToken'],
            functionName: getFunctionName()
        };

        // Return the emails total count result.
        return userEmailsTotalCountResult;
    }

    // Will hold the response from the server.
    let response = null;

    try {

        // Call the API to get the user emails count from the server.
        response = yield call(apiUserEmails.getUserEmails, action);

    } catch (error) {

        // Error may occur due:
        // General error / Service unavailable / User not exists / User not logged-in.
        // Assign the error details to print to the console.
        userEmailsTotalCountResult.errorObject = error;

        // Return the emails total count result.
        return userEmailsTotalCountResult;
    }

    // Validate the existence of received parameters on the response from the API server.
    // In case of no response - Show general error message to the user and console the error.
    if (!validateAPIResponse(response)) {

        // Assign the error details to print to the console.
        userEmailsTotalCountResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['response', 'response.data'],
            functionName: getFunctionName()
        };

        // Return the email's total count result.
        return userEmailsTotalCountResult;
    }

    // Set the emails count from the server and return the result.
    userEmailsTotalCountResult.userEmailsTotalCount = getObjectKeysLength(response.data);

    // Return the email's total count result.
    return userEmailsTotalCountResult;
}

// This inner saga function called to handle the operation of getting the updated user emails total count
// of his emails list, from the API server database, and update it on the state and on localStorage.
function* updateUserEmailsCountSaga(action) {

    // Check if the results exists. If not - Something went wrong - Display error message to the user.
    let userEmailsTotalCountResult = yield call(userGetEmailsTotalCountSaga, action);

    // Check the existence of the userEmailsTotalCountResult parameter.
    if (!userEmailsTotalCountResult) {

        // Return details error to the caller of the function.
        userEmailsTotalCountResult = new UserEmailsTotalCountResult();

        // Assign the error details to the console.
        userEmailsTotalCountResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['userEmailsTotalCountResult'],
            functionName: getFunctionName()
        };

        // Return details error to the caller of the function with the specific error details to the console.
        return userEmailsTotalCountResult;
    }

    // Check the validity of the result (That there is any error occurred).
    if (userEmailsTotalCountResult.errorToConsole || userEmailsTotalCountResult.errorObject) {

        // Return details error to the caller of the function with the specific error details to the console.
        return userEmailsTotalCountResult;
    }

    // Update the user emails count in the state.
    yield put(actions.onUserUpdateEmailsTotalCountSuccess(userEmailsTotalCountResult.userEmailsTotalCount));

    // Update the user emails total count on the localStorage.
    yield call(userEmailsUtils.setUserEmailsTotalCount, userEmailsTotalCountResult.userEmailsTotalCount);

    // Return the result.
    return userEmailsTotalCountResult;
}

// This saga function called to handle the adding email to the user's emails
// list both on state and the API server and database.
export function* userAddEmailToDatabaseProcessStartSaga(action) {

    // Will hold the saga response error. We will insert the new email and
    // call the server to bring back the update user emails count, and update it on localStorage and state.
    // If this error will be assign - It will display a message to the user.
    // Will hold the user emails count. The default is 0.
    let userEmailsTotalCountResult = new UserEmailsTotalCountResult();

    // Will hold the response from the server.
    let response = null;

    try {

        // Call the API to perform the add user email to the server.
        response = yield call(apiUserEmails.addUserEmail, action);

    } catch (error) {

        // Error may occur due:
        // General error / Service unavailable / Email not exists / Email already added / User not logged-in.
        // Assign the error details to print to the console.
        userEmailsTotalCountResult.errorObject = error;

        // Return the emails total count result.
        return userEmailsTotalCountResult;
    }

    // Validate the existence of received parameters on the response from the API server.
    // In case of no response - Show general error message to the user and console the error.
    if (!validateAPIResponse(response)) {

        // Assign the error details to print to the console.
        userEmailsTotalCountResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['response', 'response.data'],
            functionName: getFunctionName()
        };

        // Return the emails total count result.
        return userEmailsTotalCountResult;
    }

    // At this point the email was successfully added to the user email's list on the database.
    // Now we need to call the server to bring the updated user's emails count.

    // Check if the results exists. If not - Something went wrong - Display error message to the user.
    userEmailsTotalCountResult = yield call(userGetEmailsTotalCountSaga, action);

    // Check the existence of the userEmailsTotalCountResult parameter. If not exists print error to console.
    if (!userEmailsTotalCountResult) {

        // Re-create the object if not exists.
        userEmailsTotalCountResult = new UserEmailsTotalCountResult();

        // Assign the error details to print to the console.
        userEmailsTotalCountResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['userEmailsTotalCountResult'],
            functionName: getFunctionName()
        };

        // Return the emails total count result.
        return userEmailsTotalCountResult;
    }

    // Update the user emails count in the state.
    yield put(actions.onUserUpdateEmailsTotalCountSuccess(userEmailsTotalCountResult.userEmailsTotalCount));

    // Update the user emails total count on the localStorage.
    yield call(userEmailsUtils.setUserEmailsTotalCount, userEmailsTotalCountResult.userEmailsTotalCount);

    // Return the result.
    return userEmailsTotalCountResult;
}

// This saga function called to handle the process of getting the user emails list from the API
// server database, and update it on the stat to display the emails list to
// the user on user-emails page.
export function* userGetEmailsProcessStartSaga(action) {

    // If it's first load, Update the state that the component is mounted.
    if (action.getUserEmailsData.isFirstPageLoad) {

        // Call the first load reducer action to update the state with component is mounted to true.
        yield put(actions.onUserGetEmailsProcessFirstLoadPreparation());
    }

    // Will hold the final results of the validation.
    const validationResult = yield call(userEmailsUtils.validateGetUserEmails, action.getUserEmailsData);

    // Check if validationResult exists. If there it's not exists -
    // Print it to console and show the user general error message.
    if (!validationResult) {

        // Assign the error details to print to the console,
        // and call the error saga to display error message to the user.
        yield call(userGetEmailsProcessErrorSaga, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['validationResult'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Check if there is unexpected error from the validationResult object and error fields.
    // If there is - Print it to console and show the user general error message.
    if (validationResult.errorType || validationResult.parameters || validationResult.functionName) {

        // Call the error saga to display general error to the user.
        yield call(userGetEmailsProcessErrorSaga(validationResult));

        // Stop any further actions.
        return;
    }

    // Check if total count of emails is 0. If so, don't do nothing -
    // An appropriate message will be displayed on the page instead of the emails list.
    // Just turn off the loading animation.
    if (action.getUserEmailsData.userEmails.userEmailsTotalCount <= 0) {

        // Call the no emails saga to display general message to the user.
        yield put(actions.onUserGetEmailsProcessNoEmailsSuccess());

        // Stop any further actions.
        return;
    }

    // Check that if is first load, generate new UserEmails instance with
    // default configurations but with the current total emails count.
    if (action.getUserEmailsData.isFirstPageLoad) {

        // Create new instance of userEmails to reset all the settings configurations of the page.
        action.getUserEmailsData.userEmails = yield call(toUserEmails, {
            userEmailsTotalCount: action.getUserEmailsData.userEmails.userEmailsTotalCount
        });
    }

    // Call the preparation saga to show the user the loading animation.
    yield put(actions.onUserGetEmailsProcessPreparation());

    // Will hold the response from the server.
    let response = null;

    try {

        // Call the API to get the user emails list from the server.
        response = yield call(apiUserEmails.getUserEmails, action.getUserEmailsData);

    } catch (error) {

        // Error may occur due:
        // General error / Service unavailable / User not exists.

        // Assign the error details to print to the console,
        // and call the error saga to display error message to the user.
        yield call(userGetEmailsProcessErrorSaga, {
            errorObject: error
        });

        // Stop any further actions.
        return;
    }

    // Validate the existence of received parameters on the response from the API server.
    // In case of no response - Show general error message to the user and console the error.
    if (!validateAPIResponse(response)) {

        // Assign the error details to print to the console,
        // and call the error saga to display error message to the user.
        yield call(userGetEmailsProcessErrorSaga, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['response', 'response.data'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Prepare the emails from database for conversion.
    action.getUserEmailsData.emailsDataBase = response.data;

    // Calculate the current relevant results according to pager and count and return it.
    const getUserEmailsResultData = yield call(userEmailsUtils.getUserEmails, action.getUserEmailsData);

    // Update the UserEmails on the state with all the updated configurations and current
    // relevant emails to display according to the pager and counter.
    yield put(actions.onUserGetEmailsProcessSuccess(getUserEmailsResultData));

    // Update the user emails total count on the localStorage.
    yield call(userEmailsUtils.setUserEmailsTotalCount, getUserEmailsResultData.totalEmailsCount);
}

// This inner saga function called to handle any case of error on get emails process.
function* userGetEmailsProcessErrorSaga(userGetEmailsErrorData) {

    // Check if userGetEmailsErrorData object parameter exists.
    // If not - Re-create one and assign error details.
    if (!userGetEmailsErrorData) {

        // Assign the error details to print to the console.
        yield call(printErrorToConsole, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['userGetEmailsErrorData'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Print the error with all the relevant details to the console.
    yield call(printErrorToConsole, userGetEmailsErrorData);

    // Call the reducer to update the state with error
    // message and to display the user general error message
    yield put(actions.onUserGetEmailsProcessFail());
}

// This saga function called when user the clicks on the email row item on
// the user-emails page, when he wants to hide / show the email's "More
// information" panel, on toggle operation.
export function* userToggleEmailMoreInformationStartSaga(action) {

    // Validate all parameters and preform the toggle
    // action on the specific email the user selected.
    const validationResult = yield call(userEmailsUtils.toggleEmailMoreInformationPanel, action.toggleEmailData);

    // If no validation results exist for the validation results is invalid, don't do nothing.
    if (!validationResult) {

        // Print error to the console and don't do nothing.
        // Assign the error details to print to the console.
        yield call(printErrorToConsole, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['validationResult', 'validationResult.isValid'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Check if to ignore the action and not processed to toggle the more information panel.
    // (In case that the user clicked on the X icon to delete email item on the corner of the email row).
    if (validationResult.ignoreAction) {

        // Stop any further actions.
        return;
    }

    // Update the state with an updated emails list to
    // the userEmails instance on the state.
    yield put(actions.onUserToggleEmailMoreInformationSuccess(validationResult.emails));
}

// This inner saga function called to handle the validation results of both userCounterUpdateStartSaga
// and userPagerUpdateStartSaga sagas, since their logic are the same.
function* userActionValidationResultStartSaga(validationResult) {

    // Check if validationResult exists. If there it's not exists -
    // Print it to console and show the user general error message.
    if (!validationResult) {

        // Print error to the console and don't do nothing.
        // Assign the error details to print to the console.
        yield call(userGetEmailsProcessErrorSaga, {
            errorToConsole: {
                errorType: enums.ErrorType.INVALID,
                parameters: ['validationResult'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return false;
    }

    // Check if there is unexpected error from the validationResult object and all the error fields.
    // If there is - Print it to console and show the user general error message.
    if (validationResult.errorType || validationResult.parameters || validationResult.functionName) {

        // Call the error saga to show error message to the user.
        yield call(userGetEmailsProcessErrorSaga(validationResult));

        // Stop any further actions.
        return false;
    }

    // Check if update state is needed. If not, don't do anything.
    if (!validationResult.isUpdateState) {

        // Stop any further actions.
        return false;
    }

    // If all valid, return true.
    return true;
}

// This saga function called to handles the update of emails count to display on
// user-emails page when the user updates the count on the top
// of the page within a drop down select.
export function* userCounterUpdateStartSaga(action) {

    // Validate the counter update parameters.
    const validationResult = yield call(userEmailsUtils.userCounterUpdate, action.userCounterUpdateData);

    // Check if the validation results is valid.
    const isValid = yield call(userActionValidationResultStartSaga, validationResult);

    // Check if the validation results are valid or not. If invalid don't do anything.
    if (!isValid) {

        // If invalid result, stop any further actions.
        return;
    }

    // Call the userGetEmailsProcessStartSaga saga with updated counter to display relevant emails.
    // Also, reset the current page number to start.
    yield call(userGetEmailsProcessStartSaga, {
        getUserEmailsData: {
            userAuthentication: action.userCounterUpdateData.userAuthentication,
            userEmails: action.userCounterUpdateData.userEmails,
            isFirstPageLoad: false,
            updatedPagerValue: 1,
            updatedCounterValue: validationResult.newCounterValue
        }
    });
}

// This saga function called to handles the update of emails pager to display on
// user-emails page when the user clicks on the pager number
// navigation link on the bottom of the page.
export function* userPagerUpdateStartSaga(action) {

    // Validate the pager update parameters.
    const validationResult = yield call(userEmailsUtils.userPagerUpdate, action.userPagerUpdateData);

    // Check if the validation results is valid.
    const isValid = yield call(userActionValidationResultStartSaga, validationResult);

    // Check if the validation results are valid or not. If invalid don't do anything.
    if (!isValid) {

        // If invalid result, stop any further actions.
        return;
    }

    // Call the userGetEmailsProcessStartSaga saga with updated pager to display relevant emails.
    yield call(userGetEmailsProcessStartSaga, {
        getUserEmailsData: {
            userAuthentication: action.userPagerUpdateData.userAuthentication,
            userEmails: action.userPagerUpdateData.userEmails,
            isFirstPageLoad: false,
            updatedPagerValue: validationResult.newPagerValue,
            updatedCounterValue: null
        }
    });
}

// This saga function called when the user clicks on the X icon next to each email row on user-emails
// The modal will be open with all relevant details that is about to be deleted from users’ emails list.
export function* userDeleteEmailModalToggleStartSaga(action) {

    // Validate all parameters and fetch the relevant email to show on the delete email modal.
    const validationResult = yield call(userEmailsUtils.validateToggleManageEmailModal, action.toggleDeleteEmailModalData);

    // Validate existence of validationResult instance. If missing - User clicked on the X icon to
    // delete email modal, or something is wrong, don't display the modal to the user.
    // Either cases - Hide the delete email modal window.
    if (!validationResult) {

        // Print error details to the console.
        // Assign the error details to print to the console.
        yield call(printErrorToConsole, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['validationResult'],
                functionName: getFunctionName()
            }
        });

        // Call the toggle saga to don't display anything.
        yield put(actions.onUserDeleteEmailModalToggleSuccess({
            isShowModal: false,
            deleteEmail: toManageEmail()
        }));

        // Stop any further actions.
        return;
    }

    // Validate existence of validationResult parameters / or exists error parameters.
    // If missing or error message exists - User clicked on the X icon to
    // delete email modal, or something is wrong, don't display the modal to the user.
    // Either cases - Hide the delete email modal window.
    if (!validationResult.emailId || !validationResult.emailAddress || validationResult.errorType ||
        (validateArrayItems(validationResult.parameters)) || validationResult.functionName) {

        // Print error details to the console.
        yield call(printErrorToConsole, validationResult);

        // Call the toggle saga to don't display anything.
        yield put(actions.onUserDeleteEmailModalToggleSuccess({
            isShowModal: false,
            deleteEmail: toManageEmail()
        }));

        // Stop any further actions.
        return;
    }

    // Call the success toggle action to raise up the delete email modal window.
    yield put(actions.onUserDeleteEmailModalToggleSuccess({
        isShowModal: true,
        deleteEmail: toManageEmail({
            emailId: validationResult.emailId,
            emailAddress: validationResult.emailAddress,
            errorMessage: null
        })
    }));
}

// This saga function called to run when the user clicks on "Delete" button on
// the delete email modal window - To delete an email from his emails list.
export function* userDeleteEmailProcessStartSaga(action) {

    // Prepare the validation data to send the validation message and
    // validate all parameters and rules before send an API request.
    let validationResult = yield call(userEmailsUtils.validateDeleteEmailRequest, action.deleteEmailData);

    // if no result from validation - Something went wrong
    // - Generate default validationResult object.
    if (!validationResult) {

        // Add console error to the object for the delete email error saga.
        // Create empty validation results object.
        validationResult = {};

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['validationResult'],
            functionName: getFunctionName()
        };

        // Call the error saga to show general error message to the user and console the error.
        yield call(userDeleteEmailFailSaga, validationResult);

        // Stop any further actions.
        return;
    }

    // Check if any error exists (In console).
    // If the validation failed to pass, generate the error within the userDeleteEmailFailSaga.
    if (!validationResult.emailItem || validationResult.errorToConsole || validationResult.errorMessage) {

        // Call the error saga to show general error message to the user and console the error.
        yield call(userDeleteEmailFailSaga, validationResult);

        // Stop any further actions.
        return;
    }

    // Show the user the loading animation before calling the API server.
    yield put(actions.onUserDeleteEmailProcessPreparation());

    // Call the user add email saga to update the database and the userEmailsTotalCount.
    validationResult = yield call(userDeleteEmailFromDatabaseProcessStartSaga, {
        userAuthentication: action.deleteEmailData.userAuthentication,
        emailItem: validationResult.emailItem
    });

    // Check the validity of the results from the delete user email from database saga.
    // if no result from validation - Something went wrong - Generate default validationResult object.
    if (!validationResult) {

        // Create empty validation results object.
        validationResult = {};

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['validationResult'],
            functionName: getFunctionName()
        };

        // Call the error saga to show general error message to the user and console the error.
        yield call(userDeleteEmailFailSaga, validationResult);

        // Stop any further actions.
        return;
    }

    // Check if any error exists (In console).
    // If the validation failed to pass, generate the error within the userDeleteEmailFailSaga.
    if (validationResult.errorToConsole || validationResult.errorMessage) {

        // Call the error saga to show general error message to the user and console the error.
        yield call(userDeleteEmailFailSaga, validationResult);

        // Stop any further actions.
        return;
    }

    // Call the success saga to update the user emails list.
    yield call(userDeleteEmailSuccessSaga, {
        ...action.deleteEmailData,
        userEmailsTotalCount: validationResult.userEmailsTotalCount
    });
}

// This saga function called to handle the deleting email to the user's emails
// list both on state and the API server and database.
// After that - Update the user total emails count from the database.
export function* userDeleteEmailFromDatabaseProcessStartSaga(action) {

    // Will hold the saga response error. We will call the Firebase database to get the top Id
    // (Json object name) of the records we want to delete, and within it, to delete the
    // specific emails from the database. So, we get the Id from the database and
    // call the server to delete the specific email from the database.

    // Will hold the response from the server.
    let getEmailIdResponse = null;

    try {

        // Call the API to perform the get the top Id of the email from the server database.
        getEmailIdResponse = yield call(apiUserEmails.getFirebaseTopEmailId, action);

    } catch (error) {

        // Error may occur due:
        // General error / Service unavailable / User not exists / User not logged-in.
        // Assign the error details to print to the console.
        yield call(userDeleteEmailFailSaga, {
            errorObject: error,
            errorToConsole: null
        });

        // Stop any further actions.
        return;
    }

    // Validate the existence of received parameters on the response from the API server.
    // In case of no response - Show general error message to the user and console the error.
    if (!validateAPIResponse(getEmailIdResponse)) {

        // Assign the error details to print to the console.
        // Call the error saga to show error message to the user.
        yield call(userDeleteEmailFailSaga, {
            errorObject: null,
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['getEmailIdResponse', 'getEmailIdResponse.data'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Get all the keys of the emails.
    const emailsKeys = Object.keys(getEmailIdResponse.data);

    // Check that there are keys exists with the giver email Id.
    // If not exists, show an error message to the user.
    if (!validateArrayItems(emailsKeys)) {

        // Assign the error details to print to the console.
        // Call the error saga to show error message to the user.
        yield call(userDeleteEmailFailSaga, {
            errorObject: null,
            errorToConsole: {
                errorType: enums.ErrorType.INVALID,
                parameters: ['emailsKeys'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Will hold the response from the server.
    let deleteResponse = null;

    try {

        // Call the API to perform the delete user email from the server database.
        deleteResponse = yield call(apiUserEmails.deleteUserEmail, {
            userAuthentication: action.userAuthentication,
            emailId: emailsKeys[0] // Get the first top emailId from the database response.
        });

    } catch (error) {

        // Error may occur due:
        // General error / Service unavailable / Email not exists / Email already deleted / User not logged-in.
        // Assign the error details to print to the console.
        yield call(userDeleteEmailFailSaga, {
            errorObject: error,
            errorToConsole: null
        });

        // Stop any further actions.
        return;
    }

    // Validate the existence of received parameters (And validity of status code 200 to confirm
    // the delete operation was successful) on the response from the API server.
    // In case of no response - Show general error message to the user and console the error.
    if (!deleteResponse || !deleteResponse.status || deleteResponse.status !== 200) {

        // Call the error saga to show general error message to the user and console the error.
        yield call(userDeleteEmailFailSaga, {
            errorObject: null,

            // Assign the error details to print to the console.
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['deleteResponse', 'deleteResponse.status'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // At this point the email was successfully deleted from the user email's list on the database.
    // Now we need to call the server to bring the updated user's emails count.
    const userEmailsTotalCountResult = yield call(updateUserEmailsCountSaga, action);

    // Check the existence of the userEmailsTotalCountResult results.
    if (!userEmailsTotalCountResult) {

        // Call the error saga to show general error message to the user and console the error.
        yield call(userDeleteEmailFailSaga, {
            errorObject: null,

            // Assign the error details to print to the console.
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['userEmailsTotalCountResult'],
                functionName: getFunctionName()
            }
        });
    }

    // Return the updated user total emails count to continue the parent saga.
    return userEmailsTotalCountResult;
}

// This inner saga function called when there is an error from the API
// server when trying to delete emails from user's emails list -
// Show a general error message to the user and close the modal.
function* userDeleteEmailFailSaga(deleteEmailFailData) {

    // Check if validation results object parameter exists.
    // If not - Re-create one and assign error details.
    if (!deleteEmailFailData) {

        // Assign the error details to print to the console.
        yield call(printErrorToConsole, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['deleteEmailFailData'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Print error to the console if exists one.
    yield call(printErrorToConsole, deleteEmailFailData);

    // Call the failure process action, to display general error message to the user.
    yield put(actions.onUserDeleteEmailProcessError(translate.error_general));

    // Delay for 5 seconds to let the user see the error message.
    yield delay(5000);

    // Call the success toggle action to hide the delete email modal window.
    yield put(actions.onUserDeleteEmailModalToggleReset());
}

// This inner saga function called when the email was successfully deleted from user's emails list.
// Close the modal, and fade out the selected email.
function* userDeleteEmailSuccessSaga(deleteEmailData) {

    // Prepare the updated emails list.
    let validationResult = userEmailsUtils.setManageEmailAction({
        emailActionType: enums.EmailActionType.DELETED,
        emails: deleteEmailData.userEmails.userEmailsList,
        emailId: deleteEmailData.emailId
    });

    // Check if validation results object parameter exists.
    // If not - Re-create one and assign error details.
    if (!validationResult) {

        // Create empty validation results object.
        validationResult = {};

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['validationResult'],
            functionName: getFunctionName()
        };

        // Call the fail saga to display error message to the user.
        yield call(userDeleteEmailFailSaga, validationResult);

        // Stop any further actions.
        return;
    }

    // If any error to console exists - The validation operation failed.
    // Print the error to the console and show a message to the user.
    // If no emails - There was an error, call the searchAddEmailFailSaga.
    if (validationResult.errorToConsole || !validationResult.emails) {

        // Print the error to the console.
        yield call(printErrorToConsole, validationResult);

        // Call the fail saga to display error message to the user.
        // Assign the error details to print to the console.
        yield call(userDeleteEmailFailSaga,
            validationResult.errorToConsole = {
                errorType: enums.ErrorType.MISSING,
                parameters: ['emails'],
                functionName: getFunctionName()
            });

        // Stop any further actions.
        return;
    }

    // Assign the updated data to userEmails instance.
    deleteEmailData.userEmails.userEmailsTotalCount = deleteEmailData.userEmailsTotalCount;
    deleteEmailData.userEmails.userEmailsList = validationResult.emails;

    // Close the modal window and reset all parameters.
    yield put(actions.onUserDeleteEmailModalToggleReset());

    // Will hold information data about continue of the saga actions.
    const reloadData = {

        // This field will determine if to just perform a "fade-out" effect of the email,
        // or to refresh the hole page (After a logic settings number of delete emails
        // the page needs to be refreshed). Default is false.
        isReloadThePage: false,

        // This field will hold the current updated pager value, if the page is to be
        // reloaded, it may be needed to reset to the beginning default value. The default
        // is the current pager page that the user is placed.
        updatedPagerValue: deleteEmailData.userEmails.userEmailsCurrentPageNumber
    };

    // There is a logic to refresh the page each logic settings number of deletes,
    // and check for emails left in a pager page. If user don't have pager (Less then
    // a logic settings number of emails), no need for the logic.
    if (deleteEmailData.userEmailsTotalCount >= logicSettings.minimumEmailsCountToShowPager) {

        // Since delete email don't effect on pager / counter, we want to initialize the
        // page after some time of deleting emails. So, the logic is that after a number
        // from logic settings exceeded, deletes without refresh the page, there will be
        // render of the page automatically. This logic applies only if the user has more
        // than total number from logic settings of emails.
        let updatedDeletedEmailsCount = deleteEmailData.userEmails.userEmailsDeletedCount + 1;
        if (updatedDeletedEmailsCount > (logicSettings.emailsCountToRefreshPage - 1) || (deleteEmailData.userEmails.userEmailsTotalCount - 1) <= 0) {

            // The page needs to be reloaded.
            reloadData.isReloadThePage = true;
        }

        // Also, check if after delete there are still active emails remains in the
        // page, if not, refresh the page, and reset the current page to start.
        // Also, if the number of emails left not fit the pager, render the page again.
        const emailsCount = validationResult.emails.filter(email => {
            return email.emailActionType !== enums.EmailActionType.DELETED;
        });

        // Check that any emails that are not in the action type of "deleted" left.
        // If not, refresh the page and reset the pager number.
        if (emailsCount.length <= 0 || (validationResult.userEmailsTotalCount % deleteEmailData.userEmails.userEmailsCountPerPage <= 0 &&
                deleteEmailData.userEmails.userEmailsCurrentPageNumber === 1)) {

            // The page needs to be reloaded.
            reloadData.isReloadThePage = true;

            // Reset the current page number to start.
            reloadData.updatedPagerValue = 1;
        }

        // Assign more updated data to userEmails instance.
        deleteEmailData.userEmails.userEmailsCurrentPageNumber = reloadData.updatedPagerValue;
        deleteEmailData.userEmails.userEmailsDeletedCount = updatedDeletedEmailsCount;
    }

    // Check if the page needs to be reloaded.
    if (reloadData.isReloadThePage) {

        // Reset the delete emails count.
        deleteEmailData.userEmails.userEmailsDeletedCount = 0;

        // Call the userGetEmailsProcessStartSaga saga with updated pager to display relevant emails.
        // Also, reset the current page (If needed) number to start.
        yield call(userGetEmailsProcessStartSaga, {
            getUserEmailsData: {
                userAuthentication: deleteEmailData.userAuthentication,
                userEmails: deleteEmailData.userEmails,
                isFirstPageLoad: false,
                updatedPagerValue: reloadData.updatedPagerValue,
                updatedCounterValue: null
            }
        });

    } else {

        // If no need to reload the page - Preform fade-out effect and
        // remove the email from the list, and update the emails list in the state.

        // After shot time of delay, close the modal window and mark fade-out the deleted email.
        yield delay(100);

        // Update the email as deleted on the email's list.
        yield put(actions.onUserDeleteEmailProcessSuccess(deleteEmailData.userEmails));
    }
}