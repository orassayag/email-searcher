// This file implement all search related action functions of the store
// to enable navigating both to the reducer to update directly the state
// without any necessary logic, and to a specific the sagas to preform
// some action or validation and also from there maybe to call other
// sagas or reducers.

import * as actionTypes from '../actionTypes';

// This action function called when the search-page (Home-page) first load to reset
// all inputs and settings to initial state.
export const onSearchResetStateSuccess = () => {
    return {
        type: actionTypes.searchActions.SEARCH_RESET_STATE_SUCCESS
    };
};

// This action function called when the search-page (Home-page) load to generate some inner sagas
// to generate fake emails or to verify existence of fake emails.
export const onSearchOnLoadStart = () => {
    return {
        type: actionTypes.searchActions.SEARCH_ON_LOAD_START
    };
};

// This action function called when the user clicks on the
// email side icon to add email to his emails list.
export const onSearchAddEmailModalToggleStart = (toggleAddEmailModalData) => {
    return {
        type: actionTypes.searchActions.SEARCH_ADD_EMAIL_MODAL_TOGGLE_START,
        toggleAddEmailModalData: toggleAddEmailModalData
    };
};

// This action function called when the user adds the email successfully to his
// emails list and to close the window after save the email to his emails list.
export const onSearchAddEmailModalToggleSuccess = (addEmailData) => {
    return {
        type: actionTypes.searchActions.SEARCH_ADD_EMAIL_MODAL_TOGGLE_SUCCESS,
        addEmailData: addEmailData
    };
};

// This action function called when the add email process is finished or
// cancelled and there is a need to reset the addEmail dynamic object.
export const onSearchAddEmailModalToggleReset = () => {
    return {
        type: actionTypes.searchActions.SEARCH_ADD_EMAIL_MODAL_TOGGLE_RESET
    };
};

// This action function called when the user clicks on some element that require to show or close a modal.
// It marks the beginning of the manage modal process.
export const onSearchModalToggleStart = (toggleModalData) => {
    return {
        type: actionTypes.searchActions.SEARCH_MODAL_TOGGLE_START,
        toggleModalData: toggleModalData
    };
};

// This action function called when the calculation if to show or close the
// modal finished, and a modal need to be raised up
// or closed (When user add email, or close the user-authentication modal, for example).
export const onSearchModalToggleSuccess = (toggleModalData) => {
    return {
        type: actionTypes.searchActions.SEARCH_MODAL_TOGGLE_SUCCESS,
        toggleModalData: toggleModalData
    };
};

// This action function called when a modal need to be raised up
// or closed (When user add email, or close the user-authentication modal, for example).
export const onSearchAddEmailModalCloseSuccess = (toggleModalData) => {
    return {
        type: actionTypes.searchActions.SEARCH_MODAL_TOGGLE_SUCCESS,
        toggleModalData: toggleModalData
    };
};

// This action function called when the user enter input on the add email comments modal window
// to update the state when the key change.
export const onSearchAddEmailCommentsChangeSuccess = (addEmailComments) => {
    return {
        type: actionTypes.searchActions.SEARCH_ADD_EMAIL_COMMENTS_CHANGE_SUCCESS,
        addEmailComments: addEmailComments
    };
};

// This action function called when the user clicks on the search options or
// click on the Apply button inside the search panel on search-page (Home-page).
export const onSearchOptionsToggleSuccess = () => {
    return {
        type: actionTypes.searchActions.SEARCH_OPTIONS_TOGGLE_SUCCESS
    };
};

// This action function called when the user enter input on the search bar on the search-page
// (Home-page), to update the state when the key change.
export const onSearchKeyChangeSuccess = (searchKeyTempValue) => {
    return {
        type: actionTypes.searchActions.SEARCH_KEY_CHANGE_SUCCESS,
        searchKeyTempValue: searchKeyTempValue
    };
};

// This action function called when search option
// has changed (Email key, email domain, etc...) on user-authentication page.
export const onSearchOptionChangeStart = (searchOptionData) => {
    return {
        type: actionTypes.searchActions.SEARCH_OPTION_CHANGE_START,
        searchOptionData: searchOptionData
    };
};

