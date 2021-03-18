// This file utilizes all the text and number functions that manipulate
// strings and numbers and these kinds of operations to be used in any place
// in the site applications. Any function that converts string into number, or
// to specific formatted string, or any other text operation, needs to be
// implemented here.

import moment from 'moment';
import settings from '../settings/application/settings';
import translate from '../translate/translate';
import { validateString, validateNumber, validateArrayItems } from './validationUtils';
import * as enums from '../enums/enums';

// This function returns a date within the desired format using moment.js.
export const formatDate = (date) => {

    // Check existence of the date parameter. If not exists, return null instance.
    if (!date) {

        // Return null instance.
        return null;
    }

    // Return calculated result.
    return moment(date).format('YYYY-MM-DD HH:mm');
};

// Generate random Boolean.
export const generateRandomBoolean = () => {

    // Return random Boolean.
    return Math.random() >= 0.5;
};

// This function generates random numbers.
export const generateRandomNumber = (randomNumberData) => {

    // Check the existence and the validity of the randomNumberData parameters. If not exists or invalid, return default number.
    if (!randomNumberData || !validateNumber(randomNumberData.minimumNumber) || !validateNumber(randomNumberData.maximumNumber)) {

        // Return default number.
        return 0;
    }

    // Return calculated result.
    return Math.floor(Math.random() * randomNumberData.maximumNumber) + randomNumberData.minimumNumber;
};

// This function gets a creation year for the footer's title.
// If the current year is passed, will display the creation year until the current year.
export const getCreationYear = () => {

    // Will hold the final template parameters result.
    const yearsData = {
        creationYear: settings.applicationCreationYear,
        currentYear: moment().year(),
        result: null
    };

    // Give the current year.
    yearsData.result = yearsData.creationYear;

    // If the current year is not equal to the creation year, the string should contain both creation and current year.
    if (yearsData.creationYear !== yearsData.currentYear) {
        yearsData.result = `${yearsData.creationYear} - ${yearsData.currentYear}`;
    }

    // Return calculated string.
    return yearsData.result;
};

// This function merges two classes together if the given condition is true.
export const generateClassName = (classNameData) => {

    // Check that parameters exist. If not exists, return null instance.
    if (!classNameData || (!classNameData.originalClassName && !classNameData.newClassName)) {

        // Return null instance.
        return null;
    }

    // Will hold the result.
    let resultClass = classNameData.originalClassName;

    // Check if the condition is true.
    if (classNameData.condition) {

        // Add the new class to the old one.
        resultClass += ` ${classNameData.newClassName}`;
    }

    // Return calculated result.
    return resultClass;
};

// This function gets an array of parameters and converts them to string for display.
export const getErrorParametersString = (errorParametersList) => {

    // Check if the parameters. If it does not exist, stop all further actions.
    if (!validateArrayItems(errorParametersList)) {

        // Stop any further actions.
        return;
    }

    // Will hold the final result.
    let result = '';

    // Concat all parameters by generate the 'or' word by language
    errorParamatersList.forEach(param => {
        result += `${param} ${translate.error_or_key} `;
    });

    // Remove the final key from the result and return it.
    return result.slice(0, -(translate.error_or_key.length + 2));
};

// This function validates that a given value is a string. If so, convert it to date. If not, return the date as it is.
export const getDateConverted = (date) => {

    // Check if the parameter exists. If not exists, return null instance.
    if (!date) {

        // Return null instance in case no date parameter given.
        return null;
    }

    // Check if the given date is a string.
    if (!validateString(date)) {

        // Convert to date.
        date = new Date(Date.parse((date)));
    }

    // Return converted date.
    return date;
};

// This function trim empty spaces, line breaks, empty lines, tabs, etc... And support all platforms.
// This is used to trim the user's inputs in all inputs and text-areas before validating and inserting to the database.
export const trimString = (value) => {

    // Check if the parameter exists. If not exists, return null instance.
    if (!value) {

        // If no value exists, just return it, and don't process any further actions.
        return value;
    }

    // Now let's do the replacements.
    // Trim ↵ symbol.
    value = value.replace(/[\n\r]/g, ' ');

    // Trim empty lines, tabs, spaces.
    value = value.replace(/^\s*[\r\n]/gm, ' ');

    // Trim empty spaces.
    value = value.trim();

    // Finally, remove any (More than one) spaces inside the string.
    value = value.replace(/ +(?= )/g, '');

    // Return trimmed value.
    return value;
};

