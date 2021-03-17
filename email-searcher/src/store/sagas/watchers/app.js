// This file merges all watchers of sagas related to app operations, to perform a
// call when needed. Once the saga is called it will perform all its logic in synchronic order.

import { takeEvery, all } from 'redux-saga/effects';
import * as actionTypes from '../../actions/actionTypes';
import * as sagas from '../sagas/app';

// Watch on all the actions that require a saga function.
export function* watchAppSaga() {
    yield all([
        takeEvery(actionTypes.appActions.APP_ON_LOAD_START, sagas.appOnLoadStartSaga)
    ]);
}