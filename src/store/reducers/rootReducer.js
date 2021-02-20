// This file contains the root reducer that combine all the reducer's
// states from all the site application into one single root imported
// on the index.js to implemented in the redux store.

import { combineReducers } from 'redux';
import * as reducers from './reducers';

// Create root reducer from all the reducer in the application.
const rootReducer = combineReducers({
    app: reducers.appReducer,
    search: reducers.searchReducer,
    userAuthentication: reducers.userAuthenticationReducer,
    userEmails: reducers.userEmailsReducer
});

export default rootReducer;