// In this API file stored all the API calls within promises
// and Axios to the Firebase database to get data or store data
// that related to user emails actions.
// Note that the separation between "api" and "apiUserAuthentication" took
// place due to the separation in Firebase for authentication operations
// and CRUD operations in different URL paths, so there are
// two different Axios instances.
// Note: All calls can be done with ES6 async / await.

import apiUserEmail from '../api';
import * as enums from '../../enums/enums';

// Handle the call to the API to preform get user emails total count process.
export const getUserEmails = (userEmailsData) => {
    return new Promise((resolve, reject) => {
        try {

            // Note that in Node.js API server we will take the emails total count with the user-authentication request and we will not need this request.
            apiUserEmail.get(`/${enums.APIRouteType.USER_EMAILS}.json?auth=${userEmailsData.userAuthentication.userToken}&orderBy="emailUserId"&equalTo="${userEmailsData.userAuthentication.userId}"`).then((response) => {
                resolve(response);

            }).catch((error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
};

// Handle the call to the API to preform get operation of the object top Id.
export const getFirebaseTopEmailId = (userEmailsData) => {
    return new Promise((resolve, reject) => {
        try {

            apiUserEmail.get(`/${enums.APIRouteType.USER_EMAILS}.json?auth=${userEmailsData.userAuthentication.userToken}&orderBy="emailId"&equalTo="${userEmailsData.emailItem.emailId}"`).then((response) => {
                resolve(response);

            }).catch((error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
};

// Handle the call to the API to preform insert of email object to the user's emails list.
export const addUserEmail = (userAddEmailData) => {
    return new Promise((resolve, reject) => {
        try {

            apiUserEmail.post(`/${enums.APIRouteType.USER_EMAILS}.json?auth=${userAddEmailData.userAuthentication.userToken}`, userAddEmailData.emailItem).then((response) => {
                resolve(response);

            }).catch((error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
};

// Handle the call to the API to preform delete of email object to the user's emails list.
export const deleteUserEmail = (userDeleteEmailData) => {
    return new Promise((resolve, reject) => {
        try {

            apiUserEmail.delete(`/${enums.APIRouteType.USER_EMAILS}/${userDeleteEmailData.emailId}.json?auth=${userDeleteEmailData.userAuthentication.userToken}`).then((response) => {
                resolve(response);

            }).catch((error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
};