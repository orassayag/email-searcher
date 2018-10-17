// This file includes all the core logic that helps the user functions
// and utile, that are meant to be called from the user saga, to perform
// all actions needed. Functions like validate all inputs before login
// or registration operation and add email to user emails list operations,
// are placed here. This file created to save space on the userEmails sagas
// itself and to keep it cleaner, and the long and repeatable logic
// to keep here, out of the sagas.

import * as enums from '../enums/enums';
import * as storageUtils from './storageUtils';
import { copyObjectsArray, getFunctionName } from './coreUtils';
import { validateArrayItems, validateNumber } from './validationUtils';
import { getObjectKeysLength, getHighestNumberInArray } from './textUtils';
import { isUserVerifiedAuthentication } from './userAuthenticationUtils';
import logicSettings from '../settings/logic/logicSettings';
import { toEmails } from '../modals/conversion/email';
import ManageEmailValidationResult from '../modals/helpers/ManageEmailValidationResult';

// This function sets the user emails count on localStorage.
export const setUserEmailsTotalCount = (userEmailsTotalCount) => {

    // Check the validity of the count. If invalid - Don't do nothing.
    if (!validateNumber(userEmailsTotalCount)) {

        // Stop any further actions.
        return;
    }

    // Update the data.
    storageUtils.setItem(enums.UserParameter.USER_EMAILS_TOTAL_COUNT, userEmailsTotalCount);
};

