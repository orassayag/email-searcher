// This file includes all the functions needed to generates fake
// emails to be loaded in the first load of the search-page (Home-page).
// It generates random string for comments and search keys, links, emails,
// creation date, all logic is logic and programmed from the
// logic/fakeSettings.js file, where all the rules of the validation and
// limits are configured and places.

import * as enums from '../enums/enums';
import { generateRandomBoolean, generateRandomNumber } from './textUtils';
import { validateNumber, validateEnumValue } from './validationUtils';
import fakeSettings from '../settings/logic/fakeSettings';
import logicSettings from '../settings/logic/logicSettings';
import translate from '../translate/translate';
import { samples } from '../assets/data/samples';

// This function generates random string.
const generateRandomString = (charactersLength) => {

    // Check the existence and validity of the charactersLength parameter. If invalid, return empty string.
    if (!charactersLength || !validateNumber(charactersLength)) {

        // Return empty string.
        return '';
    }

    // Append random characters and numbers by loop count.
    let text = '';
    for (let i = 0; i < charactersLength; i++) {
        text += fakeSettings.stringArray.charAt(Math.floor(Math.random() * fakeSettings.stringArray.length));
    }

    // Return random string.
    return text;
};

// This function generates random date.
const generateRandomDate = () => {

    // Calculate a date from start to end by ranges and return it.
    const minimumTime = fakeSettings.minimumDate.getTime();

    // Return calculated result.
    return new Date(minimumTime + Math.random() * (fakeSettings.maximumDate.getTime() - minimumTime));
};

// This function generates random email Id.
const generateRandomEmailId = () => {

    // Return random string by count.
    return generateRandomString(fakeSettings.idStringLength);
};

// This function generates random email address.
const generateRandomEmail = () => {

    // Create template base results.
    const emailData = {
        emailKey: generateRandomString(generateRandomNumber({
            minimumNumber: fakeSettings.minimumEmailLength,
            maximumNumber: fakeSettings.maximumEmailLength
        })),
        emailDomain: fakeSettings.domainsArray[generateRandomNumber({
            minimumNumber: 0,
            maximumNumber: fakeSettings.domainsArray.length - 1
        })]
    };

    // Return random email.
    return `${emailData.emailKey}@${emailData.emailDomain}`;
};

// This function generates random link.
const generateRandomLink = () => {

    // Will hold the link data.
    const linkData = {
        linkKey: generateRandomString(generateRandomNumber({
            minimumNumber: fakeSettings.minimumLinkLength,
            maximumNumber: fakeSettings.maximumLinkLength
        })),
        linkEnd: fakeSettings.linkEndsArray[generateRandomNumber({
            minimumNumber: 0,
            maximumNumber: fakeSettings.linkEndsArray.length - 1
        })]
    };

    // Return random URL address.
    return `http${ generateRandomBoolean() ? 's' : '' }://www.${linkData.linkKey}.${linkData.linkEnd}`;
};

// This function generates random search engine.
const genrateRandomSearchEngine = () => {

    // Return random search engine.
    return fakeSettings.searchEngineArray[generateRandomNumber(generateRandomNumber({
        minimumNumber: 0,
        maximumNumber: fakeSettings.searchEngineArray.length - 1
    }))];
};

// This function generates text by random counts.
const generateRandomText = (randomTextData) => {

    // Check for existence of the randomTextData parameters. If not exists or invalid, stop any further actions.
    if (!randomTextData ||
        !validateNumber(randomTextData.minimumStringsCount) || !validateNumber(randomTextData.maximumStringsCount) ||
        !validateNumber(randomTextData.minimumStringLength) || !validateNumber(randomTextData.maximumStringLength)) {

        // Stop any further actions.
        return;
    }

    // Get random characters length.
    const stringsCount = generateRandomNumber({
        minimumNumber: randomTextData.minimumStringsCount,
        maximumNumber: randomTextData.maximumStringsCount
    });

    // Wil hold the final search key result.
    let searchKey = '';

    // Append the search key by loop count of random strings.
    for (let i = 0; i < stringsCount; i++) {
        searchKey += ` ${generateRandomString(generateRandomNumber({
            minimumNumber: randomTextData.minimumStringLength,
            maximumNumber: randomTextData.maximumStringLength
        }))}`;
    }

    // Slice the last space and return calculated append string.
    return searchKey.slice(0, -1);
};

// This function generates random search keys.
const generateRandomSearchKeys = () => {

    // Return random search key.
    return `${translate.search_example_search_key_text} ${generateRandomText({
        minimumStringsCount: fakeSettings.minimumSearchKeyStringsCount,
        maximumStringsCount: fakeSettings.maximumSearchKeyStringsCount,
        minimumStringLength: fakeSettings.minimumStringLength,
        maximumStringLength: fakeSettings.maximumStringLength
    })}`;
};

