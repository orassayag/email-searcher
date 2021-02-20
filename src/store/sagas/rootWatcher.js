// This file merge watcher on sagas and fork all of the watcher into one root
// watcher of sagas to be imported. Later will be looped on each watcher saga
// and will run the watcher to be available to perform each sagas action.

import { fork } from 'redux-saga/effects';
import { watchAppSaga } from './watchers/app';
import { watchSearchSaga } from './watchers/search';
import { watchUserAuthenticationSaga } from './watchers/userAuthentication';
import { watchUserEmailsSaga } from './watchers/userEmails';

// Export all forked watcher.
export default function* root() {
    yield fork(watchAppSaga);
    yield fork(watchSearchSaga);
    yield fork(watchUserAuthenticationSaga);
    yield fork(watchUserEmailsSaga);
}