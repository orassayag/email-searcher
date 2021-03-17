// This file reducer contains the initial state of the app
// related parameters and properties, and contains all the
// functions that update the state.

import * as actionTypes from '../../actions/actionTypes';
import { updateObject } from '../../../utils/coreUtils';
import { initialState } from '../initialStates/app';

// This reducer function updates that the component is mounted
// and the pages loaded successfully.
export const onAppOnLoadSuccess = (state) => {

    // Clone the state and update.
    return updateObject({
        oldObject: state,
        updatedProperties: {
            isComponentMounted: true
        }
    });
};

// This reducer function switches case by the relevant action called.
const appReducer = (state = initialState, action) => {

    // Switch the action according to the type passed.
    switch (action.type) {
        case actionTypes.appActions.APP_ON_LOAD_SUCCESS:
            return onAppOnLoadSuccess(state);
        default:

            // If no match is found - Don't do anything.
            break;
    }

    // Return the updated state.
    return state;
};

export default appReducer;