// This function generates random comments.
const generateRandomComments = () => {

    // Not always there are fake comments in the fake emails, like in the real life,
    // the user will not always keep comments of each email in his emails list.
    // Random bool will determine if to generate comments or to return empty string as comments.
    if (generateRandomBoolean()) {

        // Return empty string if the random bool is true.
        return '';
    }

    // Return random comments.
    return `${translate.search_example_comments_text} ${generateRandomText({
        minimumStringsCount: fakeSettings.minimumCommentsStringsCount,
        maximumStringsCount: fakeSettings.maximumCommentsStringsCount,
        minimumStringLength: fakeSettings.minimumStringLength,
        maximumStringLength: fakeSettings.maximumStringLength
    })}`;
};

// This function generates fake emails for testing in development mode environment.
export const generateFakeEmails = (generateData) => {

    // Validate the generateData parameters. If not exists or invalid, don't generate the fake emails.
    if (!generateData || !validateNumber(generateData.emailsCount)) {
        // Stop any further actions.
        return;
    }

    // Validate that the emailType is valid. Check the validity of the emailType
    // parameter. If invalid - Don't generate the fake emails.
    if (!validateEnumValue({
            enum: enums.EmailType,
            value: generateData.emailType
        })) {

        // Stop any further actions.
        return;
    }

    // Will hold the array of emails.
    let emailsArray = [];

    // Check if to generate fake emails or samples emails from the logic settings.
    if (logicSettings.isSamplesInsteadFakeEmails) {

        // Load all the samples data from the samples json. This file contains real emails search manually by Google,
        // but in order to display samples, we would generate the real data with some random fake data, such as
        // the search engines and the comments.

        // If the emails length array equals to the emails count, no need for random generate, just take all the samples emails.
        if (generateData.emailsCount === samples.length) {
            emailsArray = samples.map((sample) => {
                return {
                    emailId: generateRandomEmailId(),
                    emailUserId: null,
                    emailUserAddedDate: null,
                    emailAddress: sample.emailAddress,
                    emailLink: sample.emailLink,
                    emailCreationDate: new Date(),
                    emailSearchEngine: genrateRandomSearchEngine(),
                    emailSearchKey: sample.emailSearchKey,
                    emailComments: sample.emailComments,
                    emailType: generateData.emailType
                };
            });
        } else {

            // Check if the requested emails count is bigger than the json samples length.
            // If so, take the length and assign it to as the new emails count.
            if (generateData.emailsCount > samples.length) {
                generateData.emailsCount = samples.length;
            }

            // Random numbers that generated. This array is needed to avoid getting duplicates emails records.
            const anArrayOfUniqueNumbers = [];

            // Generate random numbers to take random emails count. Run as long as the new arrays smaller than the requested emails count.
            while (emailsArray.length < generateData.emailsCount) {

                // Get random number to pull out from samples array.
                const number = generateRandomNumber({
                    minimumNumber: 0,
                    maximumNumber: samples.length
                });

                // If the number exists already, continue to the next round.
                if (anArrayOfUniqueNumbers.indexOf(number) >= 0) {
                    continue;
                }

                // Pull out selected sample.
                const sample = samples[number];

                // Insert selected sample into the emails array.
                emailsArray.push({
                    emailId: generateRandomEmailId(),
                    emailUserId: null,
                    emailUserAddedDate: null,
                    emailAddress: sample.emailAddress,
                    emailLink: sample.emailLink,
                    emailCreationDate: new Date(),
                    emailSearchEngine: genrateRandomSearchEngine(),
                    emailSearchKey: sample.emailSearchKey,
                    emailComments: sample.emailComments,
                    emailType: generateData.emailType
                });

                // Insert the selected number into the numbers array.
                anArrayOfUniqueNumbers.push(number);
            }
        }

    } else {

        // Loop and generate fake emails.
        for (let i = 0; i < generateData.emailsCount; i++) {
            emailsArray.push({
                emailId: generateRandomEmailId(),
                emailUserId: null,
                emailUserAddedDate: null,
                emailAddress: generateRandomEmail(),
                emailLink: generateRandomLink(),
                emailCreationDate: generateRandomDate(),
                emailSearchEngine: genrateRandomSearchEngine(),
                emailSearchKey: generateRandomSearchKeys(),
                emailComments: generateRandomComments(),
                emailType: generateData.emailType
            });
        }
    }

    // Return fake emails.
    return emailsArray;
};