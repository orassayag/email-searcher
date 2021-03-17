// This file merges all watchers related to search operations, to perform a
// call when needed, a saga that relates to the search emails operations. Once
// saga is called it will perform all its logic in synchronic order.

import { takeEvery, all } from 'redux-saga/effects';
import * as actionTypes from '../../actions/actionTypes';
import * as sagas from '../sagas/search';

// Watch on all the actions that require a saga function.
export function* watchSearchSaga() {
    yield all([
        takeEvery(actionTypes.searchActions.SEARCH_ON_LOAD_START, sagas.searchOnLoadStartSaga),
        takeEvery(actionTypes.searchActions.SEARCH_MODAL_TOGGLE_START, sagas.searchModalToggleStartSaga),
        takeEvery(actionTypes.searchActions.SEARCH_ADD_EMAIL_MODAL_TOGGLE_START, sagas.searchAddEmailModalToggleStartSaga),
        takeEvery(actionTypes.searchActions.SEARCH_ADD_EMAIL_PROCESS_START, sagas.searchAddEmailProcessStartSaga),
        takeEvery(actionTypes.searchActions.SEARCH_PROCESS_START, sagas.searchProcessStartSaga),
        takeEvery(actionTypes.searchActions.SEARCH_MODE_CHANGE_START, sagas.searchModeChangeStartSaga),
        takeEvery(actionTypes.searchActions.SEARCH_OPTION_CHANGE_START, sagas.searchOptionChangeStartSaga)
    ]);
}