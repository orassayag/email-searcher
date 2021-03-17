// This enums file contains all the map dictionaries that
// related to user-authentication operation in storing data in
// localStorage, or errors, or methods to call the
// API, and so on.

import { createEnum } from '../../utils/coreUtils';

// These enums determine the authentication mode of the user in user-authentication
// page, to display the registration or the login panels.
export const UserAuthenticationModeType = createEnum(new Map([
    ['LOGIN', 'login'],
    ['REGISTRATION', 'registration']
]));

// This enums used to determine which method type, according to the
// authentication mode, if login or register, to use to the API server.
export const UserAuthenticationAPIMethod = createEnum(new Map([
    ['SIGNUP_NEW_USER', 'signupNewUser'],
    ['VERIFY_PASSWORD', 'verifyPassword']
]));

// This enum is used in order to manage the localStorage and user fields.
// Important note: DON'T change the order of the fields, it's critical in localStorage cases.
export const UserParameter = createEnum(new Map([
    ['USER_ID', 'userId'],
    ['USER_NAME', 'userName'],
    ['USER_TOKEN', 'userToken'],
    ['USER_TOKEN_EXPIRATION_DATE', 'userTokenExpirationDate'],
    ['USER_EMAILS_TOTAL_COUNT', 'userEmailsTotalCount']
]));

// This enum used to bring a specific error message to the user that tries to
// login / register on the user-authentication page, both on login / registration panels.
export const ErrorAuthenticationType = createEnum(new Map([
    ['EMAIL_EXISTS', 'EMAIL_EXISTS'],
    ['INVALID_EMAIL', 'INVALID_EMAIL'],
    ['MISSING_PASSWORD', 'MISSING_PASSWORD'],
    ['EMAIL_NOT_FOUND', 'EMAIL_NOT_FOUND'],
    ['TOKEN_EXPIRED', 'TOKEN_EXPIRED']
]));

// This enum defines the modal type that opens on the search-page (Home-page), when the user is not authenticated,
// to display the text type and the image according to the action that the user tried to perform.
export const AuthenticationRequiredModalType = createEnum(new Map([
    ['ADD', 'add'],
    ['SEARCH', 'search']
]));