// This file contains all search related saga, that include call to the API
// server to perform search emails actions, and add email to the user emails
// list, get fake emails, and other sagas that require logic and validations.

import { delay } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { getFunctionName } from '../../../utils/coreUtils';
import { validateEnumValue, validateArrayItems, validateAPIResponse } from '../../../utils/validationUtils';
import { printErrorToConsole, hasObjectKeys } from '../../../utils/textUtils';
import { generateFakeEmails } from '../../../utils/fakeDataUtils';
import { userAddEmailToDatabaseProcessStartSaga } from './userEmails';
import translate from '../../../translate/translate';
import settings from '../../../settings/application/settings';
import logicSettings from '../../../settings/logic/logicSettings';
import UISettings from '../../../settings/logic/UISettings';
import { toEmails, toEmailModal } from '../../../modals/conversion/email';
import * as enums from '../../../enums/enums';
import * as apiSearch from '../../../api/routes/search';
import * as searchUtils from '../../../utils/searchUtils';
import { validateToggleManageEmailModal, setManageEmailAction } from '../../../utils/userEmailsUtils';
import * as actions from '../../actions/actions';
import { toManageEmail } from '../../../modals/conversion/manageEmail';

// This saga function called to handle the process of showing or closing the modal
// on search-page (Home-page), and in case of user-authentication
// modal, validate and determine which type of text and image
// to display inside this specific modal.
export function* searchModalToggleStartSaga(action) {

    // Validate existence of parameters. If not exists - Print error to the console and don't continue.
    if (!action.toggleModalData) {

        // Print the error to the console.
        // Assign the error details to print to the console.
        yield call(printErrorToConsole, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['toggleModalData'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // If authenticationRequiredModalType parameter type exists, validate it.
    if (action.toggleModalData.authenticationRequiredModalType) {

        // Validate the type of the authentication required type. If invalid - Print error to the console and don't do nothing.
        if (!validateEnumValue({
                enum: enums.AuthenticationRequiredModalType,
                value: action.toggleModalData.authenticationRequiredModalType
            })) {

            // Assign the error details to print to the console.
            yield call(printErrorToConsole, {
                errorToConsole: {
                    errorType: enums.ErrorType.INVALID,
                    parameters: ['authenticationRequiredModalType'],
                    functionName: getFunctionName()
                }
            });

            // Stop any further actions.
            return;
        }
    }

    // Call the action to show / hide the modal window.
    yield put(actions.onSearchModalToggleSuccess(action.toggleModalData));
}

// This saga function called when the user clicks on the plus icon next to each email row on search-page (Home-page)
// The modal will be open with all relevant details that is about to be added to users’ emails list.
export function* searchAddEmailModalToggleStartSaga(action) {

    // Validate all parameters and fetch the relevant email to show on the add email modal.
    let validationResult = yield call(validateToggleManageEmailModal, action.toggleAddEmailModalData);

    // Validate existence of validationResult instance. If missing - User clicked on the X/+ icons to
    // add / delete email modal, or something is wrong,
    // Don't display the modal to the user. Either cases - Hide the add email modal window.
    if (!validationResult) {

        // Assign the error details to print to the console.
        yield call(printErrorToConsole, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['validationResult'],
                functionName: getFunctionName()
            }
        });

        // Call action to hide the modal window.
        yield put(actions.onSearchModalToggleSuccess({
            isToggle: false,
            isShowModal: false,
            authenticationRequiredModalType: null
        }));

        // Stop any further actions.
        return;
    }

    // Validate existence of validation results parameters and exists error parameters.
    // If missing or error message exists - User clicked on the X/+ icons to
    // add / delete email modal, or something is wrong,
    // Don't display the modal to the user. Either cases - Hide the add email modal window.
    if (!validationResult.emailId || !validationResult.emailAddress || validationResult.errorType ||
        (validateArrayItems(validationResult.parameters)) || validationResult.functionName) {

        // Assign the error details to print to the console.
        yield call(printErrorToConsole, validationResult);

        // Call action to hide the modal window.
        yield put(actions.onSearchModalToggleSuccess({
            isToggle: false,
            isShowModal: false,
            authenticationRequiredModalType: null
        }));

        // Stop any further actions.
        return;
    }

    // Call the success toggle action to raise up the add email modal window.
    yield put(actions.onSearchAddEmailModalToggleSuccess({
        isShowModal: true,
        addEmail: toManageEmail({
            emailId: validationResult.emailId,
            emailAddress: validationResult.emailAddress,
            errorMessage: null
        })
    }));
}

// This saga function called when the user change any of the search options
// (Except of search mode) on the options search form, this saga raised.
export function* searchOptionChangeStartSaga(action) {

    // Check the existence of the parameters. If any not exists - Show a message to the user and console error.
    if (!action.searchOptionData || !action.searchOptionData.searchOptions || !action.searchOptionData.propertyName ||
        !action.searchOptionData.currentSearchOptionType) {

        // Assign the error details to print to the console.
        yield call(searchOptionErrorSaga, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['searchOptionData', 'searchOptions', 'propertyName', 'currentSearchOptionType'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Validate that the search option is valid. Check the validity of the search option parameter.
    // If invalid - Show a message to the user and console error.
    // Note that here we not checking "COMMENTS" or "SEARCH_KEY" since they not represent search options and not relevant
    // for search options validation. It's actually an error.
    switch (action.searchOptionData.currentSearchOptionType) {
        case enums.SearchElementType.MODE:
        case enums.SearchElementType.DOMAINS:
        case enums.SearchElementType.KEYS:
        case enums.SearchElementType.URLS:
            break;
        case enums.SearchElementType.SEARCH_KEY:
        case enums.SearchElementType.COMMENTS:
        default:

            // Assign the error details to print to the console.
            yield call(searchOptionErrorSaga, {
                errorToConsole: {
                    errorType: enums.ErrorType.INVALID,
                    parameters: ['currentSearchOptionType'],
                    functionName: getFunctionName()
                }
            });

            // Stop any further actions.
            return;
    }

    // Validate that the search mode is not the same as the current mode of the search option
    // is not the same mode as saved on state. If so - Don't do nothing. This does not include change on
    // the text-areas of the search options or the show or hide of the search options.
    // We don't want to update the state for nothing.
    if (action.searchOptionData.propertyName === enums.SearchOptionProperty.MODE) {

        // Find the search option.
        const searchOptionItem = action.searchOptionData.searchOptions.find(srcOption => srcOption.searchOptionType === action.searchOptionData.currentSearchOptionType);

        // Check if they are the same. If so - Don't continue the process.
        if (searchOptionItem[action.searchOptionData.propertyName] === action.searchOptionData.newValue) {

            // Stop any further actions.
            return;
        }
    }

    // If all valid - Continue to change the state of the search option.
    yield put(actions.onSearchOptionChangeSuccess(action.searchOptionData));
}

// This saga function called when the user changes the search mode
// on the options search form, this saga raised.
export function* searchModeChangeStartSaga(action) {

    // Check the existence of the parameters. If any not exists - Show a message to the user and console error.
    if (!action.searchModeData || !action.searchModeData.currentSearchMode || !action.searchModeData.newSearchMode) {

        // Assign the error details to print to the console.
        yield call(searchOptionErrorSaga, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                errorParameters: ['searchModeData', 'currentSearchMode', 'newSearchMode'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Validate that the search option is valid.
    // Check the validity of the search mode parameter. If invalid - Show a message to the user and console error.
    if (!validateEnumValue({
            enum: enums.SearchMode,
            value: action.searchModeData.newSearchMode
        })) {

        // Assign the error details to print to the console.
        yield call(searchOptionErrorSaga, {
            errorToConsole: {
                errorType: enums.ErrorType.INVALID,
                errorParameters: ['newSearchMode'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Validate that the search mode is not the same as the current searchMode saved on state. If so - Don't do nothing.
    // We don't want to update the state for nothing.
    if (action.searchModeData.newSearchMode === action.searchModeData.currentSearchMode) {

        // Stop any further actions.
        return;
    }

    // If all valid - Continue to change the state of the search mode.
    yield put(actions.onSearchModeChangeSuccess(action.searchModeData.newSearchMode));
}

// This saga function called to handle the fake process of first time
// load to generate fake emails for search-page (Home-page).
export function* fakeProcessStartSaga(action) {

    // Prepare the search fake process to start - Show the user a loading animation.
    yield put(actions.onSearchProcessPreparation());

    // Fetch fake emails.
    let emails = yield call(generateFakeEmails, {
        emailsCount: action.searchData.emailsCount,
        emailType: enums.EmailType.FAKE
    });

    // Convert the emails data to email classes instances.
    // Note that since this is a fake process, the emailsCount
    // field has no meaning, so the null is just a default unnecessary value.
    emails = yield call(toEmails, {
        emailsCount: null,
        emailsArray: emails,
        isFakeProcess: true
    });

    // Delay for the loading UI look and feel.
    yield delay(UISettings.searchEmailInitialDelay);

    // Preform success action (Remove loading and save the fake emails
    // to state and display them search-page (Home-page)).
    yield put(actions.onSearchProcessSuccess({
        emails: emails,
        isFakeProcess: true
    }));
}

// This saga handle the search process of emails.
export function* searchProcessStartSaga(action) {

    // Validate all parameters and rules before send an API request.
    let validationResult = yield call(searchUtils.validateSearchRequest, action.searchData);

    // if no result from validation - Something went wrong - Generate default validationResult object.
    if (!validationResult) {

        // Create empty validation results object.
        validationResult = {};

        // Assign the error details to print to the console.
        validationResult.searchOptionsList = [{
            searchOptionType: enums.SearchElementType.SEARCH_KEY,
            isValid: false,
            errorMessage: translate.error_general
        }];

        // Call the error saga to print message to the user.
        yield call(searchErrorStartSaga, validationResult);

        // Stop any further actions.
        return;
    }

    // First check if its isFakeProcess. If true - It means that this is the first load of the page.
    // If it’s the first load of the page - We need to reset any sign of old state. We call appropriate action for this task.
    if (action.searchData.isFakeProcess) {
        yield put(actions.onSearchResetStateSuccess());
    }

    // Check if any error exists (In console, in search key not in the first load, or in any search options).
    // If the validation failed to pass, generate the error of the problematic text-box within the searchErrorStartSaga.
    if (validationResult.errorToConsole || validationResult.searchOptionsList.findIndex(src => !src.isValid) > -1) {

        // Call the error saga to print message to the user.
        yield call(searchErrorStartSaga, validationResult);

        // Stop any further actions.
        return;
    }

    // If the call was made to toggle the search options panel show / hide, no need to call the server,
    // Call the onSearchOptionsToggleSuccess action to toggle.
    if (action.searchData.isToggleSearchOption) {

        // It's only a toggle operation, no further action needed. Toggle the search options panel only.
        yield put(actions.onSearchOptionsToggleSuccess());

        // Stop any further actions.
        return;
    }

    // Check if this is the first time to load the application to display fake emails not from any call to API.
    // If so - Redirect the user to fake process saga.
    if (action.searchData.isFakeProcess) {

        // Call the fake process saga.
        yield call(fakeProcessStartSaga, action);

        // Stop any further actions.
        return;
    }

    // Clear all errors in search options since validation is passed successfully and
    // we don't want to assign some fake errors to the server request.
    action.searchData.searchOptions.forEach((s, i) => {
        action.searchData.searchOptions[i].errorMessage = null;
    });

    // Prepare the user-authentication process to start - Show the user a loading animation.
    yield put(actions.onSearchProcessPreparation());

    // Get data to send to the API to search emails.
    const searchRequestData = {
        userAuthentication: action.searchData.userAuthentication,
        searchMode: action.searchData.searchMode,
        searchKey: action.searchData.searchKeyTempValue,
        searchOptions: action.searchData.searchOptions
    };

    // Will hold the response from the server.
    let response = null;

    try {

        // Call the API to perform the search emails from the server.
        response = yield call(apiSearch.search, searchRequestData);

    } catch (error) {

        // Error may occur due:
        // General error / Service unavailable / User not logged-in.
        // Assign the error details to print to the console.
        yield call(printErrorToConsole, {
            errorObject: error
        });

        // Call action to show error message to the user.
        yield put(actions.onSearchProcessFail());

        // Stop any further actions.
        return;
    }

    // Validate the existence of received parameters on the response from the API server.
    // In case of no response - Show general error message to the user and console the error.
    if (!validateAPIResponse(response)) {

        // Create empty validation results object.
        validationResult = {};

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['response', 'response.data'],
            functionName: getFunctionName()
        };

        // Generate reset search results to perform showing error message to the user.
        validationResult.searchOptionsList = [{
            searchOptionType: enums.SearchElementType.SEARCH_KEY,
            isValid: false,
            errorMessage: translate.error_general
        }];

        // Call action to show error message to the user.
        yield call(searchErrorStartSaga, validationResult);

        // Stop any further actions.
        return;
    }

    // Convert the results to emails instances (If exists).
    // Also, we limit the search results emails count to default maximum number.
    let emails = yield call(toEmails, {
        emailsCount: logicSettings.maximumSearchProcessEmailsCount,
        emailsArray: response.data,
        isFakeProcess: action.searchData.isFakeProcess
    });

    // Set the emails fetched from the server to the state.
    // Also, on mobile scroll the user to the results area and set the search key to the title.
    yield put(actions.onSearchProcessSuccess({
        emails: emails,
        isFakeProcess: false
    }));
}

// This saga function called to perform on first load of the search-page (Home-page), to perform inner
// logic functions, that the user will not notice them and required to healthy
// running of the application.
export function* searchOnLoadStartSaga() {

    // If there is a need in development mode to create and store on the database fake emails,
    // there is a call to searchStoreFakeEmailsStartSaga saga that do it. It will generate to
    // a logic settings number of emails inserted to the API Firebase database.
    if (settings.isGenerateFakeEmails) {

        // Call the generate fake emails and store them in the searchStoreFakeEmailsStartSaga saga.
        yield call(searchStoreFakeEmailsStartSaga);
    }

    // A settings flag field will check if there is a need to check if any of fake emails
    // are exists in the database. If so, it will call searchVerifyFakeEmailExistsOnDatabaseStartSaga saga
    // to check if any fake emails exists on the database, if not, generate random fake emails and auto-store
    // them in the Firebase database. It will be needed, for example, when no API server to preform
    // real search operations are implemented, and a search operation will result fake emails each time
    // a search operation will take place.
    if (settings.isVerifyFakeEmailsExistsOnDatabase) {

        // Call the verify existence of fake emails and store them in the searchVerifyFakeEmailExistsOnDatabaseStartSaga saga.
        yield call(searchVerifyFakeEmailExistsOnDatabaseStartSaga);
    }
}

// This inner saga function called (For development mode only), to generate fake emails and store them on database of Firebase.
// If the settings flag is active, the saga will be active and will save fake emails to the database.
function* searchStoreFakeEmailsStartSaga() {

    // Will the data to create fake emails
    const generateData = {
        emailsCount: logicSettings.fakeEmailsCountToCreate,
        emailType: enums.EmailType.SEARCH
    };

    // Generate all the fake emails to store in the database.
    const emails = yield call(generateFakeEmails, generateData);

    // Loop to add the emails with delay.
    for (let i = 0; i < generateData.emailsCount; i++) {
        try {

            // Send fake email to API database.
            apiSearch.insertFakeEmail(emails[i]);

        } catch (error) {

            // Error may occur due:
            // General error / Service unavailable.
            // Assign the error details to print to the console.
            yield call(printErrorToConsole, error);

            // Break the loop.
            break;
        }

        // Delay each insert of an email.
        yield delay(UISettings.searchStoreEmailDelay);
    }
}

// This inner saga function called in a case that no server side implemented (In case no server side is built),
// and fake emails are not found in the Firebase database, auto-fill fake emails to the database
// to generate emails from the server and save them on the state. When a server-side implementation
// will be exists - There will be no need for this saga, since it's legit that search operation
// process will have no results with specific given key not found any emails on any search engine.
function* searchVerifyFakeEmailExistsOnDatabaseStartSaga() {

    // Will hold the response from the server.
    let response = null;

    try {

        // Call the API to perform the search emails from the server. Note that we not pass any
        // parameters to search process to perform a real search. The reason is that we assume
        // that there is no server side implemented, so no real authentication is performed. If a
        // real server-side API were implemented we wouldn't need this saga in the first place. So
        // we pass null, just to have a fake search process to check the existence of any fake emails.
        response = yield call(apiSearch.search, null);

    } catch (error) {

        // Error may occur due:
        // General error / Service unavailable / User not logged-in.
        // Assign the error details to print to the console.
        yield call(printErrorToConsole, {
            errorObject: error
        });

        // Call action to show error message to the user.
        yield put(actions.onSearchProcessFail());

        // Stop any further actions.
        return;
    }

    // Validate the existence of received parameters on the response from the API server.
    // In case of no response - Show general error message to the user and console the error.
    if (!validateAPIResponse(response) || hasObjectKeys(response.data)) {

        // Call the saga to generate fake emails and store them on the Firebase database.
        yield call(searchStoreFakeEmailsStartSaga);
    }
}

// This inner saga function called to handle any case of error on search process.
function* searchErrorStartSaga(validationResult) {

    // Validate for existence of validationResult parameter. If not exists -
    // Print error console to the user and don't do nothing.
    if (!validationResult) {

        // Assign the error details to print to the console.
        yield call(printErrorToConsole, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['validationResult'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Create default error template.
    const defaultErrorSearchOptionsData = [{
        searchOptionType: enums.SearchElementType.SEARCH_KEY,
        errorMessage: translate.error_general
    }];

    // Will hold all the error fields.
    let errorSearchOptionsData = defaultErrorSearchOptionsData;

    // Check if the error is console error (Internal error that not
    // related to any action of the user - An application error).
    if (validationResult.errorToConsole) {

        // Print error details to the console.
        yield call(printErrorToConsole, validationResult);

        // Display general error message to the user.
        yield put(actions.onSearchProcessValidationError(errorSearchOptionsData));

        // Stop any further actions.
        return;
    }

    // Pull out any problematic field and raise the error saga to this specific field.
    errorSearchOptionsData = validationResult.searchOptionsList;

    // Call the failure process action.
    yield put(actions.onSearchProcessValidationError(errorSearchOptionsData));
}

// This saga function called to run when the user clicks on "Add" button on
// the add email modal window - To add an email to his emails list.
export function* searchAddEmailProcessStartSaga(action) {

    // Validate all parameters and rules before send an API request.
    let validationResult = yield call(searchUtils.validateAddEmailProcessRequest, action.addEmailData);

    // If no result from validation - Something went wrong - Generate default validationResult object.
    if (!validationResult) {

        // Create empty validation results object.
        validationResult = {};

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['validationResult'],
            functionName: getFunctionName()
        };

        // Call the error saga to print error to the console
        // and to display error message to the user.
        yield call(searchErrorAddEmailStartSaga, validationResult);

        // Stop any further actions.
        return;
    }

    // Check if any error exists (In console, in search user comments).
    // If the validation failed to pass, generate the error within the searchErrorAddEmailStartSaga saga.
    if (!validationResult.emailItem || validationResult.errorToConsole || validationResult.errorMessage) {

        // Call the error saga to print error to the console
        // and to display error message to the user.
        yield call(searchErrorAddEmailStartSaga, validationResult);

        // Stop any further actions.
        return;
    }

    // Assign the email to the userAuthentication, including the userId and the emailUserAddedDate parameters.
    validationResult.emailItem = yield call(toEmailModal, {
        userAuthentication: action.addEmailData.userAuthentication,
        emailItem: validationResult.emailItem
    });

    // Show the user the loading animation before calling the API server.
    yield put(actions.onSearchAddEmailProcessPreparation());

    // Call the user add email saga to update the database and the userEmailsTotalCount.
    validationResult = yield call(userAddEmailToDatabaseProcessStartSaga, {
        userAuthentication: action.addEmailData.userAuthentication,
        emailItem: validationResult.emailItem
    });

    // Check the validity of the results from the add user email saga.
    // if no result from validation - Something went wrong - Generate default validationResult object.
    if (!validationResult) {

        // Create empty validation results object.
        validationResult = {};

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['validationResult'],
            functionName: getFunctionName()
        };

        // Call the error saga to print error to the console
        // and to display error message to the user.
        yield call(searchErrorAddEmailStartSaga, validationResult);

        // Stop any further actions.
        return;
    }

    // Check if any error exists (In console, in search user comments).
    // If the validation failed to pass, generate the error within the searchErrorAddEmailStartSaga saga.
    if (validationResult.errorToConsole || validationResult.errorMessage) {

        // Call the error saga to print error to the console
        // and to display error message to the user.
        yield call(searchErrorAddEmailStartSaga, validationResult);

        // Stop any further actions.
        return;
    }

    // Call the success saga.
    yield call(searchAddEmailSuccessSaga, {
        emails: action.addEmailData.emails,
        emailId: action.addEmailData.emailId
    });
}

// This inner saga function called when there is an error from the API
// server when trying to add emails to user's emails list -
// Show a general error message to the user and close the modal.
function* searchAddEmailFailSaga() {

    // Show to the user the general error.
    yield put(actions.onSearchAddEmailProcessFail(translate.error_general));

    // After a UI settings number of seconds delay, close the modal window.
    yield delay(UISettings.searchAddEmailFailureModalDelay);

    // Call the success toggle action to hide the add email modal window.
    yield put(actions.onSearchAddEmailModalToggleReset());
}

// This inner saga function called when the email was successfully added to user's emails list.
// Close the modal, and mark the selected email as added.
function* searchAddEmailSuccessSaga(addEmailData) {

    // Prepare the updated emails list.
    let validationResult = setManageEmailAction({
        emailActionType: enums.EmailActionType.ADDED,
        emails: addEmailData.emails,
        emailId: addEmailData.emailId
    });

    // Check if validation results object parameter exists.
    // If not - Re-create one and assign error details.
    if (!validationResult) {

        // Create empty validation results object.
        validationResult = {};

        // Assign the error details to print to the console.
        validationResult.errorToConsole = {
            errorType: enums.ErrorType.MISSING,
            parameters: ['validationResult'],
            functionName: getFunctionName()
        };

        // Print the error to the console.
        yield call(printErrorToConsole, validationResult);

        // Call the error saga to show general message to the user.
        yield call(searchAddEmailFailSaga);

        // Stop any further actions.
        return;
    }

    // If any error to console exists - The validation operation failed. Print the error to the console and show a message to the user.
    // If no emails - There was an error, call the searchAddEmailFailSaga saga.
    if (validationResult.errorToConsole || !validationResult.emails) {

        // Print the error to the console.
        yield call(printErrorToConsole, validationResult);

        // Call the error saga to show general message to the user.
        yield call(searchAddEmailFailSaga);

        // Stop any further actions.
        return;
    }

    // Close the modal window and reset all parameters.
    yield put(actions.onSearchAddEmailModalToggleReset());

    // After shot time of delay, close the modal window and mark the email as added.
    yield delay(UISettings.searchAddEmailEffectDelay);

    // Update the email as added on the email's list.
    yield put(actions.onSearchAddEmailProcessSuccess(validationResult.emails));
}

// This inner saga function called to handle any case of error on add email process.
function* searchErrorAddEmailStartSaga(validationResult) {

    // Validate for existence of validationResult parameter. If not exists -
    // Print error console to the user and don't do nothing.
    if (!validationResult) {

        // Assign the error details to print to the console.
        yield call(printErrorToConsole, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['validationResult'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Create default error template. If exists error message, put it. If not - Display general error message.
    const errorMessage = validationResult.errorMessage ? validationResult.errorMessage : translate.error_general;

    // Print error to the console if exists one.
    yield call(printErrorToConsole, validationResult);

    // Call the failure process action.
    yield put(actions.onSearchAddEmailProcessError(errorMessage));
}

// This inner saga function called to handle any case of error on search error.
function* searchOptionErrorSaga(searchErrorData) {

    // Validate for existence of searchErrorData parameter. If not exists -
    // Print error console to the user and don't do nothing.
    if (!searchErrorData) {

        // Assign the error details to print to the console.
        yield call(printErrorToConsole, {
            errorToConsole: {
                errorType: enums.ErrorType.MISSING,
                parameters: ['searchErrorData'],
                functionName: getFunctionName()
            }
        });

        // Stop any further actions.
        return;
    }

    // Print the error to the console if exists.
    yield call(printErrorToConsole, searchErrorData);

    // Display error to the user.
    yield put(actions.onSearchOptionChangeError(translate.error_general));
}