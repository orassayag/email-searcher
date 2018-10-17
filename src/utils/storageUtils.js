// This file contains all the functions that manipulate almost
// all the CRUD operations that effects the localStorage only.
// In the site application only, the user credentials are stored
// in the localStorage, but can be served to other future
// reasons and needs.

import settings from '../settings/application/settings';
import { validateNumber } from './validationUtils';

// This function sets specific key / value pair on localStorage.
export const setItem = (key, value) => {

    // Validate existence of the key and value parameters. If not, don't continue.
    // Note that if is a number, we don't validate with a simple
    // validation (That include equal to 0), but if it's a number only.
    if (!key || (!validateNumber(value) && !value)) {

        // Stop any further actions.
        return;
    }

    // Set the item in the localStorage with special init key.
    localStorage.setItem(`${settings.emailSearcherInit}_${key}`, value);
};

// This function gets specific value by key from localStorage.
export const getItem = (key) => {

    // Validate existence of the key parameter. If not, don't continue.
    if (!key) {

        // Stop any further actions.
        return;
    }

    // Get the item from the localStorage with special init key.
    return localStorage.getItem(`${settings.emailSearcherInit}_${key}`);
};

// This function removes specific value by key from localStorage.
export const removeItem = (key) => {

    // Validate existence of the key parameter. If not, don't continue.
    if (!key) {

        // Stop any further actions.
        return;
    }

    // Remove the item from the localStorage with special init key.
    localStorage.removeItem(`${settings.emailSearcherInit}_${key}`);
};