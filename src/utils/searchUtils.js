// This file includes all the core logic that helps the search functions
// and utile, that are meant to be called from the search saga, to perform
// all actions needed. Functions like validate all inputs before search
// operation and add email to user emails list operations, are placed here.
// This file created to save space on the search sagas itself and to keep
// it cleaner, and the long and repeatable logic to keep here, out of
// the sagas.

import translate from '../translate/translate';
import * as enums from '../enums/enums';
import * as validationUtils from './validationUtils';
import { copyObjectsArray, getFunctionName } from './coreUtils';
import { trimString } from './textUtils';
import logicSettings from '../settings/logic/logicSettings';
import { validateAddEmailRequest } from './userEmailsUtils';
import { isUserVerifiedAuthentication } from './userAuthenticationUtils';

// This data array is responsible to contain all the data needed for each
// element or search option to validate inputs and represent texts and
// error texts in case of errors, and limits of the input to validate.
const dataArray = new Map([
    [enums.SearchMode.TEXT,
    {
        searchOptionType: enums.SearchElementType.TEXT,
        emptyErrorText: translate.search_bar_error_empty_search_key,
        validationFunction: validationUtils.validateSearchKey,
        errorValidationText: translate.search_bar_error_alphanumeric,
        maximumCharactersCount: logicSettings.maximumTextSearchLength,
        maximumCharactersErrorText: translate.search_bar_search_key_error_length_exceeds
    }
    ],
    [enums.SearchMode.URL,
    {
        searchOptionType: enums.SearchElementType.URL,
        emptyErrorText: translate.search_bar_error_empty_URL,
        validationFunction: validationUtils.validateURL,
        errorValidationText: translate.search_bar_error_URL,
        maximumCharactersCount: logicSettings.maximumURLSearchLength,
        maximumCharactersErrorText: translate.search_bar_URL_error_length_exceeds
    }
    ],
    [enums.SearchElementType.DOMAINS,
    {
        searchOptionType: enums.SearchElementType.DOMAINS,
        validationFunction: validationUtils.validateEmailDomains,
        errorValidationText: translate.search_bar_email_domains_invalid_input,
        maximumCharactersCount: logicSettings.maximumDomainsLength,
        maximumCharactersErrorText: translate.search_bar_email_domains_error_length_exceeds
    }
    ],
    [enums.SearchElementType.KEYS,
    {
        searchOptionType: enums.SearchElementType.KEYS,
        validationFunction: validationUtils.validateEmailKeys,
        errorValidationText: translate.search_bar_email_keys_invalid_input,
        maximumCharactersCount: logicSettings.maximumKeysLength,
        maximumCharactersErrorText: translate.search_bar_email_keys_error_length_exceeds
    }
    ],
    [enums.SearchElementType.URLS,
    {
        searchOptionType: enums.SearchElementType.URLS,
        validationFunction: validationUtils.validateURLDomains,
        errorValidationText: translate.search_bar_URL_domains_invalid_input,
        maximumCharactersCount: logicSettings.maximumURLSLength,
        maximumCharactersErrorText: translate.search_bar_URL_domains_error_length_exceeds
    }
    ],
    [enums.SearchElementType.COMMENTS,
    {
        searchOptionType: enums.SearchElementType.COMMENTS,
        validationFunction: validationUtils.validateAddEmailComments,
        errorValidationText: translate.add_email_modal_error_invalid_comments,
        maximumCharactersCount: logicSettings.maximumEmailCommentsLength,
        maximumCharactersErrorText: translate.add_email_modal_error_comments_length_exceeds
    }
    ]
]);

// This function creates a copy of the search options and update some of the elements
// inside it, and return an updated copy of the search options. This function updates
// single search options.
export const setSearchOptions = (searchOptionsData) => {

    // Check the existence of the searchOptionsData parameter. If not exists, return null instance.
    if (!searchOptionsData) {

        // Return null instance.
        return null;
    }

    // Make a copy of the search options.
    const updateSearchOptions = copyObjectsArray(searchOptionsData.searchOptions);

    // Make the index of the of the search option.
    const searchOptionIndex = updateSearchOptions.findIndex(srcOption => srcOption.searchOptionType === searchOptionsData.currentSearchOptionType);

    // Update the search option. If the action is toggle (Include to Exclude and vice versa).
    if (searchOptionsData.newValue === 'toggle') {
        updateSearchOptions[searchOptionIndex][searchOptionsData.propertyName] = !updateSearchOptions[searchOptionIndex][searchOptionsData.propertyName];
    } else {
        updateSearchOptions[searchOptionIndex][searchOptionsData.propertyName] = searchOptionsData.newValue;
    }

    // Return the updated search options.
    return updateSearchOptions;
};

