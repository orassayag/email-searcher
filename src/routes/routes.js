// This routes file contains all the map directories of all routes links names
// to redirect to each page in the site application. Since we often use the
// routing links in many places, one change here will affect all the site,
// will be more efficient.

import { createEnum } from '../utils/coreUtils';

// This enum routes defined a dictionary of all the routes.
const Routes = createEnum(new Map([
    ['USER_EMAILS', 'user-emails'],
    ['USER_AUTHENTICATION', 'user-authentication'],
    ['LOGOUT', 'logout'],
    ['SEARCH', '/'],
    ['NOT_FOUND', '*']
]));

export default Routes;