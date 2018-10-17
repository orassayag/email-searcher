// This file implement all user related action functions of the store
// to enable navigating both to the reducer to update directly the state
// without any necessary logic, and to a specific the sagas to preform
// some action or validation and also from there maybe to call other
// sagas or reducers.

import * as actionTypes from '../actionTypes';

// This action function called when the login / registration processes are
// successfully preformed and the user is now logged in to the system.
export const onUserEmailsAuthenticationProcessSuccess = (userEmails) => {
    return {
        type: actionTypes.userEmailsActions.USER_EMAILS_AUTHENTICATION_PROCESS_SUCCESS,
        userEmails: userEmails
    };
};

// This action function called when the logout process is
// successfully preformed and the user is now logged out from the system.
export const onUserEmailsAuthenticationLogoutSuccess = () => {
    return {
        type: actionTypes.userEmailsActions.USER_EMAILS_AUTHENTICATION_LOGOUT_SUCCESS
    };
};

// This action function called when all the validations passed and the process of
// adding the email to the user's emails list is ready to go on search-page (Home-page).
export const onUserAddEmailProcessStart = (userAddEmailData) => {
    return {
        type: actionTypes.userEmailsActions.USER_ADD_EMAIL_PROCESS_START,
        userAddEmailData: userAddEmailData
    };
};

// This action function called after the new email added successfully to the user
// email’s list and there is a need to update the user emails count on the state.
export const onUserUpdateEmailsTotalCountSuccess = (userEmailsTotalCount) => {
    return {
        type: actionTypes.userEmailsActions.USER_UPDATE_EMAILS_TOTAL_COUNT_SUCCESS,
        userEmailsTotalCount: userEmailsTotalCount
    };
};

// This action function to perform a call to the getting user emails saga, to load the
// user emails and display them in the user-emails page.
export const onUserGetEmailsProcessStart = (getUserEmailsData) => {
    return {
        type: actionTypes.userEmailsActions.USER_GET_EMAILS_PROCESS_START,
        getUserEmailsData: getUserEmailsData
    };
};

// This action function called when there are no emails for the user on his emails
// list and there is a need to display a message on the user-emails about it.
export const onUserGetEmailsProcessNoEmailsSuccess = () => {
    return {
        type: actionTypes.userEmailsActions.USER_GET_EMAILS_PROCESS_NO_EMAILS_SUCCESS
    };
};

// This action function called when the first time of the user-emails
// page is loaded, to update the mounted property.
export const onUserGetEmailsProcessFirstLoadPreparation = () => {
    return {
        type: actionTypes.userEmailsActions.USER_GET_EMAILS_PROCESS_FIRST_LOAD_PREPARATION
    };
};

// This action function called before the call to the API server database to load
// the user emails and display them. It displays a loading animation to the user.
export const onUserGetEmailsProcessPreparation = () => {
    return {
        type: actionTypes.userEmailsActions.USER_GET_EMAILS_PROCESS_PREPARATION
    };
};

// This action function called when the getting user emails process failed due to
// unexpected error, and display a general error message to the user.
export const onUserGetEmailsProcessFail = () => {
    return {
        type: actionTypes.userEmailsActions.USER_GET_EMAILS_PROCESS_FAIL
    };
};

// This action function called when getting user emails operation process was successfully
// established and to display the user emails from his list on the user-emails page.
export const onUserGetEmailsProcessSuccess = (getUserEmailsResultData) => {
    return {
        type: actionTypes.userEmailsActions.USER_GET_EMAILS_PROCESS_SUCCESS,
        getUserEmailsResultData: getUserEmailsResultData
    };
};

// This action function called when the user clicks on an email row item to display full
// details about the email, and start the saga to validate the full email data.
export const onUserToggleEmailMoreInformationStart = (toggleEmailData) => {
    return {
        type: actionTypes.userEmailsActions.USER_TOGGLE_EMAIL_MORE_INFORMATION_START,
        toggleEmailData: toggleEmailData
    };
};