// This function tries to convert string into number, and if it is NaN or undefined, return default given number.
export const getNumber = (numberData) => {

    // Check if all parameters exist. If it doesn't exist, don't continue.
    if (!numberData) {

        // Stop any further actions.
        return;
    }

    // If the value is empty, return the default value.
    if (numberData.targetNumber === null) {

        // Return default value.
        return numberData.defaultNumber;
    }

    // Convert the string to a number.
    const convertedNumber = Number(numberData.targetNumber);

    // Return the calculated result if it is a valid number. If not, return the default number.
    return validateNumber(convertedNumber) ? convertedNumber : numberData.defaultNumber;
};

// This function gets object keys and returns the length of them.
export const getObjectKeysLength = (objectKeys) => {

    // Check the existence of the objectKeys parameters. If not exists, return 0.
    if (!objectKeys) {

        // Return default number, 0.
        return 0;
    }

    // Return object keys length.
    return Object.keys(objectKeys).length;
};

// This function determines if the object has keys.
export const hasObjectKeys = (objectKeys) => {

    // Check the existence of the objectKeys parameters. If not exists, return 0.
    if (!objectKeys) {

        // Return default number, 0.
        return 0;
    }

    // Return object keys length equal or less to zero or not.
    return getObjectKeysLength(objectKeys) <= 0;
};

// This function gets an array and a specific number and returns a new
// array with all the numbers that equal or lower than the given number.
export const getEqualLowerNumbers = (equalLowerNumbersData) => {

    // Check existence and validity of all the equalLowerNumbersData parameters. If not exists or invalid, return null instance.
    if (!equalLowerNumbersData || !validateArrayItems(equalLowerNumbersData.targetArray)) {

        // Return null instance.
        return null;
    }

    // get the first highest number in the array based on the given number.
    const maximumNumberLimit = equalLowerNumbersData.targetArray.find(x => {
        return x >= equalLowerNumbersData.targetNumber;
    });

    // Return a new array with relevant numbers only.
    return equalLowerNumbersData.targetArray.filter(x => {
        return x <= maximumNumberLimit;
    }).map(c => c);
};

// This function gets an array of numbers and returns the highest number in the array.
export const getHighestNumberInArray = (targetArray) => {

    // Check existence and validity of all the targetArray arrays. If invalid return a default number.
    if (!validateArrayItems(targetArray)) {

        // Return null instance.
        return 0;
    }

    // Return calculated result.
    return targetArray.reduce((max, n) => n > max ? n : max);
};

// This function gets error data from any place in the sagas and print
// the error given to the console (It can be an error generated by the
// code, or error from an API server call or operation process).
export const printErrorToConsole = (errorData) => {

    // Check the existence of the errorData parameter. If not exists, return null instance.
    if (!errorData) {

        // Stop any further actions.
        return;
    }

    // Check if the errorObject is exists, if so - Print it to console.
    if (errorData.errorObject) {

        // Print the error object to console.
        console.error(errorData.errorObject);
    }

    // Check if the errorMessage exists, if so - Print it to console.
    if (errorData.errorToConsole) {

        // Print the error message to console.
        // Check if the error is a console error (Internal error that is not related to any action of the user - An application error).
        let consoleErrorMessage = null;
        switch (errorData.errorToConsole.errorType) {
            case enums.ErrorType.MISSING:
                consoleErrorMessage = translate.error_missing;
                break;
            case enums.ErrorType.INVALID:
                consoleErrorMessage = translate.error_invalid;
                break;
            default:

                // If a match case is found - Don't do anything.
                return;
        }

        // Check that parameter names exist to print data about them.
        if (validateArrayItems(errorData.errorToConsole.parameters)) {

            // Replace the relevant parameters that related to the error
            // and print the general to console with details.
            consoleErrorMessage = consoleErrorMessage.replace('#params#', getErrorParametersString(errorData.errorToConsole.parameters));

            // Check for additional details like error type (Or which function the error occurred).
            if (errorData.errorToConsole.functionName) {

                // Add the error type to the console error message.
                consoleErrorMessage += ` functionName: ${errorData.errorToConsole.functionName}`;
            }
        }

        // Print the error to the console.
        console.error(consoleErrorMessage);
    }
};