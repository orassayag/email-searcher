// This conversion file holds the function that convert
// string data object into UserAuthentication class, that
// effects only on the authentication area and functionality, and
// not on the data of the user (Emails, paging, etc...).

import UserAuthentication from '../models/user';

// This function converts a single data of strings into UserAuthentication object instance.
export const toUserAuthentication = (userAuthenticationData) => {

    // Check for existence of userAuthenticationData parameter. If not exists return null instance.
    if (!userAuthenticationData) {

        // Don't create any new instance.
        return null;
    }

    // Return a new UserAuthentication object instance.
    return new UserAuthentication({
        userId: userAuthenticationData.userId,
        userName: userAuthenticationData.userName,
        userPassword: userAuthenticationData.userPassword,
        userToken: userAuthenticationData.userToken,
        userTokenExpirationDate: userAuthenticationData.userTokenExpirationDate,
        userTokenExpireInSeconds: userAuthenticationData.userTokenExpireInSeconds
    });
};