// This action function called when the "More information" panel was successfully
// toggled on the user-emails page, to show / hide the full information
// about the email row item.
export const onUserToggleEmailMoreInformationSuccess = (emails) => {
    return {
        type: actionTypes.userEmailsActions.USER_TOGGLE_EMAIL_MORE_INFORMATION_SUCCESS,
        emails: emails
    };
};

// This action function called when the user updates the counter drop down select
// on the top of the user-emails page, to change the number of email items to display.
export const onUserCounterUpdateStart = (userCounterUpdateData) => {
    return {
        type: actionTypes.userEmailsActions.USER_COUNTER_UPDATE_START,
        userCounterUpdateData: userCounterUpdateData
    };
};

// This action function called when the user updates the page number on the bottom
// of the user-emails page, to change the number of page navigation of the
// emails he currently views.
export const onUserPagerUpdateStart = (userPagerUpdateData) => {
    return {
        type: actionTypes.userEmailsActions.USER_PAGER_UPDATE_START,
        userPagerUpdateData: userPagerUpdateData
    };
};

// This action function called when the user clicks on the email
// side icon to delete email from his emails list.
export const onUserDeleteEmailModalToggleStart = (toggleDeleteEmailModalData) => {
    return {
        type: actionTypes.userEmailsActions.USER_DELETE_EMAIL_MODAL_TOGGLE_START,
        toggleDeleteEmailModalData: toggleDeleteEmailModalData
    };
};

// This action function called when the user deletes the email successfully from his
// emails list and to close the window after deleted the email from his emails list.
export const onUserDeleteEmailModalToggleSuccess = (deleteEmailData) => {
    return {
        type: actionTypes.userEmailsActions.USER_DELETE_EMAIL_MODAL_TOGGLE_SUCCESS,
        deleteEmailData: deleteEmailData
    };
};

// This action function called when the delete email process is finished or
// cancelled and there is a need to reset the manageEmail dynamic object.
export const onUserDeleteEmailModalToggleReset = () => {
    return {
        type: actionTypes.userEmailsActions.USER_DELETE_EMAIL_MODAL_TOGGLE_RESET
    };
};

// This action function called when the user clicks on "Delete" button on the delete user email modal window
// to delete the email from this emails list.
export const onUserDeleteEmailProcessStart = (deleteEmailData) => {
    return {
        type: actionTypes.userEmailsActions.USER_DELETE_EMAIL_PROCESS_START,
        deleteEmailData: deleteEmailData
    };
};

// This action function called when the validation on the delete email saga was passed successfully and
// prepare to delete the email from the user emails list by calling the API server - Show animation loader to the user.
export const onUserDeleteEmailProcessPreparation = () => {
    return {
        type: actionTypes.userEmailsActions.USER_DELETE_EMAIL_PROCESS_PREPARATION
    };
};

// This action function called when there is validation error
// on the comments that the user added during the add email process.
export const onUserDeleteEmailProcessError = (errorMessage) => {
    return {
        type: actionTypes.userEmailsActions.USER_DELETE_EMAIL_PROCESS_ERROR,
        errorMessage: errorMessage
    };
};

// This action function called when there is unexpected while
// trying to add the email to the user's email list.
export const onUserDeleteEmailProcessFail = (errorMessageModal) => {
    return {
        type: actionTypes.userEmailsActions.USER_DELETE_EMAIL_PROCESS_FAIL,
        errorMessageModal: errorMessageModal
    };
};

// This action function called when the email was deleted successfully from the user's emails list -
// To close the modal window and to show the user that the email's row was fade out and deleted.
export const onUserDeleteEmailProcessSuccess = (userEmails) => {
    return {
        type: actionTypes.userEmailsActions.USER_DELETE_EMAIL_PROCESS_SUCCESS,
        userEmails: userEmails
    };
};