// This function validate the get emails data request before doing any further
// actions (Like going to the API server database to get the user emails) and
// verify that all the data of the request is valid and ready to be sent to
// the API to get the user emails.
export const validateGetUserEmails = (userGetEmailsRequest) => {

    // Will hold the final results of the user emails.
    const validationResult = {
        errorToConsole: null
    };

    // Validate the existence of parameters in userAuthentication instance.
    // If some missing - Print console error to the user, and show a general error message to the user.
    if (!userGetEmailsRequest || !isUserVerifiedAuthentication(userGetEmailsRequest.userAuthentication)) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['userGetEmailsRequest', 'userAuthentication', 'userId', 'userToken'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Validate the existence and validity of parameters in userEmails instance.
    // If missing - Print console error to the user, and show a general error message to the user.
    if (!userGetEmailsRequest.userEmails) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['userEmails'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Check the validity of parameters in userEmails instance.
    // If some invalid - Print console error to the user, and show a general error message to the user.
    if (!validateNumber(userGetEmailsRequest.userEmails.userEmailsTotalCount) ||
        !validateNumber(userGetEmailsRequest.userEmails.userEmailsCountPerPage) || !validateNumber(userGetEmailsRequest.userEmails.userEmailsPagesTotalCount) ||
        !validateNumber(userGetEmailsRequest.userEmails.userEmailsCurrentPageNumber) || !validateNumber(userGetEmailsRequest.userEmails.userEmailsPagesCountToShow) ||
        !validateNumber(userGetEmailsRequest.userEmails.userEmailsDeletedCount)) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['userEmailsTotalCount', 'userEmailsCountPerPage', 'userEmailsPagesTotalCount', 'userEmailsCurrentPageNumber',
                'userEmailsPagesCountToShow', 'userEmailsDeletedCount'
            ],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Validate updated pager value is exists.
    if (userGetEmailsRequest.updatedPagerValue) {

        // If exists, check that is a valid number.
        // If invalid - Print console error to the user, and show a general error message to the user.
        if (!validateNumber(userGetEmailsRequest.updatedPagerValue)) {

            // Assign the error details to print to the console.
            validationResult.errorToConsole = {
                errorType: enums.ErrorType.INVALID,
                parameters: ['updatedPagerValue'],
                functionName: getFunctionName()
            };

            // Return the validation results.
            return validationResult;
        }
    }

    // Validate updated counter value is exists.
    if (userGetEmailsRequest.updatedCounterValue) {

        // If exists, check that is a valid number.
        // If invalid - Print console error to the user, and show a general error message to the user.
        if (!validateNumber(userGetEmailsRequest.updatedCounterValue)) {

            // Assign the error details to print to the console.
            validationResult.errorToConsole = {
                errorType: enums.ErrorType.INVALID,
                parameters: ['updatedCounterValue'],
                functionName: getFunctionName()
            };
        }
    }

    // Return the validation results.
    return validationResult;
};

// This function gets the data response from the API server call from the database,
// after the emails already fetched from the database, and convert the specific emails
// by pager and count to Email instances classes and return it, ready to display on
// the state and display to the user.
export const getUserEmails = (userGetEmailsRequest) => {

    // Will hold the final data results.
    // Check if the page number or the count of emails per page has been
    // changed by the user. If so - Use the updated configuration
    // for the emails paging to get relevant results.
    const getUserEmailsResultData = {
        totalEmailsCount: getObjectKeysLength(userGetEmailsRequest.emailsDataBase),
        emailsCountPerPage: userGetEmailsRequest.updatedCounterValue ? userGetEmailsRequest.updatedCounterValue : userGetEmailsRequest.userEmails.userEmailsCountPerPage,
        currentPageNumber: userGetEmailsRequest.updatedPagerValue ? userGetEmailsRequest.updatedPagerValue : userGetEmailsRequest.userEmails.userEmailsCurrentPageNumber,
        totalPagesCount: 0,
        indexStart: 0,
        indexEnd: 0,
        emailsDeletedCount: userGetEmailsRequest.userEmails.userEmailsDeletedCount,
        pagesCountToShow: userGetEmailsRequest.userEmails.userEmailsPagesCountToShow,
        emails: null
    };

    // Check once again if emails count is empty. If so, once again don't do
    // anything, just update the localStorage with updated emails count.
    if (getUserEmailsResultData.totalEmailsCount <= 0) {

        // Return the default data without doing any action.
        return getUserEmailsResultData;
    }

    // Calculate how many pages to show in pager.
    getUserEmailsResultData.totalPagesCount = Number(getUserEmailsResultData.totalEmailsCount / getUserEmailsResultData.emailsCountPerPage);
    if (Number(getUserEmailsResultData.totalEmailsCount % getUserEmailsResultData.emailsCountPerPage) > 0) {
        getUserEmailsResultData.totalPagesCount++;
    }

    // Make a floor operation to the pages count.
    getUserEmailsResultData.totalPagesCount = Math.floor(getUserEmailsResultData.totalPagesCount);

    // Calculate the indexes to slice from database.
    getUserEmailsResultData.indexStart = (getUserEmailsResultData.currentPageNumber - 1) * getUserEmailsResultData.emailsCountPerPage;
    getUserEmailsResultData.indexEnd = getUserEmailsResultData.indexStart + getUserEmailsResultData.emailsCountPerPage;

    // Convert all data from database of Firebase to array of Emails class instances.
    // Convert the emails from the server to Email class instances and return the result.
    // Note that emailsCount is null, so there is no limitation of emails count from
    // the server API to convert, unlike on the search-page (Home-page), where the there is a limit
    // of emails for conversion.
    getUserEmailsResultData.emails = toEmails({
        emailsCount: null,
        emailsArray: userGetEmailsRequest.emailsDataBase,
        isFakeProcess: false
    });

    // If total count number is less then minimum number of pagers, just return the emails.
    // Slice the emails from database by the calculated section.
    // Note that unfortunately, due to limitations of Firebase REST API we can't do "real" paging of
    // sending "from" and "take" like in real world applications, so we do the paging programmatically.
    if (getUserEmailsResultData.totalEmailsCount > logicSettings.minimumEmailsCountToShowPager) {

        // Slice the desired emails rows by indexes.
        getUserEmailsResultData.emails = getUserEmailsResultData.emails.slice(getUserEmailsResultData.indexStart, getUserEmailsResultData.indexEnd);
    }

    // Return all updated data to update the userEmails instance and the state.
    return getUserEmailsResultData;
};

// This function validates the data request to toggle the email
// item row "More information" panel to show / hide it by clicking
// on the email row. This function validates all the parameters and
// toggle the email row, and return an updated emails list, ready to
// be update on the state.
export const toggleEmailMoreInformationPanel = (toggleEmailData) => {

    // Will hold the final result of the toggle validation and updated emails list.
    const validationResult = {
        ignoreAction: false,
        emails: null,
        errorToConsole: null
    };

    // Check if the user click wasn't the on the 'X' on the corner, but in other places.
    // If click on 'X', don't do anything, the user don't want to open the panel,
    // he want to delete the email.
    if (toggleEmailData.className && toggleEmailData.className === 'fa fa-close') {

        // Set the ignoreAction parameter to true, to stop any further actions in the saga.
        validationResult.ignoreAction = true;

        // Return validation results.
        return validationResult;
    }

    // Validate the existence of the toggleEmailData parameters. If invalid - Print error to the console and don't do anything.
    if (!toggleEmailData || !toggleEmailData.userEmails || !validateArrayItems(toggleEmailData.userEmails.userEmailsList) || !toggleEmailData.emailId) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['toggleEmailData', 'userEmails', 'userEmailsList', 'emailId'],
            functionName: getFunctionName()
        };

        // Return validation results.
        return validationResult;
    }

    // Delete email from user's emails list.
    // Make a shallow copy of the emails.
    validationResult.emails = [...toggleEmailData.userEmails.userEmailsList];

    // Check that the email is found in the user's emails list.
    const emailToUpdateIndex = validationResult.emails.findIndex(email => email.emailId === toggleEmailData.emailId);

    // If not found - Print error to the console and don't do anything.
    if (emailToUpdateIndex < 0) {

        // Clear any values assigned and assign the error details to print to the console.
        validationResult.emails = null;
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['emailToUpdateIndex'],
            functionName: getFunctionName()
        };

        // Return validation results.
        return validationResult;
    }

    // Toggle the specific email isEmailMoreInformationMode parameter.
    validationResult.emails[emailToUpdateIndex].isEmailMoreInformationMode = !validationResult.emails[emailToUpdateIndex].isEmailMoreInformationMode;

    // Return the updated emails list to be updated on the userEmails emails list on the state.
    return validationResult;
};

