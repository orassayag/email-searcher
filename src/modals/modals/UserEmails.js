// This class represent the user emails (Like emails list's count, the
// emails list itself) that the user stored in this account.
// The separation from UserAuthentication class due to separate concerns,
// to not have a big user class with all the details, and for technical reasons
// (Exposing one class in all places cause refresh the page once deep cloning it).
// Important note: DON'T change the order of the fields, it's critical in localStorage cases.

import settings from '../../settings/application/settings';
import logicSettings from '../../settings/logic/logicSettings';
import { getNumber } from '../../utils/textUtils';

class UserEmails {

    constructor(userEmailsData) {

        // Check if data received exists. If not -
        // Don't assign any value to the UserEmails instance.
        if (!userEmailsData) {

            // Stop any further actions.
            return;
        }

        // This field will hold some parts user's emails
        // list (Note that will not hold all the emails list, only what
        // the users see at the moment). This meant to be due to
        // API server request to display not all of the emails to reduce CPU from the browser.
        this.userEmailsList = userEmailsData.userEmailsList;

        // This field determine the total count of ALL (Not like in emails list - Some part of
        // emails, all the total count of emails) the emails list. We need to keep it to verify
        // that the user not over the limit of emails to save in this emails list.
        // Since in localStorage the emails count saved as string too, need to convert to number and return it.
        // If not exists - Assign default value of 0.
        // Note that the response we save this field both on state and localStorage is to reduce CPU calls,
        // and not for each time the user add email to his emails list, go to take his total emails
        // count to see if he is allowed to save more emails or he reached the maximum limit (This not
        // mean the there isn't another check once the user decided to add the email to this list,
        // we don't check again the limit. We do).
        this.userEmailsTotalCount = getNumber({
            targetNumber: userEmailsData.userEmailsTotalCount,
            defaultNumber: 0
        });

        // Will hold the number of emails to display in user-emails page per page
        // (If there are more than the minimum limit to display the pager).
        this.userEmailsCountPerPage = getNumber({
            targetNumber: userEmailsData.userEmailsCountPerPage,
            defaultNumber: logicSettings.defaultUserEmailsCountPerPage
        });

        // Will hold the number of pages to display in user-emails pager
        // (If there are more than the minimum limit to display the pager).
        this.userEmailsPagesTotalCount = getNumber({
            targetNumber: userEmailsData.userEmailsPagesTotalCount,
            defaultNumber: 0
        });

        // This will hold the current page that the user is place in
        // (If there are more than the minimum limit to display the pager).
        this.userEmailsCurrentPageNumber = getNumber({
            targetNumber: userEmailsData.userEmailsCurrentPageNumber,
            defaultNumber: logicSettings.defaultUserEmailsCurrentPageNumber
        });

        // This will hold the number of links to display on the pager component in
        // user-emails component (If there are more than the minimum limit to display the pager).
        this.userEmailsPagesCountToShow = getNumber({
            targetNumber: userEmailsData.userEmailsPagesCountToShow,
            defaultNumber: logicSettings.defaultPagesCountToShow
        });

        // This field will hold the number of emails that deleted. This saved due to UI logic
        // that after certain numbers of deletes the page is refresh since the pager and the count outdated.
        this.userEmailsDeletedCount = getNumber({
            targetNumber: userEmailsData.userEmailsDeletedCount,
            defaultNumber: 0
        });
    }

    // This method determine the user email's count on this emails list.
    // This is important to determine is the user can keep saving emails to his emails list or not.
    isUserEmailsTotalCountLimitExceeded() {

        // Will hold the final result.
        let isLimitExceeded = false;

        // Check if user has reached the limit of emails count and assign the result.
        isLimitExceeded = this.userEmailsTotalCount >= settings.maximumUserEmailsTotalCountLimit;

        // Return the result.
        return isLimitExceeded;
    };
}

export default UserEmails;