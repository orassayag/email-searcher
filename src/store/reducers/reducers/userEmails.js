// This file reducer contains the initial state of the user emails class and
// the user related parameters and properties, and contains all the
// functions that update the state, includes deep cloning to enable healthy
// status of the state. We update the state that related the user only by
// functions that implemented in this file reducer.

import * as actionTypes from '../../actions/actionTypes';
import { updateObject, cloneAndUpdateObject } from '../../../utils/coreUtils';
import { initialState } from '../initialStates/userEmails';
import { toManageEmail } from '../../../modals/conversion/manageEmail';

// This reducer function updates the user emails class instance
// with all the relevant parameters and settings after successfully
// login / registration operation process, and with the user
// emails list to display them to the user.
export const onUserEmailsAuthenticationProcessSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            userEmails: action.userEmails
        }
    });
};

// This reducer function updates the user email class instance to
// null after successful logout operation, after the user
// authentication instance class has been already cleared.
export const onUserEmailsAuthenticationLogoutSuccess = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            userEmails: null
        }
    });
};

// This reducer function updates the user emails total count on the state after
// successfully added new email to the user emails list.
export const onUserUpdateEmailsTotalCountSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {

            // Note that here we use to clone the object, a deep clone,
            // that includes all properties and old prototypes methods.
            userEmails: cloneAndUpdateObject({
                oldObject: state.userEmails,
                updatedProperties: {
                    userEmailsTotalCount: action.userEmailsTotalCount
                }
            })
        }
    });
};

// This reducer function updates the loading animation, and clear the error and
// scroll elements, to display a message to the user that he doesn’t have any
// emails on this emails list.
export const onUserGetEmailsProcessNoEmailsSuccess = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isScrollToResults: false,
            isLoadingEmails: false,
            isEmailsError: false
        }
    });
};

// This reducer function updates the component mounted field to
// preform some logic that depend on this field after the first
// load of the user-emails page.
export const onUserGetEmailsProcessFirstLoadPreparation = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isComponentMounted: true
        }
    });
};

// This reducer function display a loading animation to the user while a
// call to the API server database has being made to get all the user
// emails to display on the user-emails page.
export const onUserGetEmailsProcessPreparation = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isScrollToResults: false,
            isLoadingEmails: true,
            isEmailsError: false
        }
    });
};

// This reducer function updates the error field to be true to display
// a general error message about failing to get user emails to displayed
// due unexpected error from the API server.
export const onUserGetEmailsProcessFail = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isScrollToResults: false,
            isLoadingEmails: false,
            isEmailsError: true
        }
    });
};

// This reducer function updates the user emails after a successful
// API response with all the converted emails to Email class instances,
// to display the emails to the user.
export const onUserGetEmailsProcessSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isScrollToResults: true,
            isLoadingEmails: false,
            isEmailsError: false,

            // Note that here we use to clone the object, a deep clone,
            // that includes all properties and old prototypes methods.
            userEmails: cloneAndUpdateObject({
                oldObject: state.userEmails,
                updatedProperties: {
                    userEmailsList: action.getUserEmailsResultData.emails,
                    userEmailsTotalCount: action.getUserEmailsResultData.totalEmailsCount,
                    userEmailsCountPerPage: action.getUserEmailsResultData.emailsCountPerPage,
                    userEmailsPagesTotalCount: action.getUserEmailsResultData.totalPagesCount,
                    userEmailsCurrentPageNumber: action.getUserEmailsResultData.currentPageNumber,
                    userEmailsPagesCountToShow: action.getUserEmailsResultData.pagesCountToShow,
                    userEmailsDeletedCount: action.getUserEmailsResultData.emailsDeletedCount
                }
            })
        }
    });
};

// This reducer function updates the emails list after a specific email action type
// field of one of the emails has been updated with a show / hide action to display
// or to hide the full information of the email row item.
export const onUserToggleEmailMoreInformationSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {

            // Note that here we use to clone the object, a deep clone,
            // that includes all properties and old prototypes methods.
            userEmails: cloneAndUpdateObject({
                oldObject: state.userEmails,
                updatedProperties: {
                    userEmailsList: action.emails
                }
            })
        }
    });
};

// This reducer called when the user deletes the email successfully from his
// emails list and to close the window after delete the email from his emails list
// Or cancel the deleting email process.
export const onUserDeleteEmailModalToggleSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isShowModal: action.deleteEmailData.isShowModal,
            isLoadingModal: false,
            errorMessageModal: null,

            // In case that no value supplied (Like in case that the
            // toggle modal window close) reset the delete email object instance.
            deleteEmail: action.deleteEmailData.deleteEmail ? action.deleteEmailData.deleteEmail : toManageEmail()
        }
    });
};

