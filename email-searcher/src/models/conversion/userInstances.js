// This conversion file holds the method that converts a given data
// into new instances of UserAuthentication and UserEmails object instances.

import UserAuthentication from '../models/UserAuthentication';
import UserEmails from '../models/UserEmails';

// This function converts single data of strings into UserAuthentication and UserEmails object instances.
export const toUserInstances = (userInstancesData) => {

    // Check for existence of userInstancesData parameter. If not exists return null instance.
    if (!userInstancesData) {

        // Don't create any new instance.
        return null;
    }

    // Return new UserAuthentication and UserEmails objects instances.
    return {
        userAuthentication: new UserAuthentication({
            userId: userInstancesData.userId,
            userName: userInstancesData.userName,
            userPassword: userInstancesData.userPassword,
            userToken: userInstancesData.userToken,
            userTokenExpirationDate: userInstancesData.userTokenExpirationDate,
            userTokenExpireInSeconds: userInstancesData.userTokenExpireInSeconds
        }),
        userEmails: new UserEmails({
            userEmailsList: null,
            userEmailsTotalCount: userInstancesData.userEmailsTotalCount,
            userEmailsCountPerPage: null,
            userEmailsPagesTotalCount: null,
            userEmailsCurrentPageNumber: null,
            userEmailsPagesCountToShow: null,
            userEmailsDeletedCount: null
        })
    };
};