// This function gets a data request from the saga that in charge of updating
// the count of emails to display on each page on user-emails page, validates
// all the data and return the validation result, ready to load the emails list once again.
export const userCounterUpdate = (userCounterUpdateData) => {

    // Will hold the final results of the user emails.
    const validationResult = {
        isUpdateState: true,
        newCounterValue: null,
        errorToConsole: null
    };

    // Check the existence of the userCounterUpdateData parameters. If not exists, print error to the console.
    if (!userCounterUpdateData || !userCounterUpdateData.userEmails || !userCounterUpdateData.userEmails.userEmailsCountPerPage) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['userCounterUpdateData', 'userEmails', 'userEmailsCountPerPage'],
            functionName: getFunctionName()
        };

        // Return validation results.
        return validationResult;
    }

    // Check that the counter value is a number.
    validationResult.newCounterValue = Number(userCounterUpdateData.newCounterValue);

    // If not a number - Print error to console.
    if (!validateNumber(validationResult.newCounterValue)) {

        // Remove invalid value and assign the error details to print to the console.
        validationResult.newCounterValue = null;
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['newCounterValue'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Validate that the given number is not less or equal than zero, or bigger than
    // the maximum available number of counts that defined in logic settings. If invalid, print error to the console.
    if (userCounterUpdateData.newCounterValue <= 0 || userCounterUpdateData.newCounterValue > getHighestNumberInArray(logicSettings.emailsCounterOptionsList)) {

        // Remove invalid value and assign the error details to print to the console.
        validationResult.newCounterValue = null;
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['newCounterValue'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Check that the counter value is different from the current counter value. If it’s the same, don't do anything.
    if (userCounterUpdateData.userEmails.userEmailsCountPerPage === validationResult.newCounterValue) {

        // Set the update the state to false.
        validationResult.isUpdateState = false;
    }

    // Return validation results.
    return validationResult;
};

// This function gets a data request from the saga that in charge of updating
// the page navigation of emails to display on each page on user-emails page, validates
// all the data and return the validation result, ready to load the emails list once again.
export const userPagerUpdate = (userPagerUpdateData) => {

    // Will hold the final results of the user emails.
    const validationResult = {
        isUpdateState: true,
        newPagerValue: null,
        errorToConsole: null
    };

    // Check the existence of the userPagerUpdateData parameters. If not exists create error and return the result.
    if (!userPagerUpdateData || !userPagerUpdateData.userEmails || !userPagerUpdateData.userEmails.userEmailsCurrentPageNumber) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['userPagerUpdateData', 'userEmails', 'userEmailsCurrentPageNumber'],
            functionName: getFunctionName()
        };

        // Return validation results.
        return validationResult;
    }

    // Check which type of page actually clicked (Next, previous, or in the default section - A specific number).
    switch (userPagerUpdateData.newPagerValue) {
        case enums.PagerLink.NEXT:

            // Check if there is an option to go next or the current page is the last page. If so - Don't do anything.
            if (userPagerUpdateData.userEmails.userEmailsCurrentPageNumber === userPagerUpdateData.userEmails.userEmailsPagesTotalCount) {

                // Set the update the state to false.
                validationResult.isUpdateState = false;

                // Return the validation results.
                return validationResult;
            }

            // Update the new pager value one place forward.
            validationResult.newPagerValue = userPagerUpdateData.userEmails.userEmailsCurrentPageNumber + 1;
            break;
        case enums.PagerLink.PREVIOUS:

            // Check if there is an option to go previous or the current page is the first page.
            validationResult.newPagerValue = userPagerUpdateData.userEmails.userEmailsCurrentPageNumber - 1;

            // If the new page number is invalid, don't do anything and return.
            if (validationResult.newPagerValue <= 0) {

                // Set the update the state to false.
                validationResult.isUpdateState = false;

                // Return the validation results.
                return validationResult;
            }
            break;
        default:

            // Convert the string number to a real number.
            userPagerUpdateData.newPagerValue = Number(userPagerUpdateData.newPagerValue);

            // If not a number (Except next or previous) - Throw exception.
            if (!validateNumber(userPagerUpdateData.newPagerValue)) {

                // Remove invalid value and assign the error details to print to the console.
                validationResult.newPagerValue = null;
                validationResult.errorToConsole = {
                    errorType: enums.ErrorType.INVALID,
                    parameters: ['newPagerValue'],
                    functionName: getFunctionName()
                };

                // Return the validation results.
                return validationResult;
            }

            // Check that the page number is on the limits. If invalid, don't do anything.
            if (userPagerUpdateData.newPagerValue <= 0 || userPagerUpdateData.newPagerValue > userPagerUpdateData.userEmails.userEmailsPagesTotalCount) {

                // Remove invalid value and assign the error details to print to the console.
                // Assign the error details to print to the console.
                validationResult.newPagerValue = null;
                validationResult.errorToConsole = {
                    errorType: enums.ErrorType.INVALID,
                    parameters: ['newPagerValue'],
                    functionName: getFunctionName()
                };

                // Return the validation results.
                return validationResult;
            }

            // If all valid, assign the new pager number value to be updated.
            validationResult.newPagerValue = userPagerUpdateData.newPagerValue;
            break;

    }

    // Check if the clicked page is not the current page. If they are equal, don't do anything.
    if (userPagerUpdateData.newPagerValue === userPagerUpdateData.userEmails.userEmailsCurrentPageNumber) {

        // Set the update the state to false.
        validationResult.isUpdateState = false;
    }

    // Return validation results.
    return validationResult;
};

// This function validates basic level requests of both add and delete
// operation processes, since the parameters required are the
// same for both operations. It validates all the required parameters
// and continue for the next validation function if needed, or
// just return the validation results.
export const validateToggleManageEmailModal = (toggleManageEmailModalData) => {

    // Create the template to update the state.
    let validationResult = {
        emailItem: null,
        emailAddress: null,
        errorToConsole: null
    };

    // Validate existence of the toggleManageEmailModalData parameters. If one of the parameters are
    // missing - User clicked on the X on add / delete email modal, or something is wrong,
    // don't display the modal to the user. Either cases - Hide the add email modal window.
    if (!toggleManageEmailModalData || !toggleManageEmailModalData.emailId || !validateArrayItems(toggleManageEmailModalData.emails)) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['toggleManageEmailModalData', 'emailId', 'emails'],
            functionName: getFunctionName()
        };

        // Return validation results.
        return validationResult;
    }

    // Get the emailId selected by the user. Then, validate that the Id exists.
    // If not - Something is wrong, don't display the modal to the user.
    validationResult.emailId = toggleManageEmailModalData.emailId.substr(6);

    // Check the validity of the emailId.
    if (!validationResult.emailId) {

        // Clear any values assigned and assign the error details to print to the console.
        validationResult.emailId = null;
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['emailId'],
            functionName: getFunctionName()
        };

        // Return validation results.
        return validationResult;
    }

    // Get the specific email row from the email's list by the fetched Id.
    // If the email row doesn’t exists by the Id - Something is wrong, don't display the modal to the user.
    validationResult.emailItem = toggleManageEmailModalData.emails.find(item => item.emailId === validationResult.emailId);

    // Check if emailItem found.
    if (!validationResult.emailItem) {

        // Clear any values assigned and assign the error details to print to the console.
        validationResult.emailId = null;
        validationResult.emailItem = null;
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['emailItem'],
            functionName: getFunctionName()
        };

        // Return validation results.
        return validationResult;
    }

    // Verify that the email wasn't added / deleted (According to the specific case that the user process into).
    // If so - Don't do nothing. Something is wrong, don't display the modal to the user.
    // If the email already added / deleted and clicked on again - No need to do nothing.
    if (validationResult.emailItem.emailActionType &&
        validationResult.emailItem.emailActionType === toggleManageEmailModalData.emailActionType) {

        // Clear any values assigned and assign the error details to print to the console.
        validationResult.emailId = null;
        validationResult.emailItem = null;
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['emailActionType'],
            functionName: getFunctionName()
        };

        // Return validation results.
        return validationResult;
    }

    // Assign the email address after success specific validation.
    // Set the email address from the selected email row to the success data.
    validationResult.emailAddress = validationResult.emailItem.emailAddress;

    // Return validation results.
    return validationResult;
};

