// In this API file stored all the API calls within promises
// and Axios to the Firebase database to get data or store data
// that related to user-authentication actions.
// Note that the separation between 'api' and 'apiUserAuthentication' took
// place due to the separation in Firebase for authentication operations
// and CRUD operations in different URL paths, so there are
// two different Axios instances.
// Note: All calls can be done with ES6 async / await.

import apiUserAuthentication from '../apiUserAuthentication';
import settings from '../../settings/application/settings';

// Handle the call to the API to perform the login / registration process.
export const userAuthentication = (userAuthenticationData) => {
    return new Promise((resolve, reject) => {

        // Prepare the data to send.
        const userAuthenticationDataRequest = {
            email: userAuthenticationData.emailText,
            password: userAuthenticationData.passwordText,
            returnSecureToken: true // For Firebase database only.
        };

        try {

            apiUserAuthentication.post(`/${userAuthenticationData.apiMethod}?key=${settings.apiBaseUserAuthenticationKey}`, userAuthenticationDataRequest).then((response) => {
                resolve(response);

            }).catch((error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
};