// This reducer called when the delete email process is finished or
// cancelled and there is a need to reset the manageEmail dynamic object.
export const onUserDeleteEmailModalToggleReset = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isShowModal: false,

            // Reset the delete email state and update.
            deleteEmail: updateObject({
                oldObject: state.deleteEmail,
                updatedProperties: toManageEmail()
            })
        }
    });
};

// This reducer function updates the error message to state
// on the delete email modal window.
export const onUserDeleteEmailProcessError = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isLoadingModal: false,

            // Clone the add email state and update.
            deleteEmail: updateObject({
                oldObject: state.deleteEmail,
                updatedProperties: {
                    errorMessage: action.errorMessage
                }
            })
        }
    });
};

// This reducer function updates the loading animation state on delete email modal
// window before calling the API server.
export const onUserDeleteEmailProcessPreparation = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isLoadingModal: true,

            // Clone the delete email state and update.
            deleteEmail: updateObject({
                oldObject: state.deleteEmail,
                updatedProperties: {
                    errorMessage: null
                }
            })
        }
    });
};

// This reducer function updates the error message inside
// the modal window after calling the API server.
export const onUserDeleteEmailProcessFail = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isLoadingModal: false,
            errorMessageModal: action.errorMessageModal
        }
    });
};

// This reducer function updates the user emails
// list after successful add email process.
export const onUserDeleteEmailProcessSuccess = (state, action) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {

            // Note that here we use to clone the object, a deep clone,
            // that includes all properties and old prototypes methods.
            userEmails: cloneAndUpdateObject({
                oldObject: state.userEmails,
                updatedProperties: action.userEmails
            })
        }
    });
};

// This reducer function switches case by the relevant action called.
const userReducer = (state = initialState, action) => {

    // Switch the action according to the type.
    switch (action.type) {
        case actionTypes.userEmailsActions.USER_EMAILS_AUTHENTICATION_PROCESS_SUCCESS:
            return onUserEmailsAuthenticationProcessSuccess(state, action);
        case actionTypes.userEmailsActions.USER_EMAILS_AUTHENTICATION_LOGOUT_SUCCESS:
            return onUserEmailsAuthenticationLogoutSuccess(state);
        case actionTypes.userEmailsActions.USER_UPDATE_EMAILS_TOTAL_COUNT_SUCCESS:
            return onUserUpdateEmailsTotalCountSuccess(state, action);
        case actionTypes.userEmailsActions.USER_GET_EMAILS_PROCESS_NO_EMAILS_SUCCESS:
            return onUserGetEmailsProcessNoEmailsSuccess(state);
        case actionTypes.userEmailsActions.USER_GET_EMAILS_PROCESS_FIRST_LOAD_PREPARATION:
            return onUserGetEmailsProcessFirstLoadPreparation(state);
        case actionTypes.userEmailsActions.USER_GET_EMAILS_PROCESS_PREPARATION:
            return onUserGetEmailsProcessPreparation(state);
        case actionTypes.userEmailsActions.USER_GET_EMAILS_PROCESS_FAIL:
            return onUserGetEmailsProcessFail(state);
        case actionTypes.userEmailsActions.USER_GET_EMAILS_PROCESS_SUCCESS:
            return onUserGetEmailsProcessSuccess(state, action);
        case actionTypes.userEmailsActions.USER_TOGGLE_EMAIL_MORE_INFORMATION_SUCCESS:
            return onUserToggleEmailMoreInformationSuccess(state, action);
        case actionTypes.userEmailsActions.USER_DELETE_EMAIL_MODAL_TOGGLE_SUCCESS:
            return onUserDeleteEmailModalToggleSuccess(state, action);
        case actionTypes.userEmailsActions.USER_DELETE_EMAIL_MODAL_TOGGLE_RESET:
            return onUserDeleteEmailModalToggleReset(state);
        case actionTypes.userEmailsActions.USER_DELETE_EMAIL_PROCESS_ERROR:
            return onUserDeleteEmailProcessError(state, action);
        case actionTypes.userEmailsActions.USER_DELETE_EMAIL_PROCESS_PREPARATION:
            return onUserDeleteEmailProcessPreparation(state);
        case actionTypes.userEmailsActions.USER_DELETE_EMAIL_PROCESS_FAIL:
            return onUserDeleteEmailProcessFail(state, action);
        case actionTypes.userEmailsActions.USER_DELETE_EMAIL_PROCESS_SUCCESS:
            return onUserDeleteEmailProcessSuccess(state, action);
        default:

            // If not match case found - Don't do anything.
            break;
    }

    // Return the updated state.
    return state;
};

export default userReducer;