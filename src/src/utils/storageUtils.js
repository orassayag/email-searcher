// This file contains all the functions that manipulate almost
// all the CRUD operations that affect the localStorage only.
// In the site application only, the user credentials are stored
// in the localStorage, but can be served to other future
// reasons and needs.

import settings from '../settings/application/settings';
import { validateNumber } from './validationUtils';

// This function sets a specific key / value pair on localStorage.
export const setItem = (key, value) => {

    // Validate existence of the key and value parameters. If not, don't continue.
    // Note that if is a number, we don't validate with a simple
    // validation (That includes equal to 0), but if it's a number only.
    if (!key || (!validateNumber(value) && !value)) {

        // Stop any further actions.
        return;
    }

    // Set the item in the localStorage with a special initial key.
    localStorage.setItem(`${settings.emailSearcherInitial}_${key}`, value);
};

// This function gets specific value by key from localStorage.
export const getItem = (key) => {

    // Validate existence of the key parameter. If not, don't continue.
    if (!key) {

        // Stop any further actions.
        return;
    }

    // Get the item from the localStorage with a special initial key.
    return localStorage.getItem(`${settings.emailSearcherInitial}_${key}`);
};

// This function removes specific value by key from localStorage.
export const removeItem = (key) => {

    // Validate existence of the key parameter. If not, don't continue.
    if (!key) {

        // Stop any further actions.
        return;
    }

    // Remove the item from the localStorage with a special initial key.
    localStorage.removeItem(`${settings.emailSearcherInitial}_${key}`);
};