// This action function called when there was general error when search option has changed
// (Include search mode, email key, email domain, etc...) on user-authentication page.
export const onSearchOptionChangeError = (errorMessage) => {
    return {
        type: actionTypes.searchActions.SEARCH_OPTION_CHANGE_ERROR,
        errorMessage: errorMessage
    };
};

// This action function called when search option changed
// successfully (Email key, email domain, etc...) on user-authentication page.
export const onSearchOptionChangeSuccess = (searchOptionData) => {
    return {
        type: actionTypes.searchActions.SEARCH_OPTION_CHANGE_SUCCESS,
        searchOptionData: searchOptionData
    };
};

// This action function called when the user changes the search mode option (On search options
// - TEXT or URL and via versa) on user-authentication page.
export const onSearchModeChangeStart = (searchModeData) => {
    return {
        type: actionTypes.searchActions.SEARCH_MODE_CHANGE_START,
        searchModeData: searchModeData
    };
};

// This action function called the search mode option (On search options
// - TEXT or URL and via versa) changed successfully on user-authentication page.
export const onSearchModeChangeSuccess = (newSearchMode) => {
    return {
        type: actionTypes.searchActions.SEARCH_MODE_CHANGE_SUCCESS,
        newSearchMode: newSearchMode
    };
};

// This action function called when the user clicks on the search button on
// the search bar to perform a search of emails.
export const onSearchProcessStart = (searchData) => {
    return {
        type: actionTypes.searchActions.SEARCH_PROCESS_START,
        searchData: searchData
    };
};

// This action function called after all validation of the search saga passed successfully to show the
// user loading animation while calling the server to perform a search process.
export const onSearchProcessPreparation = () => {
    return {
        type: actionTypes.searchActions.SEARCH_PROCESS_PREPARATION
    };
};

// This action function called when there is an error before calling the search operation to the
// API server, to show the user the specific error or problem with his input.
export const onSearchProcessValidationError = (errorSearchOptionsData) => {
    return {
        type: actionTypes.searchActions.SEARCH_PROCESS_VALIDATION_ERROR,
        errorSearchOptionsData: errorSearchOptionsData
    };
};

// This action function called after successfully search process operation,
// when the emails result returned successfully from the API server.
export const onSearchProcessSuccess = (resultsData) => {
    return {
        type: actionTypes.searchActions.SEARCH_PROCESS_SUCCESS,
        resultsData: resultsData
    };
};

// This action called when there is unexpected error and the search
// operation is failed, to show the user general error message.
export const onSearchProcessFail = () => {
    return {
        type: actionTypes.searchActions.SEARCH_PROCESS_FAIL
    };
};

// This action function called when the user clicks on "Add" button on the add user email modal window
// to add the email to this emails list.
export const onSearchAddEmailProcessStart = (addEmailData) => {
    return {
        type: actionTypes.searchActions.SEARCH_ADD_EMAIL_PROCESS_START,
        addEmailData: addEmailData
    };
};

// This action function called when the validation on the add email saga was pass successfully and
// prepare to add the email to the user emails list by calling the API server - Show animation loader to the user.
export const onSearchAddEmailProcessPreparation = () => {
    return {
        type: actionTypes.searchActions.SEARCH_ADD_EMAIL_PROCESS_PREPARATION
    };
};

// This action function called when there is validation error
// on the comments that the user added during the add email process.
export const onSearchAddEmailProcessError = (errorMessage) => {
    return {
        type: actionTypes.searchActions.SEARCH_ADD_EMAIL_PROCESS_ERROR,
        errorMessage: errorMessage
    };
};

// This action function called when there is unexpected while trying
// to add the email to the user's email list.
export const onSearchAddEmailProcessFail = (errorMessageModal) => {
    return {
        type: actionTypes.searchActions.SEARCH_ADD_EMAIL_PROCESS_FAIL,
        errorMessageModal: errorMessageModal
    };
};

// This action function called when the email was added successfully to the user's emails list -
// To close the modal window and to show the user that the email's row was marked as added.
export const onSearchAddEmailProcessSuccess = (emails) => {
    return {
        type: actionTypes.searchActions.SEARCH_ADD_EMAIL_PROCESS_SUCCESS,
        emails: emails
    };
};