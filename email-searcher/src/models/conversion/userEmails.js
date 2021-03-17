// This file holds the conversion function that gets strings
// object and converts it to UserEmails class instance that
// effects on the emails and paging data on the user-emails page.

import UserEmails from '../models/UserEmails';

// This function converts a single data of strings into a UserEmails class instance.
export const toUserEmails = (userEmailsData) => {

    // Check for existence of userEmailsData parameter. If not exists return null instance.
    if (!userEmailsData) {

        // Don't create any new instance.
        return null;
    }

    // Return new UserEmails object instance.
    return new UserEmails({
        userEmailsList: null,
        userEmailsTotalCount: userEmailsData.userEmailsTotalCount,
        userEmailsCountPerPage: null,
        userEmailsPagesTotalCount: null,
        userEmailsCurrentPageNumber: null,
        userEmailsPagesCountToShow: null,
        userEmailsDeletedCount: null
    });
};