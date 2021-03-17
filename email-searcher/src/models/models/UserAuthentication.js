// This class represents the user-authentication that allows the user
// to be logged-in / registered and to check if the user is authenticated or not.
// The separation from UserEmails class due to separate concerns,
// to not have a big user class with all the details, and for technical reasons
// (Exposing one class in all places causes refresh the page once deep cloning it).
// Important note: DON'T change the order of the fields, it's critical in localStorage cases.

import settings from '../../settings/application/settings';

class UserAuthentication {

    constructor(userAuthenticationData) {

        // Check if data received exists. If not -
        // Don't assign any value to the UserAuthentication instance.
        if (!userAuthenticationData) {

            // Stop any further actions.
            return;
        }

        // The Id of the user as generated on the database.
        this.userId = userAuthenticationData.userId;

        // The username of the user (Email of the user) that will be displayed
        // on the site, and with it the user can login to the system.
        this.userName = userAuthenticationData.userName;

        // The password of the user, that within he logged-in / registered.
        // Saved only in the state, not in localStorage.
        this.userPassword = userAuthenticationData.userPassword;

        // Determine if the user is authenticated or not.
        this.userToken = userAuthenticationData.userToken;

        // Determine if the user is authenticated or not, if the user token
        // is expired or not. Since the result of the user token expiration date should be
        // date object and not string (Like saved on localStorage),
        // We convert it to date and re-assigned it.
        this.userTokenExpirationDate = null;

        // The logic of the user token expiration date faces 2 scenarios:
        // 1. When the user logged-in / registered - The userEmails.userTokenExpireIn -
        // It's a number of seconds that the token will expire (Usually it's 3600 - One hour).
        // In this case we need to convert it to date time and store it.
        // 2. When the user refreshes the browser and gets the expiration date from the
        // localStorage as string. In this case we only need to convert it to a new Date.
        // Note that there is no case where both userTokenExpireInSeconds and
        // userTokenExpirationDate will be valued. One of them will always be null to not override the field.
        if (userAuthenticationData.userTokenExpireInSeconds) {

            // Assign the user token expiration date.
            // Will hold the expiration time of the token by seconds (Multiply 1000 in the milliseconds number).
            this.userTokenExpirationDate = new Date(new Date().getTime() + userAuthenticationData.userTokenExpireInSeconds * settings.apiUserAuthenticationTokenMillisecondsCount);
        }

        // Assign the user the expiration date converted from
        // localStorage to as string to new date object,
        // for calculations for the time left for the user token to be expired.
        if (userAuthenticationData.userTokenExpirationDate) {

            // Assign the user token expiration date (That received
            // from localStorage) as string, by converting it to a new Date.
            this.userTokenExpirationDate = new Date(userAuthenticationData.userTokenExpirationDate);
        }
    }

    // This method determines if the user is logged-in to the system (With valid token) or not.
    // This is important to show / hide some of the logic and action available in the site.
    isUserAuthenticated() {

        // Will hold the final result.
        let isUserAuthenticated = false;

        // Validate existence of parameters. If it exists, check that the user token is not expired.
        if (this.userToken && this.userTokenExpirationDate) {

            // Check if the user token expiration date is valid after
            // conversion from string (As saved on localStorage) to date,
            // Also, check if user token is still valid (One-hour user
            // token expiration time - And after that - Need to login again).
            isUserAuthenticated = this.userTokenExpirationDate > new Date();
        }

        // Return the result.
        return isUserAuthenticated;
    };

    // This method calculates the time left for the user
    // token to expire to renew the delay until logout.
    getUserTokenLeftTime() {

        // Validate the expirationDate parameter. If not exists - Return default number.
        if (!this.userTokenExpirationDate) {

            // Return default number of 0.
            return 0;
        }

        // Return the calculated expiration user token time.
        return (this.userTokenExpirationDate.getTime() - new Date().getTime()) / settings.apiUserAuthenticationTokenMillisecondsCount;
    };
}

export default UserAuthentication;