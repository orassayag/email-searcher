// This file creates Axios instance to serve all the login
// and registration operations in the site application. The
// separation from the regular CRUD path is due to Firebase
// configurations, that creates two different URL pats for
// the two actions.

import axios from 'axios';
import settings from '../settings/application/settings';

// Create the user API route instance by Axios.
const apiUserAuthentication = axios.create({
    baseURL: settings.apiBaseUserAuthenticationURL
});

export default apiUserAuthentication;