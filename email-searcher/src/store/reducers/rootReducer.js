// This file contains the root reducer that combines all the reducer's
// states from all the site applications into one single root imported
// on the index.js to be implemented in the redux store.

import { combineReducers } from 'redux';
import * as reducers from './reducers';

// Create a root reducer from all the reducers in the application.
const rootReducer = combineReducers({
    app: reducers.appReducer,
    search: reducers.searchReducer,
    userAuthentication: reducers.userAuthenticationReducer,
    userEmails: reducers.userEmailsReducer
});

export default rootReducer;