// This function creates a copy of the search options and update some of the elements
// inside it, and return an updated copy of the search options.
// This function update multi search options.
export const setMultiSearchOptions = (searchOptionsData) => {

    // Make a copy of the search options.
    const updateSearchOptions = copyObjectsArray(searchOptionsData.searchOptions);

    // Loop on each of the search options and update the error message.
    searchOptionsData.searchOptionsToUpdate.forEach(src => {

        // If the error is on the search key, update the specific key field with the error message.
        // If the error is on any search options, set the field validation error message.
        // Make the index of the of the search option.
        const searchOptionIndex = updateSearchOptions.findIndex(srcOption => srcOption.searchOptionType === src.searchOptionType);

        // Update the search option with the error message. If the field is valid - Remove any error (Set it to null).
        updateSearchOptions[searchOptionIndex][searchOptionsData.propertyName] = src.errorMessage;
    });

    // Return the updated search options.
    return updateSearchOptions;
};

// This function creates a copy of the search options and reset all the elements values
// and return an updated copy of the search options. This function update multi search options.
export const resetMultiSearchOptions = (searchOptions) => {

    // Make a copy of the search options.
    const updateSearchOptions = copyObjectsArray(searchOptions);

    // Loop on each of the search options and reset all the properties.
    searchOptions.forEach(src => {

        // Make the index of the of the search option.
        const searchOptionIndex = updateSearchOptions.findIndex(srcOption => srcOption.searchOptionType === src.searchOptionType);

        // Reset the search option with the default values on all the fields.
        updateSearchOptions[searchOptionIndex].isSearchOptionShow = true;
        updateSearchOptions[searchOptionIndex].mode = enums.SearchOption.INCLUDE;
        updateSearchOptions[searchOptionIndex].value = '';
        updateSearchOptions[searchOptionIndex].errorMessage = null;
    });

    // Return the updated search options.
    return updateSearchOptions;
};

// This function prepares all the errors to display the user, and the errors that needs to be clear,
// Also set the ref point to scroll to the field in case of error.
export const initialErrorValidationResults = (errorSearchOptionsData) => {

    // Error message of search key, error reference on mobile. Will be determining to which
    // element to scroll on mobile in case of an error, and all search options to show to the user.
    const errorResults = {
        searchKeyErrorMessage: null,
        searchErrorRefType: null,
        searchOptionsToUpdate: null
    };

    // Search key error data. If this variable not empty - There is an error with the search key.
    const searchKeyData = errorSearchOptionsData.find(src => src.searchOptionType === enums.SearchElementType.SEARCH_KEY);

    // Check if error message exists on the key data.
    if (searchKeyData) {

        // Assign the error message to return.
        errorResults.searchKeyErrorMessage = searchKeyData.errorMessage;
    }

    // Holds all the errors to update is state about all the
    // invalid search options and show them to the user.
    errorResults.searchOptionsToUpdate = errorSearchOptionsData.filter(src => {
        return src.searchOptionType !== enums.SearchElementType.SEARCH_KEY;
    }).map(src => {
        return {
            searchOptionType: src.searchOptionType,
            errorMessage: src.errorMessage
        };
    });

    // If error exists - Since we cannot scroll to more than one element in mobile,
    // we take the first invalid field and ref to scroll to it.
    if (validationUtils.validateArrayItems(errorResults.searchOptionsToUpdate)) {

        // Check if any errors exists.
        const existsErrors = errorResults.searchOptionsToUpdate.filter(src => src.errorMessage);

        // If exists assign the ref of the position to the element.
        if (validationUtils.validateArrayItems(existsErrors)) {

            // Fetch the first search option element to scroll to.
            errorResults.searchErrorRefType = existsErrors[0].searchOptionType;
        }
    }

    // Return the error results.
    return errorResults;
};

