// This file reducer contains the initial state of the email classes and
// the search related parameters and properties, and contains all the
// functions that update the state, includes deep cloning to enable healthy
// status of the state. We update the state that related the email and
// search only by functions that implemented in this file reducer.

import * as actionTypes from '../../actions/actionTypes';
import * as enums from '../../../enums/enums';
import { updateObject } from '../../../utils/coreUtils';
import { initialErrorValidationResults, setSearchOptions, resetMultiSearchOptions, setMultiSearchOptions } from '../../../utils/searchUtils';
import { initialState, clearSearchOptionsErrors } from '../initialStates/search';
import { toManageEmail } from '../../../modals/conversion/manageEmail';

// This reducer function reset the state to initial position and called when the page first load.
// Why we do this? Since the inputs of the state not erase when the user redirect to another page.
export const onSearchResetStateSuccess = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            searchMode: enums.SearchMode.TEXT,
            searchOptions: resetMultiSearchOptions(state.searchOptions),

            // Clone the add email state and update.
            addEmail: updateObject({
                oldObject: state.addEmail,
                updatedProperties: toManageEmail()
            }),
            emails: null
        }
    });
};

// This reducer function called when the user adds the email successfully to his
// emails list and to close the window after save the email to his emails list
// Or cancel the adding email process.
export const onSearchAddEmailModalToggleSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isShowModal: action.addEmailData.isShowModal,
            isLoadingModal: false,
            errorMessageModal: null,
            addEmailComments: '',
            addEmail: action.addEmailData.addEmail
        }
    });
};

// This reducer function called when the add email process is finished or
// cancelled and there is a need to reset the addEmail dynamic object.
export const onSearchAddEmailModalToggleReset = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isShowModal: false,
            isLoadingModal: false,

            // Clone the add email state and update.
            addEmail: updateObject({
                oldObject: state.addEmail,
                updatedProperties: toManageEmail()
            })
        }
    });
};

// This reducer function called when the user input some comments
// on the text-area comments on the add email modal window.
export const onSearchAddEmailCommentsChangeSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            addEmailComments: action.addEmailComments
        }
    });
};

// This reducer function updates the modal show / hide window on the state when it changes.
// If toggle - Update the value by previous value. If not - Set it to new value.
export const onSearchModalToggleSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isShowModal: action.toggleModalData.isToggle ? !state.isShowModal : action.toggleModalData.isShowModal,
            authenticationRequiredModalType: action.toggleModalData.authenticationRequiredModalType
        }
    });
};

// This reducer function updates the search key text-box when the it changes.
const onSearchKeyChangeSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            searchKeyTempValue: action.searchKeyTempValue
        }
    });
};

// This reducer function updates the toggle change on the
// search options panel from show to hide and vice versa.
const onSearchOptionsToggleSuccess = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {

            // Clear all errors in any of the search options or search key.
            searchOptions: clearSearchOptionsErrors(state),
            isShowSearchOptions: !state.isShowSearchOptions
        }
    });
};

// This reducer function updates the state when there is
// error after changing a search option (Email key, email domain, etc...).
const onSearchOptionChangeError = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            searchOptionsGeneralErrorMessage: action.errorMessage
        }
    });
};

// This reducer function updates the state after the user
// change the option was successful (Email key, email domain, etc...).
const onSearchOptionChangeSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {

            // Get the updated search options.
            searchOptions: setSearchOptions({
                searchOptions: state.searchOptions,
                currentSearchOptionType: action.searchOptionData.currentSearchOptionType,
                propertyName: action.searchOptionData.propertyName,
                newValue: action.searchOptionData.newValue
            })
        }
    });
};

// This reducer function updates the state when the search mode
// is change being successful (TEXT to URL and vice versa).
const onSearchModeChangeSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            searchMode: action.newSearchMode
        }
    });
};

// This reducer function updates the state with loading to true, clear all previous errors,
// and the search key, after all validation were successfully passed.
const onSearchProcessPreparation = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isLoadingEmails: true,
            searchKeyInputValue: state.searchKeyTempValue,
            searchKeyErrorMessage: null,
            searchErrorRefType: null,
            isShowSearchOptions: false,

            // Clear all errors in any of the search options or search key.
            searchOptions: clearSearchOptionsErrors(state),
            isEmailsError: false
        }
    });
};

// This reducer function updates the state with error on search options if
// user input invalid data on one of the search options.
const onSearchProcessValidationError = (state, action) => {

    // Prepare all the errors to display the user, and the errors that needs to be clear.
    const errorResults = initialErrorValidationResults(action.errorSearchOptionsData);

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isLoadingEmails: false,
            searchKeyErrorMessage: errorResults.searchKeyErrorMessage,
            searchErrorRefType: errorResults.searchErrorRefType,

            // Get the updated search options.
            searchOptions: setMultiSearchOptions({
                searchOptions: state.searchOptions,
                searchOptionsToUpdate: errorResults.searchOptionsToUpdate,
                propertyName: enums.SearchOptionProperty.ERROR_MESSAGE
            })
        }
    });
};

