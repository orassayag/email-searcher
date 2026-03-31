// This file merges watchers on sagas and forks all of the watchers into one root
// watcher of sagas to be imported. Later will be looped on each watcher saga
// and will run the watcher to be available to perform each sagas action.

import { fork } from 'redux-saga/effects';
import { watchAppSaga } from './watchers/app';
import { watchSearchSaga } from './watchers/search';
import { watchUserAuthenticationSaga } from './watchers/userAuthentication';
import { watchUserEmailsSaga } from './watchers/userEmails';

// Export all forked watchers.
export default function* root() {
    yield fork(watchAppSaga);
    yield fork(watchSearchSaga);
    yield fork(watchUserAuthenticationSaga);
    yield fork(watchUserEmailsSaga);
}