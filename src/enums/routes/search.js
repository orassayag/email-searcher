// This enums file contains all the map dictionaries that
// related to search and emails operation selecting
// search modes and options, and other properties.

import { createEnum } from '../../utils/coreUtils';

// This enum define the search types that the user can perform, by searching
// emails within a given text string or by given specific URL address.
export const SearchMode = createEnum(new Map([
    ['TEXT', 'text'],
    ['URL', 'URL']
]));

// This enum define is a search option type for the search operation process,
// if to include or exclude a certain element from the search operation.
export const SearchOption = createEnum(new Map([
    ['INCLUDE', 'include'],
    ['EXCLUDE', 'exclude']
]));

// All items in this enum represent search option in the search-page (Home-page),
// and for each of them there is different validation and preferences.
const SearchOptionType = [
    ['DOMAINS', 'email-domains'],
    ['KEYS', 'email-keys'],
    ['URLS', 'URLs']
];

// All items in this enum represent elements in the search-page (Home-page),
// and for each of them there is different validation and preferences.
export const SearchElementType = createEnum(new Map([
    ['SEARCH_KEY', 'search-key'],
    ['MODE', 'search-mode'],
    ['COMMENTS', 'comments'],
    ...SearchOptionType
]));

// This enum define a reference points to scroll to elements in
// mobile and small devices, once a certain action has been taken place.
export const SearchScrollPosition = createEnum(new Map([
    ['RESULTS', 'results'],
    ...SearchOptionType
]));

// This enum define the emails types exists in the application: fake is a generated random string
// emails that not really exists, and search is a real email that fetched within a real search process.
export const EmailType = createEnum(new Map([
    ['FAKE', 'fake'],
    ['SEARCH', 'search']
]));

// This enum define the actions types that the user can perform on email row.
// They don't store in the database, but only for UI effect usages.
export const EmailActionType = createEnum(new Map([
    ['CREATED', 'created'],
    ['ADDED', 'added'],
    ['DELETED', 'deleted']
]));

// This enum define the search option properties (Originally these are the "search option"
// objects on the search reducer stet) to edit dynamically each field in a different action.
export const SearchOptionProperty = createEnum(new Map([
    ['VALUE', 'value'],
    ['IS_SEARCH_OPTION_SHOW', 'isSearchOptionShow'],
    ['MODE', 'mode'],
    ['ERROR_MESSAGE', 'errorMessage'],
    ['TOGGLE', 'toggle']
]));