// This reducer function updates the updated emails list, turn off the loading to display the user the
// updated emails list after successfully search process has been finished.
const onSearchProcessSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isComponentMounted: action.resultsData.isFakeProcess,
            isLoadingEmails: false,
            searchErrorRefType: action.resultsData.isFakeProcess ? null : enums.SearchScrollPosition.RESULTS,
            emails: [...action.resultsData.emails]
        }
    });
};

// This reducer function updates the error field to display a general
// message to the user instead of a search operation emails result.
export const onSearchProcessFail = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isLoadingEmails: false,
            isEmailsError: true
        }
    });
};

// This reducer function updates the error message to
// state on the add email modal window.
export const onSearchAddEmailProcessError = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isLoadingModal: false,

            // Clone the add email state and update.
            addEmail: updateObject({
                oldObject: state.addEmail,
                updatedProperties: {
                    errorMessage: action.errorMessage
                }
            })
        }
    });
};

// This reducer function updates the loading animation state on
// add email modal window before calling the API server.
export const onSearchAddEmailProcessPreparation = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isLoadingModal: true,

            // Clone the add email state and update.
            addEmail: updateObject({
                oldObject: state.addEmail,
                updatedProperties: {
                    errorMessage: null
                }
            })
        }
    });
};

// This reducer function updates the error message inside
// the modal window after calling the API server.
export const onSearchAddEmailProcessFail = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isLoadingModal: false,
            errorMessageModal: action.errorMessageModal
        }
    });
};

// This reducer function updates the emails
// list after successful add email process.
export const onSearchAddEmailProcessSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            emails: [...action.emails]
        }
    });
};

// This reducer function switches case by the relevant action called.
const searchReducer = (state = initialState, action) => {

    // Switch the action according to the type passed.
    switch (action.type) {
        case actionTypes.searchActions.SEARCH_RESET_STATE_SUCCESS:
            return onSearchResetStateSuccess(state);
        case actionTypes.searchActions.SEARCH_ADD_EMAIL_MODAL_TOGGLE_SUCCESS:
            return onSearchAddEmailModalToggleSuccess(state, action);
        case actionTypes.searchActions.SEARCH_ADD_EMAIL_MODAL_TOGGLE_RESET:
            return onSearchAddEmailModalToggleReset(state);
        case actionTypes.searchActions.SEARCH_ADD_EMAIL_COMMENTS_CHANGE_SUCCESS:
            return onSearchAddEmailCommentsChangeSuccess(state, action);
        case actionTypes.searchActions.SEARCH_MODAL_TOGGLE_SUCCESS:
            return onSearchModalToggleSuccess(state, action);
        case actionTypes.searchActions.SEARCH_KEY_CHANGE_SUCCESS:
            return onSearchKeyChangeSuccess(state, action);
        case actionTypes.searchActions.SEARCH_OPTIONS_TOGGLE_SUCCESS:
            return onSearchOptionsToggleSuccess(state);
        case actionTypes.searchActions.SEARCH_OPTION_CHANGE_ERROR:
            return onSearchOptionChangeError(state, action);
        case actionTypes.searchActions.SEARCH_OPTION_CHANGE_SUCCESS:
            return onSearchOptionChangeSuccess(state, action);
        case actionTypes.searchActions.SEARCH_MODE_CHANGE_SUCCESS:
            return onSearchModeChangeSuccess(state, action);
        case actionTypes.searchActions.SEARCH_PROCESS_PREPARATION:
            return onSearchProcessPreparation(state);
        case actionTypes.searchActions.SEARCH_PROCESS_VALIDATION_ERROR:
            return onSearchProcessValidationError(state, action);
        case actionTypes.searchActions.SEARCH_PROCESS_SUCCESS:
            return onSearchProcessSuccess(state, action);
        case actionTypes.searchActions.SEARCH_PROCESS_FAIL:
            return onSearchProcessFail(state, action);
        case actionTypes.searchActions.SEARCH_ADD_EMAIL_PROCESS_ERROR:
            return onSearchAddEmailProcessError(state, action);
        case actionTypes.searchActions.SEARCH_ADD_EMAIL_PROCESS_PREPARATION:
            return onSearchAddEmailProcessPreparation(state);
        case actionTypes.searchActions.SEARCH_ADD_EMAIL_PROCESS_FAIL:
            return onSearchAddEmailProcessFail(state, action);
        case actionTypes.searchActions.SEARCH_ADD_EMAIL_PROCESS_SUCCESS:
            return onSearchAddEmailProcessSuccess(state, action);
        default:

            // If not match case found - Don't do anything.
            break;
    }

    // Return the updated state.
    return state;
};

export default searchReducer;