// This function called after an email was added / delete from / to user's emails list, and it creates a
// copy of the emails list and update the relevant email to be mark as added / deleted, to
// display the user that the email was added / deleted.
export const setManageEmailAction = (manageEmailData) => {

    // Will hold the final result of the email action and updated emails list.
    const validationResult = {
        emails: null,
        errorToConsole: null
    };

    // Validate the existence and the validity of the manageEmailData parameters. If some of the parameters are invalid - Don't do nothing.
    if (!manageEmailData || !validateArrayItems(manageEmailData.emails) || !manageEmailData.emailId) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['manageEmailData', 'emails', 'emailId'],
            functionName: getFunctionName()
        };

        // Return validation results
        return validationResult;
    }

    // Make a copy of the emails.
    validationResult.emails = copyObjectsArray(manageEmailData.emails);

    // Make the index of the of the relevant email. If the email not found in the list - Something went wrong - Don't do nothing.
    const emailToUpdateIndex = validationResult.emails.findIndex(email => email.emailId === manageEmailData.emailId);

    // Check if the emailToUpdateIndex found.
    if (emailToUpdateIndex < 0) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['emailToUpdateIndex'],
            functionName: getFunctionName()
        };

        // Return validation results.
        return validationResult;

    }

    // Update the email and return the updated emails list.
    validationResult.emails[emailToUpdateIndex].emailActionType = manageEmailData.emailActionType;

    // Return validation results.
    return validationResult;
};

