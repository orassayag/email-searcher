// In this API file stored all the API calls within promises
// and Axios to the Firebase database to get data or store data
// that related to search processes and emails.
// Note: All calls can be done with ES6 async / await.

import apiSearch from '../api';
import * as enums from '../../enums/enums';

// Handle the call to the API to perform the email search process.
export const search = (searchData) => {
    return new Promise((resolve, reject) => {
        try {

            // ToDo: In Node.js need to pass the searchData object to fetch real emails and not fake.
            apiSearch.get(`/${enums.APIRouteType.FAKE_EMAILS}.json`).then((response) => {
                resolve(response);

            }).catch((error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
};

// Handle the call to the API to perform insert of email (For development checks).
export const insertFakeEmail = (fakeEmailData) => {
    return new Promise((resolve, reject) => {
        try {

            apiSearch.post(`/${enums.APIRouteType.FAKE_EMAILS}.json`, fakeEmailData).then((response) => {
                resolve(response);

            }).catch((error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
};