// This file contains all app sagas.

import { delay } from 'redux-saga';
import { put } from 'redux-saga/effects';
import * as actions from '../../actions/actions';
import UISettings from '../../../settings/logic/UISettings';

// This saga function called to perform a delay until all the UI
// will be ready to be displayed to the user.
export function* appOnLoadStartSaga() {

    // Delay until the UI of the site application
    // will be ready to display to the user.
    yield delay(UISettings.appPageInitialDelay);

    // After the delay process to the success app, remove
    // the animation loader and display the UI to the user.
    yield put(actions.onAppOnLoadSuccess());
}