// This function validates a validation results from other function,
// both of adding and deleting emails operations, and since the validation
// logic repeats itself on both cases, it’s better to put the validation
// logic all together in one function. It validates the existence of an
// email item and the action that not already been made.
const validateActionExists = (validationResult) => {

    // Check the existence and validity of the validationResult parameters.
    if (!validationResult || !validationResult.emailItem) {

        // Validation failed, return null object.
        return null;
    }

    // Check that the email was not already added / deleted from / to user's emails list. If so - Don't do nothing.
    // If the email already added / deleted and clicked on again - Don't do nothing.
    if (validationResult.emailItem.emailActionType && validationResult.emailItem.emailActionType === validateActionExists.emailActionType) {

        // Clear any assigned values and assign the error details to print to the console.
        validationResult.emailItem = null;
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['emailActionType'],
            functionName: getFunctionName()
        };
    }

    // Return the validation results.
    return validationResult;
};

// This function gets an array of emails and an email Id and return the email
// item from the emails array by the Id. Later on, the result would validate
// on other function. Since this logic repeats itself in many places, it's
// better to creates one function that operate and preform this logic.
const validateEmailExists = (validateEmailExistsData) => {

    // Check the existence and validity of the validateEmailExistsData parameters.
    if (!validateEmailExistsData || !validateEmailExistsData.emailId || !validateArrayItems(validateEmailExistsData.emails)) {

        // Validation failed, return null object.
        return null;
    }

    // Get the specific email row from the email's list by the fetched Id.
    // If the email row doesn’t exist by the Id - Something is wrong, display error message to the user.
    return validateEmailExistsData.emails.find(email => email.emailId === validateEmailExistsData.emailId);
};

