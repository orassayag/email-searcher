// This file include all user emails related the keys of
// action to perform calls to the reducer or sagas.

// This object define all the user emails action keys.
const userEmailsActions = Object.freeze({
    USER_EMAILS_AUTHENTICATION_PROCESS_SUCCESS: 'USER_EMAILS_AUTHENTICATION_PROCESS_SUCCESS',
    USER_EMAILS_AUTHENTICATION_LOGOUT_SUCCESS: 'USER_EMAILS_AUTHENTICATION_LOGOUT_SUCCESS',
    USER_ADD_EMAIL_PROCESS_START: 'USER_ADD_EMAIL_PROCESS_START',
    USER_ADD_EMAIL_PROCESS_SUCCESS: 'USER_ADD_EMAIL_PROCESS_SUCCESS',
    USER_UPDATE_EMAILS_TOTAL_COUNT_SUCCESS: 'USER_UPDATE_EMAILS_TOTAL_COUNT_SUCCESS',
    USER_GET_EMAILS_PROCESS_START: 'USER_GET_EMAILS_PROCESS_START',
    USER_GET_EMAILS_PROCESS_NO_EMAILS_SUCCESS: 'USER_GET_EMAILS_PROCESS_NO_EMAILS_SUCCESS',
    USER_GET_EMAILS_PROCESS_FIRST_LOAD_PREPARATION: 'USER_GET_EMAILS_PROCESS_FIRST_LOAD_PREPARATION',
    USER_GET_EMAILS_PROCESS_PREPARATION: 'USER_GET_EMAILS_PROCESS_PREPARATION',
    USER_GET_EMAILS_PROCESS_FAIL: 'USER_GET_EMAILS_PROCESS_FAIL',
    USER_GET_EMAILS_PROCESS_SUCCESS: 'USER_GET_EMAILS_PROCESS_SUCCESS',
    USER_TOGGLE_EMAIL_MORE_INFORMATION_START: 'USER_TOGGLE_EMAIL_MORE_INFORMATION_START',
    USER_TOGGLE_EMAIL_MORE_INFORMATION_SUCCESS: 'USER_TOGGLE_EMAIL_MORE_INFORMATION_SUCCESS',
    USER_COUNTER_UPDATE_START: 'USER_COUNTER_UPDATE_START',
    USER_PAGER_UPDATE_START: 'USER_PAGER_UPDATE_START',
    USER_DELETE_EMAIL_MODAL_TOGGLE_START: 'USER_DELETE_EMAIL_MODAL_TOGGLE_START',
    USER_DELETE_EMAIL_MODAL_TOGGLE_SUCCESS: 'USER_DELETE_EMAIL_MODAL_TOGGLE_SUCCESS',
    USER_DELETE_EMAIL_MODAL_TOGGLE_RESET: 'USER_DELETE_EMAIL_MODAL_TOGGLE_RESET',
    USER_DELETE_EMAIL_PROCESS_START: 'USER_DELETE_EMAIL_PROCESS_START',
    USER_DELETE_EMAIL_PROCESS_PREPARATION: 'USER_DELETE_EMAIL_PROCESS_PREPARATION',
    USER_DELETE_EMAIL_PROCESS_ERROR: 'USER_DELETE_EMAIL_PROCESS_ERROR',
    USER_DELETE_EMAIL_PROCESS_SUCCESS: 'USER_DELETE_EMAIL_PROCESS_SUCCESS',
    USER_DELETE_EMAIL_PROCESS_FAIL: 'USER_DELETE_EMAIL_PROCESS_FAIL'
});

export default userEmailsActions;