// This function sets the specific search options from the list, by searchOptionType key.
const setSearchOptionStatus = (statusData) => {

    // Check for existence and validity of the statusData parameters. If any of the parameters are invalid or empty - Don't do nothing.
    if (!statusData || !statusData.searchOptionType || !validationUtils.validateArrayItems(statusData.searchOptionsList)) {

        // Don't do nothing - Return the default data.
        return statusData.searchOptionsList;
    }

    // Search the search option type. If not found - Don't do nothing.
    const searchErrorStatusIndex = statusData.searchOptionsList.findIndex(srcOpt => srcOpt.searchOptionType === statusData.searchOptionType);

    // Check if index is valid and error status exists.
    if (searchErrorStatusIndex < 0) {

        // Don't do nothing - Return the default data.
        return statusData.searchOptionsList;
    }

    // Re-assign the relevant values and update the array.
    statusData.searchOptionsList[searchErrorStatusIndex] = {
        searchOptionType: statusData.searchOptionType,
        isValid: statusData.errorMessage === null,
        errorMessage: statusData.errorMessage
    };

    // Return the search options list.
    return statusData.searchOptionsList;
};

// This function validates all the search options when the search
// process begin or when the search options panel closed.
const validateSearchOptions = (validateSearchOptionsData) => {

    // Validate existence of the validateSearchOptionsData parameters. If parameters not exist - Don't do nothing.
    if (!validateSearchOptionsData || !validateSearchOptionsData.searchData || !validateSearchOptionsData.validationResult) {

        // Stop any further actions.
        return;
    }

    // Will determine if any of the search options are valid or not.
    let isValidSearch = true;

    // Validate search options (If entered).
    for (let i = 0; i < validateSearchOptionsData.searchData.searchOptions.length; i++) {

        // Hold the current search option.
        const searchOption = validateSearchOptionsData.searchData.searchOptions[i];

        // Check if any value is entered.
        if (searchOption.value) {

            // If entered, trim the value.
            validateSearchOptionsData.searchData.searchOptions[i].value = trimString(validateSearchOptionsData.searchData.searchOptions[i].value);
        }

        // Check if data is entered to perform validation -
        // And check the search option type and if needed, Skip validation on URL domains if the search mode is URL.
        // (Search emails on specific URL, no need to include / exclude URL domains) and continue to the next search option.
        if (!searchOption.value || (validateSearchOptionsData.searchData.searchMode === enums.SearchMode.URL &&
            searchOption.searchOptionType === enums.SearchElementType.URLS)) {

            // Set the error status of the specific search option.
            validateSearchOptionsData.validationResult.searchOptionsList = setSearchOptionStatus({
                searchOptionType: searchOption.searchOptionType,
                searchOptionsList: validateSearchOptionsData.validationResult.searchOptionsList,
                errorMessage: null
            });

            // Continue to next search option in the list.
            continue;
        }

        // Get the data by the current search option. If not found -
        // Something went wrong and the search is invalid, return a general error to display the user.
        const searchModeData = dataArray.get(searchOption.searchOptionType);

        // Check if search mode data found. If not found, continue to the next element.
        if (!searchModeData) {

            // Assign the error details to print to the console.
            validateSearchOptionsData.validationResult.errorToConsole = {
                errorType: enums.ErrorType.MISSING,
                parameters: ['searchModeData'],
                functionName: getFunctionName()
            };

            // Set the result validation to false.
            isValidSearch = false;

            // Continue to next search option in the list.
            continue;
        }

        // Check that the value is not exceeded maximum length.
        if (!validationUtils.validateCharactersLength({
            value: searchOption.value,
            validationType: enums.ValidateCharactersType.MAXIMUM,
            charactersCount: searchModeData.maximumCharactersCount
        })) {

            // Assign the error details to show the user.
            validateSearchOptionsData.validationResult.searchOptionsList = setSearchOptionStatus({
                searchOptionType: searchOption.searchOptionType,
                searchOptionsList: validateSearchOptionsData.validationResult.searchOptionsList,
                errorMessage: searchModeData.maximumCharactersErrorText.replace('#count#', searchModeData.maximumCharactersCount)
            });

            // Set the result validation to false.
            isValidSearch = false;

            // Continue to next search option in the list.
            continue;
        }

        // Validate the data according to current search option.
        const searchOptionValidationResult = searchModeData.validationFunction(searchOption.value);

        // Check if validation results object exists. If not, print error to the console.
        if (!searchOptionValidationResult) {

            // Assign the error details to print to the console.
            validateSearchOptionsData.validationResult.errorToConsole = {
                errorType: enums.ErrorType.MISSING,
                parameters: ['searchOptionValidationResult'],
                functionName: getFunctionName()
            };

            // Set the result validation to false.
            isValidSearch = false;

            // Continue to next search option in the list.
            continue;
        }

        // If invalid print an error message with the specific invalid value.
        if (!searchOptionValidationResult.isValid) {

            // Assign the error details to show the user.
            validateSearchOptionsData.validationResult.searchOptionsList = setSearchOptionStatus({
                searchOptionType: searchOption.searchOptionType,
                searchOptionsList: validateSearchOptionsData.validationResult.searchOptionsList,
                errorMessage: searchModeData.errorValidationText.replace('#invalid#', searchOptionValidationResult.invalidValue)
            });

            // Set the result validation to false.
            isValidSearch = false;

            // Continue to next search option in the list.
            continue;
        }

        // If error exists - Break the loop. If not exists - Set the field to be valid.
        if (isValidSearch) {

            // Clear any error of the specific search option.
            validateSearchOptionsData.validationResult.searchOptionsList = setSearchOptionStatus({
                searchOptionType: searchOption.searchOptionType,
                searchOptionsList: validateSearchOptionsData.validationResult.searchOptionsList,
                errorMessage: null
            });
        } else {

            // Break the loop.
            break;
        }
    };

    // Return validation results.
    return validateSearchOptionsData.validationResult;
};

