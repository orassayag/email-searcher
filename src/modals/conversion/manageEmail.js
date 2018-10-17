// This file contains a function that
// creates empty instance of ManageEmail class.

import ManageEmail from '../modals/ManageEmail';

// This function creates a single empty instance of ManageEmail class.
export const toManageEmail = (manageEmailData) => {

    // Return new ManageEmail object instance.
    // Note that we don't check if the manageEmailData is empty or
    // not, since a default case handle in the ManageEmail class constructor.
    return new ManageEmail(manageEmailData);
};