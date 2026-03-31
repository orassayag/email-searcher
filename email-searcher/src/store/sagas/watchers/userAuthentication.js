// This file merges all watchers of sagas related to user-authentication operations, to perform a
// call when needed, a saga that relates to the user-authentication.
// Once a saga is called it will perform all its logic in synchronic order.

import { takeEvery, all } from 'redux-saga/effects';
import * as actionTypes from '../../actions/actionTypes';
import * as sagas from '../sagas/userAuthentication';

// Watch on all the actions that require a saga function.
export function* watchUserAuthenticationSaga() {
    yield all([
        takeEvery(actionTypes.userAuthenticationActions.USER_AUTHENTICATION_INPUT_CHANGE_START, sagas.userAuthenticationInputChangeStartSaga),
        takeEvery(actionTypes.userAuthenticationActions.USER_AUTHENTICATION_MODE_CHANGE_START, sagas.userAuthenticationModeChangeStartSaga),
        takeEvery(actionTypes.userAuthenticationActions.USER_AUTHENTICATION_CHECK_TIMEOUT_START, sagas.userAuthenticationCheckTimeoutStartSaga),
        takeEvery(actionTypes.userAuthenticationActions.USER_AUTHENTICATION_LOGOUT_START, sagas.userAuthenticationLogoutStartSaga),
        takeEvery(actionTypes.userAuthenticationActions.USER_AUTHENTICATION_PROCESS_START, sagas.userAuthenticationProcessStartSaga),
        takeEvery(actionTypes.userAuthenticationActions.USER_AUTHENTICATION_CHECK_STATE_START, sagas.userAuthenticationCheckStateStartSaga)
    ]);
}