// This function generates all the search options for validation. We take the "Show all errors" approach and no single error per click,
// We want to show the user all the errors exist and not one error single submit click.
const generateSearchOptionsList = (isValid) => {

    // Generates new search options list filtered with mode and comments.
    return Object.keys(enums.SearchElementType).filter(key => {

        // Remove the "MODE" and "COMMENTS" validation from the SearchElementType enum, since we don't have any validation on
        // the mode (No input from the user in this search option)
        return enums.SearchElementType[key] !== enums.SearchElementType.MODE &&
            enums.SearchElementType[key] !== enums.SearchElementType.COMMENTS;

    }).map(key => {

        // Return new search options list array.
        return {
            searchOptionType: enums.SearchElementType[key],
            isValid: isValid,
            errorMessage: null
        };
    });
};

// This function validates all the data of adding email to the
// user's emails list, before the call to the API server.
export const validateAddEmailProcessRequest = (addEmailData) => {

    // Validate the basic parameters request.
    const validationResult = validateAddEmailRequest(addEmailData);

    // Check to validate validationResult existence. If not, print error to the console.
    if (!validationResult) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['validationResult'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Check if there is an error from the basic validation.
    if (validationResult.errorToConsole) {

        // No need for additional action - Return the validation results.
        return validationResult;
    }

    // Validate the existence of the searchMode parameter.
    // If any of these parameters are missing or invalid - Something is not right with the application -
    // Show a general message to the user.
    if (!addEmailData.searchMode) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['searchMode'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Check the validity of the email address. If not, print error to the console.
    if (!validationUtils.validateEmail(validationResult.emailItem.emailAddress)) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['emailAddress'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Check the validity of the link. If not, print error to the console.
    if (!validationUtils.validateURL(validationResult.emailItem.emailLink)) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['emailLink'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Validate the that the creation date is a valid date. If not, print error to the console.
    if (!validationUtils.validateDate(validationResult.emailItem.emailCreationDate)) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['emailCreationDate'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Validate the that the user added date is not exists. If exists, something went wrong, print error to the console.
    if (validationResult.emailItem.emailUserAddedDate) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['emailUserAddedDate'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Check if the if the user entered search key and / or comments - In order to know if to assign the
    // search key and the comments of the specific search or validate the
    // fake search key and comments of the email. Trim the search key and the comments.

    validationResult.emailItem.emailSearchKey = trimString(addEmailData.searchKey ? addEmailData.searchKey : validationResult.emailItem.emailSearchKey);
    validationResult.emailItem.emailComments = trimString(addEmailData.comments ? addEmailData.comments : validationResult.emailItem.emailComments);

    // Check the validity of the search key according to the mode (TEXT or URL).
    // Get the search mode that the user found the email according to it. If not exists -
    // Something went wrong and the search is invalid, return a general error to display the user.
    const searchModeData = dataArray.get(addEmailData.searchMode);
    if (!searchModeData) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['searchMode'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Validate the search key existence. If not, print error to the console.
    if (!validationResult.emailItem.emailSearchKey) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['emailSearchKey'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Check that the emailSearchKey is not exceeded maximum length. If is, print error to the console.
    if (!validationUtils.validateCharactersLength({
        value: validationResult.emailItem.emailSearchKey,
        validationType: enums.ValidateCharactersType.MAXIMUM,
        charactersCount: searchModeData.maximumCharactersCount
    })) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['emailSearchKey'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Validate the data according to current selected search mode. If not, print error to the console.
    if (!searchModeData.validationFunction(validationResult.emailItem.emailSearchKey)) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['emailSearchKey'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Validate that the search engine is valid. If not, print error to the console.
    if (!validationUtils.validateEnumValue({
        enum: enums.SearchEngine,
        value: validationResult.emailItem.emailSearchEngine
    })) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['emailSearchEngine'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // validate the comments of the user (If entered).
    if (validationResult.emailItem.emailComments) {

        // Pull out the comments data to validate the comments.
        const commentsData = dataArray.get(enums.SearchElementType.COMMENTS);

        // Check that the comments is not exceeded maximum length. If not, print error to the console.
        if (!validationUtils.validateCharactersLength({
            value: validationResult.emailItem.emailComments,
            validationType: enums.ValidateCharactersType.MAXIMUM,
            charactersCount: commentsData.maximumCharactersCount
        })) {

            // Set the error message with of the relevant error.
            validationResult.errorMessage = commentsData.maximumCharactersErrorText.replace('#count#', commentsData.maximumCharactersCount);

            // Return the validation results.
            return validationResult;
        }

        // Check the validity of the comments.
        if (!commentsData.validationFunction(validationResult.emailItem.emailComments)) {

            // Set the error message with of the relevant error.
            validationResult.errorMessage = commentsData.errorValidationText;

            // Return the validation results.
            return validationResult;
        }
    }

    // Finally, validate that the email type is valid. If not, print error to the console.
    if (!validationUtils.validateEnumValue({
        enum: enums.EmailType,
        value: validationResult.emailItem.emailType
    })) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['emailActionType'],
            functionName: getFunctionName()
        };
    }

    // At this point, all the process is valid, and ready to
    // call the API server to add the email to user's emails list.

    // Return the validation results.
    return validationResult;
};

// This function validate the search process request.
export const validateSearchRequest = (searchData) => {

    // Create base template result to return.
    // Note that we create array of all the search options (Include main search key) to validate.
    // When analyze the result, each search option that will be valid, the error mode for the
    // specific search option will be cleared, so the user will see only the invalid search options errors.
    let validationResult = {
        errorToConsole: null,
        searchOptionsList: generateSearchOptionsList(false)
    };

    // Validate the existence of the searchData and the validity of the emailsCount parameter.
    // This is basic validation for both fake search and real search.
    // If any of these parameters are missing or invalid - Something is not right with the application -
    // Show a general message to the user.
    if (!searchData || !searchData.emailsCount || !validationUtils.validateNumber(searchData.emailsCount)) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['searchData', 'emailsCount'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // If it’s a fake process - Meaning that is the first load of the page -
    // We render fake emails and not perform a real search process,
    // There is no search process and no further validation is needed.
    if (searchData.isFakeProcess) {

        // Generates reset new search options list.
        validationResult.searchOptionsList = generateSearchOptionsList(true);

        // Return the validation results.
        return validationResult;
    }

    // If the call was made to toggle the search options panel show / hide, we want to validate only
    // the search options, without the search key (If the user want to toggle the panel,
    // we want only to make sure that if he entered some data, the validation will take place only on the search options).
    // Note that if the panel is open and the user entered some key, we want to validate it. So, the validation on the
    // search key will take place only is the search key exists.
    if (!searchData.searchKeyTempValue && searchData.isToggleSearchOption) {

        // Generates reset new search options list.
        validationResult.searchOptionsList = generateSearchOptionsList(true);

        // Validate all search options only.
        validationResult = validateSearchOptions({
            searchData: searchData,
            validationResult: validationResult
        });

        // Return the validation results.
        return validationResult;
    }

    // Check the existence and validity of all the parameters to validate. If not, print error to the console.
    if (!searchData.searchMode || !searchData.searchOptions || !isUserVerifiedAuthentication(searchData.userAuthentication)) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['searchMode', 'searchOptions', 'userAuthentication'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Check the validity of all the parameters. If any invalid - Print error to the console.
    if ((searchData.searchMode !== enums.SearchMode.TEXT && searchData.searchMode !== enums.SearchMode.URL) ||
        searchData.searchOptions.length !== logicSettings.searchOptionsArrayCount) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['searchMode', 'searchOptions'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Get the data by the current search mode selected. If not exists -
    // Something went wrong and the search is invalid, return a general error to display the user.
    const searchModeData = dataArray.get(searchData.searchMode);

    // Check if not exists. If so - Print error console to the user.
    if (!searchModeData) {

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.INVALID,
            parameters: ['searchMode'],
            functionName: getFunctionName()
        };

        // Return the validation results.
        return validationResult;
    }

    // Will hold the status of the key search validity.
    let isSearchKeyIsValid = true;

    // Trim the search key.
    searchData.searchKeyTempValue = trimString(searchData.searchKeyTempValue);

    // Check that value is entered on text-box. If empty - Display error to the user.
    if (!searchData.searchKeyTempValue) {

        // Set the error message with of the relevant error.
        validationResult.searchOptionsList = setSearchOptionStatus({
            searchOptionType: enums.SearchElementType.SEARCH_KEY,
            searchOptionsList: validationResult.searchOptionsList,
            errorMessage: searchModeData.emptyErrorText
        });

        // Set the status of the key search validity to false.
        isSearchKeyIsValid = false;
    }

    // Check is the search key is valid after previous check.
    if (isSearchKeyIsValid) {

        // Check that the value is not exceeded maximum length. If invalid - Display error to the user.
        if (!validationUtils.validateCharactersLength({
            value: searchData.searchKeyTempValue,
            validationType: enums.ValidateCharactersType.MAXIMUM,
            charactersCount: searchModeData.maximumCharactersCount
        })) {

            // Set the error message with of the relevant error.
            validationResult.searchOptionsList = setSearchOptionStatus({
                searchOptionType: enums.SearchElementType.SEARCH_KEY,
                searchOptionsList: validationResult.searchOptionsList,
                errorMessage: searchModeData.maximumCharactersErrorText.replace('#count#', searchModeData.maximumCharactersCount)
            });

            // Set the status of the key search validity to false.
            isSearchKeyIsValid = false;
        }
    }

    // Check is the search key is valid after previous check.
    if (isSearchKeyIsValid) {

        // Validate the data according to current selected search mode. If invalid - Display error to the user.
        if (!searchModeData.validationFunction(searchData.searchKeyTempValue)) {

            validationResult.searchOptionsList = setSearchOptionStatus({
                searchOptionType: enums.SearchElementType.SEARCH_KEY,
                searchOptionsList: validationResult.searchOptionsList,
                errorMessage: searchModeData.errorValidationText
            });

            // Set the error message with of the relevant error.
            isSearchKeyIsValid = false;
        }
    }

    // Check is the search key is valid after previous check.
    if (isSearchKeyIsValid) {

        // At this point the search key is valid - Next step is to validate all the search options.
        // Set the search key to valid (If any previous error displayed).
        validationResult.searchOptionsList = setSearchOptionStatus({
            searchOptionType: enums.SearchElementType.SEARCH_KEY,
            searchOptionsList: validationResult.searchOptionsList,
            errorMessage: null
        });
    }

    // Validate all search options and return it.
    validationResult = validateSearchOptions({
        searchData: searchData,
        validationResult: validationResult
    });

    // Return the validation results.
    return validationResult;
};