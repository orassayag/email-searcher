// This conversion file holds a several helpers function to convert data
// received into Email class, if it’s a fake email or server email. A fake
// email is an email that not came from the API server and it's not created
// due to generated random strings, in the first load of the search-page
// (Home-page). A search email is a 'real' email that received from the
// API server as a result of a search process operation.

import Email from '../models/Email';
import { validateArrayItems, validateNumber } from '../../utils/validationUtils';
import { getObjectKeysLength, hasObjectKeys, generateRandomNumber } from '../../utils/textUtils';
import logicSettings from '../../settings/logic/logicSettings';

// This function convert a single data of strings into email class instance.
const toEmail = (emailData) => {

    // Check for existence of emailData parameter. If not exists return null instance.
    if (!emailData) {

        // Don't create any new instance.
        return null;
    }

    // Return new Email object instance.
    return new Email({
        emailId: emailData.emailId,
        emailUserId: emailData.emailUserId,
        emailUserAddedDate: emailData.emailUserAddedDate,
        emailAddress: emailData.emailAddress,
        emailLink: emailData.emailLink,
        emailCreationDate: emailData.emailCreationDate,
        emailSearchEngine: emailData.emailSearchEngine,
        emailSearchKey: emailData.emailSearchKey,
        emailComments: emailData.emailComments,
        emailType: emailData.emailType
    });
};

// This function will convert server emails into Email class instances.
// On Firebase the results wrapped with the Id token, and there is a need to extract it.
// In Node.js API server we would need this method to parse some elements (Search engine enum, creation date, so on…).
// Also, we limit the search results emails count to the logic settings number as maximum.
const toServerEmails = (emailsArrayData) => {

    // If invalid parameter or empty array, or invalid emails count, return an empty array.
    if (!emailsArrayData || !emailsArrayData.emailsArray || hasObjectKeys(emailsArrayData.emailsArray)) {

        // Return empty array.
        return [];
    }

    // Will hold the return new array of emails.
    const emailsArray = [];

    // Check if there is a valid limit count of emails. If there is no such limit,
    // convert all emails. If there is, cut the limit of emails to be converted.
    const emailsCountLimit = Number(emailsArrayData.emailsCount);

    // If a limit exists, cut the limit number of emails. Take only first count of emails to display,
    // since we don't want to display more than that (Short and fast searches). If lower than the
    // given count, don't do anything.
    if (emailsCountLimit && validateNumber(emailsCountLimit)) {

        // Check if it exceeds the limit.
        if (getObjectKeysLength(emailsArrayData.emailsArray) > emailsCountLimit) {

            // Slice to a new array within a specific count.
            emailsArrayData.emailsArray = Object.entries(emailsArrayData.emailsArray).slice(0, emailsCountLimit).map(entry => entry[1]);
        }
    }

    // Check if the limit exists and if to generate fake emails or sample emails from the logic settings.
    if (emailsCountLimit && logicSettings.isSamplesInsteadFakeEmails) {

        // Get random results of emails.
        // Random numbers that are generated. This array is needed to avoid getting duplicates emails records.
        const anArrayOfUniqueNumbers = [];

        // Generate random numbers to take random emails count. Run as long as the new arrays smaller than the requested emails count.
        while (emailsArray.length < emailsCountLimit) {

            // Get a random number to pull out from the sample array.
            const number = generateRandomNumber({
                minimumNumber: 0,
                maximumNumber: emailsCountLimit
            });

            // If the number exists already, continue to the next round.
            if (anArrayOfUniqueNumbers.indexOf(number) >= 0) {
                continue;
            }

            // Convert the creation date to date object.
            emailsArray.push(toEmail(emailsArrayData.emailsArray[number]));

            // Insert the selected number into the numbers array.
            anArrayOfUniqueNumbers.push(number);
        }
    } else {

        // Loop on the key / value result from the server and fetch them into an email array.
        for (const key in emailsArrayData.emailsArray) {

            // Convert the creation date to date object.
            emailsArray.push(toEmail(emailsArrayData.emailsArray[key]));
        }
    }

    // Return emails array.
    return emailsArray;
};

// This function will convert fake emails that are created from generated inner code into Email class instances.
const toFakeEmails = (emailsArray) => {

    // If invalid parameter or empty array, return an empty array.
    if (!validateArrayItems(emailsArray)) {

        // Return empty array.
        return [];
    }

    // Will hold the array of emails.
    const emails = [];

    // Loop all items and convert them to Email instances.
    for (let i = 0; i < emailsArray.length; i++) {
        emails.push(toEmail(emailsArray[i]));
    }

    // Return emails array.
    return emails;
};

// This function gets an array of strings data (From API server request
// or fake emails array) and converts them into email classes instances.
export const toEmails = (emailsArrayData) => {

    // Check the existence and validity of the emailsArrayData parameter.
    // If missing parameters return an empty array.
    if (!emailsArrayData) {

        // Return empty array.
        return [];
    }

    // Check if it’s a conversion to be made by fake emails or by server API emails and send the request to appropriate.
    return emailsArrayData.isFakeProcess ? toFakeEmails(emailsArrayData.emailsArray) : toServerEmails(emailsArrayData);
};

// This function prepares the email class instance to be saved on the API.
// This gets a user and assigns the email to the current user, including the
// user Id and the added date of the current time that the email was added to this emails list.
// Also, it removes unnecessary fields to be saved to the database.
export const toEmailModal = (data) => {

    // Check that the user and email are not null. If so - Return null instance.
    if (!data || !data.userAuthentication || !data.emailItem) {

        // Return null instance.
        return null;
    }

    // Create a copy of the email.
    const updatedEmail = { ...data.emailItem };

    // Assign the user fields.
    updatedEmail.emailUserId = data.userAuthentication.userId;
    updatedEmail.emailUserAddedDate = new Date();

    // Remove unnecessary email fields to be saved on the database.
    delete updatedEmail.emailActionType;
    delete updatedEmail.isEmailMoreInformationMode;

    // Return the email to be saved to the database.
    return updatedEmail;
};