// This enums file contains all the map dictionaries that
// related to general issues around the site application
// like validations and search engines.

import { createEnum } from '../../utils/coreUtils';

// This enum defines the input types of the user-authentication page.
export const UserAuthenticationInputType = createEnum(new Map([
    ['EMAIL', 'email'],
    ['PASSWORD', 'password']
]));

// This enum defines the modal name types that can be displayed to
// the user, according to the specific action he tried to perform.
export const ModalName = createEnum(new Map([
    ['ADD_EMAIL', 'add-email'],
    ['DELETE_EMAIL', 'delete-email'],
    ['EMAILS_LIMIT_EXCEEDED', 'emails-limit-exceeded'],
    ['AUTHENTICATION_REQUIRED', 'authentication-required']
]));

// This enum determines types of length characters of
// a given string validation, of minimum or maximum types.
export const ValidateCharactersType = createEnum(new Map([
    ['MINIMUM', 'MINIMUM'],
    ['MAXIMUM', 'MAXIMUM']
]));

// This enum determines types of validation function to take place on
// specific props (Input / button / autocomplete) to verify that the
// input type is valid from a given string.
export const ValidationFunctionType = createEnum(new Map([
    ['INPUT', 'input'],
    ['BUTTON', 'button'],
    ['AUTOCOMPLETE', 'autocomplete']
]));

// This enum defines the error types to write in the console or to throw
// an exception to the client in case of missing or invalid parameters.
export const ErrorType = createEnum(new Map([
    ['MISSING', 'missing'],
    ['INVALID', 'invalid']
]));

// This enum defines the API routes of the tables in the
// database (According to Firebase database) to perform CRUD operations.
export const APIRouteType = createEnum(new Map([
    ['AUTHENTICATION', 'authentication'],
    ['FAKE_EMAILS', 'fake_emails'],
    ['USER_EMAILS', 'user_emails']
]));

// This enum defines the possible search engines that the email item was
// found within the search process. Also used to create fake emails.
export const SearchEngine = createEnum(new Map([
    ['BING', 'Bing'],
    ['YAHOO', 'Yahoo!'],
    ['ASK_COM', 'Ask.com'],
    ['AOL', 'AOL'],
    ['BAIDU', 'Baidu'],
    ['DUCK_DUCK_GO', 'DuckDuckGo']
]));

// This enum defines the effect that the user will experience each time
// that the user browses from page to page.
export const PageTransitionType = createEnum(new Map([
    ['FADE_IN', 'fade_in'],
    ['FADE_OUT', 'fade_out'],
    ['RANDOM', 'random']
]));