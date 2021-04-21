// This file merges all watchers related to user emails operations, to perform a
// call when needed, a saga that relates to the user emails and other action
// operations. Once a saga is called it will perform all its logic in synchronic order.

import { takeEvery, all } from 'redux-saga/effects';
import * as actionTypes from '../../actions/actionTypes';
import * as sagas from '../sagas/userEmails';

// Watch on all the actions that require a saga function.
export function* watchUserEmailsSaga() {
    yield all([
        takeEvery(actionTypes.userEmailsActions.USER_GET_EMAILS_PROCESS_START, sagas.userGetEmailsProcessStartSaga),
        takeEvery(actionTypes.userEmailsActions.USER_TOGGLE_EMAIL_MORE_INFORMATION_START, sagas.userToggleEmailMoreInformationStartSaga),
        takeEvery(actionTypes.userEmailsActions.USER_COUNTER_UPDATE_START, sagas.userCounterUpdateStartSaga),
        takeEvery(actionTypes.userEmailsActions.USER_PAGER_UPDATE_START, sagas.userPagerUpdateStartSaga),
        takeEvery(actionTypes.userEmailsActions.USER_DELETE_EMAIL_MODAL_TOGGLE_START, sagas.userDeleteEmailModalToggleStartSaga),
        takeEvery(actionTypes.userEmailsActions.USER_DELETE_EMAIL_PROCESS_START, sagas.userDeleteEmailProcessStartSaga)
    ]);
}