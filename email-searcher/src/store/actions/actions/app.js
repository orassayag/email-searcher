// This file implement all app related action functions of the store
// to enable navigating both to the reducer to update directly the state
// without any necessary logic, and to a specific the sagas to perform
// some action or validation and also from there to call other
// sagas or reducers.

import * as actionTypes from '../actionTypes';

// This action function called when the app page is starting to load, before
// the UI ready to load and displayed to the user.
export const onAppOnLoadStart = () => {
    return {
        type: actionTypes.appActions.APP_ON_LOAD_START
    };
};

// This action function is called when the app page loads to mark that the site
// application is mounted and ready to display the UI to the user.
export const onAppOnLoadSuccess = () => {
    return {
        type: actionTypes.appActions.APP_ON_LOAD_SUCCESS
    };
};