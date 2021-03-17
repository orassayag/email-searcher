// Settings to generate fake data for default representation of emails when the page first loads,
// without the need to call the API server to perform an unnecessary search process.

import * as enums from '../../enums/enums';

const fakeSettings = {

    // From this array can be generated random strings with upper and lower case, and also with numbers.
    // Used to generate fake search keys, fake comments, fake emails, and fake links.
    stringArray: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',

    // From this array can be generated a random email address domain ending, to generate random emails addresses.
    domainsArray: ['gmail.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'yahoo.com', 'aol.com'],

    // From this array can be generated a random URL domain ending, to generate random links.
    linkEndsArray: ['com', 'org', 'net', 'int', 'edu', 'gov', 'mil'],

    // From this enum array, a random fake search engine will be generated for the fake emails.
    searchEngineArray: Object.values(enums.SearchEngine),

    // The exact length of email Id of Email class.
    idStringLength: 20,

    // The minimum email's string characters length to generate a fake email address.
    minimumEmailLength: 5,

    // The maximum email's string characters length to generate a fake email address.
    maximumEmailLength: 20,

    // The minimum link's string characters length to generate a fake link.
    minimumLinkLength: 10,

    // The maximum link's string characters length to generate a fake link.
    maximumLinkLength: 30,

    // DATES
    // In the case of generating fake data - It's only the creation date of the email's row.

    // The start (Minimum) date to generate fake dates.
    minimumDate: new Date(2012, 1, 1),

    // The end (Maximum) date to generate fake dates.
    maximumDate: new Date(),

    // STRINGS
    // This used to create both fake search keys and comments, to generate random
    // words to simulate that some text has been entered.

    // The minimum length to create a single string (Random word).
    minimumStringLength: 5,

    // The maximum length to create a single string (Random word).
    maximumStringLength: 15,

    // SEARCH KEYS
    // When generating a fake search key, a random number of strings is selected, and represent a fake search key.

    // The minimum strings (Words) count of search key to random.
    minimumSearchKeyStringsCount: 2,

    // The maximum strings (Words) count of search keys are random.
    maximumSearchKeyStringsCount: 5,

    // COMMENTS
    // When generating fake comments, a random number of strings is selected, and represent a fake comment.

    // The minimum strings (Words) count of comments to random.
    minimumCommentsStringsCount: 5,

    // The maximum strings (Words) count of comments to random.
    maximumCommentsStringsCount: 15
};

export default fakeSettings;