// This function validates an add email to the user emails list request, checks
// that all parameters are valid and the email exists, and return the
// result to the saga to continue the rest of the logic in the process.
export const validateAddEmailRequest = (basicEmailValidationData) => {

    // Create base template result to return with the error console and error to display to the user.
    const validationResult = new ManageEmailValidationResult();

    // Validate the existence of the basicEmailValidationData parameters, and the validity of the user parameters.
    // If any of these parameters are missing or invalid - Something is not right with the application -
    // Show a general message to the user.
    if (!basicEmailValidationData || !validateArrayItems(basicEmailValidationData.emails) ||
        !isUserVerifiedAuthentication(basicEmailValidationData.userAuthentication) || !basicEmailValidationData.emailId) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['basicEmailValidationData', 'emails', 'userAuthentication', 'userId', 'userToken', 'emailId'],
            functionName: getFunctionName()
        };
    }

    // Get the specific email row from the email's list by the fetched Id.
    // If the email row doesn’t exist by the Id - Something is wrong, display error message to the user.
    validationResult.emailItem = validateEmailExists({
        emailId: basicEmailValidationData.emailId,
        emails: basicEmailValidationData.emails
    });

    // Check if the emailItem exists. If not exists, print error to the console.
    if (!validationResult.emailItem) {

        // Clear any assigned values and assign the error details to print to the console.
        validationResult.emailItem = null;
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['emailItem'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Continue to check that the action type is not already added.
    return validateActionExists(validationResult);
};

// This function validates a delete email from the user emails list request, checks
// that all parameters are valid and the email exists, and return the
// result to the saga to continue the rest of the logic in the process.
export const validateDeleteEmailRequest = (basicEmailValidationData) => {

    // Create base template result to return with the error console and error to display to the user.
    const validationResult = new ManageEmailValidationResult();

    // Validate the existence of the basicEmailValidationData parameters, and the validity of the user parameters.
    // If any of these parameters are missing or invalid - Something is not right with the application -
    // Show a general message to the user.
    if (!basicEmailValidationData || !basicEmailValidationData.userEmails || !validateArrayItems(basicEmailValidationData.userEmails.userEmailsList) ||
        !isUserVerifiedAuthentication(basicEmailValidationData.userAuthentication) || !basicEmailValidationData.emailId) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['basicEmailValidationData', 'userEmails', 'userEmailsList', 'userAuthentication', 'userId', 'userToken', 'emailId'],
            functionName: getFunctionName()
        };
    }

    // Get the specific email row from the email's list by the fetched Id.
    // If the email row doesn’t exist by the Id - Something is wrong, display error message to the user.
    validationResult.emailItem = validateEmailExists({
        emailId: basicEmailValidationData.emailId,
        emails: basicEmailValidationData.userEmails.userEmailsList
    });

    // Check if the emailItem exists. If not exists, print error to the console.
    if (!validationResult.emailItem) {

        // Clear any assigned values and assign the error details to print to the console.
        validationResult.emailItem = null;
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['emailItem'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Continue to check that the action type is not already deleted.
    return validateActionExists(validationResult);
};