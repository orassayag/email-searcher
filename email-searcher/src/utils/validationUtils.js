// This file implements all the functions that validates inputs, like numbers, dates,
// enums, emails, comments, search keys, URLs, and every input that exists in email
// and users. Only functions that validate input should be placed in this file. In
// some cases in functions throw exceptions in case of an error occurred.

import * as enums from '../enums/enums';
import translate from '../translate/translate';
import { getErrorParametersString } from '../utils/textUtils';

// This function validates the props from any component that exists and valid.
export const validateParameters = (validateParametersData) => {

    // Check existence of the validateParametersData parameters. If it does not exist, throw new exceptions to the user.
    if (!validateParametersData || !validateParametersData.props || !validateArrayItems(validateParametersData.parametersList)) {

        // Throw an exception with all relevant parameter’s names.
        throw new Error(translate.error_missing.replace('#params#', getErrorParametersString(['validateParametersData', 'props', 'parametersList'])));
    }

    // Loop all the given parameters names and check for existence.
    validateParametersData.parametersList.forEach(parameter => {

        // Check the parameter exists. If not exists, throw new exceptions to the user.
        if (!validateParametersData.props[parameter]) {

            // If any of the parameters is missing - Throw an exception with the specific parameters that are missing.
            throw new Error(translate.error_missing.replace('#params#', parameter));
        }
    });
};

// This function validates the props of a specific component
// and also validates button / input type on one of the props.
export const validateParametersAndType = (validateParametersData) => {

    // Check existence of the validateParametersData parameters. If not exists, throw new exceptions to the user.
    if (!validateParametersData || !validateArrayItems(validateParametersData.targetParameters) || !validateArrayItems(validateParametersData.validationTypes)) {

        // Throw an exception with all relevant parameter’s names.
        throw new Error(translate.error_missing.replace('#params#', getErrorParametersString(['validateParametersData', 'targetParameters', 'validationTypes'])));
    }

    // Validate on the basic validation function.
    validateParameters(validateParametersData);

    // Loop on each of the validationTypes and validate the given string fields.
    validateParametersData.validationTypes.forEach((validationType, i) => {

        // Determine the function to validate on a specific field.
        // Validate that the type of the field and check if it is not invalid.
        switch (validationType) {
            case enums.ValidationFunctionType.INPUT:

                // Return calculated result. If not exists, throw new exceptions to the user.
                if (['text', 'email', 'password'].indexOf(validateParametersData.props[validateParametersData.targetParameters[i]]) < 0) {

                    // Throw an exception with the relevant parameter name.
                    throw new Error(translate.error_invalid.replace('#params#', validateParametersData.props[validateParametersData.targetParameters[i]]));
                }
                break;
            case enums.ValidationFunctionType.BUTTON:

                // Return calculated result. If not exists, throw new exceptions to the user.
                if (['button', 'submit'].indexOf(validateParametersData.props[validateParametersData.targetParameters[i]]) < 0) {

                    // Throw an exception with the relevant parameter name.
                    throw new Error(translate.error_invalid.replace('#params#', validateParametersData.props[validateParametersData.targetParameters[i]]));
                }
                break;
            case enums.ValidationFunctionType.AUTOCOMPLETE:

                // Return calculated result. If not exists, throw new exceptions to the user.
                if (['on', 'off'].indexOf(validateParametersData.props[validateParametersData.targetParameters[i]]) < 0) {

                    // Throw an exception with the relevant parameter name.
                    throw new Error(translate.error_invalid.replace('#params#', validateParametersData.props[validateParametersData.targetParameters[i]]));
                }
                break;
            default:

                // Throw an exception with the relevant parameter name.
                throw new Error(translate.error_invalid.replace('#params#', 'validationTypes'));
        }
    });
};

// This function validates the props of a specific component and also validates an array with specific length.
// Validate that given value is an array with a specific length. This function created
// since to the current production development, PropTypes don't have validation on array's length.
export const validateParametersAndArray = (validateParametersData) => {

    // Check existence of the validateParametersData parameters. If not exists, throw new exceptions to the user.
    if (!validateParametersData || !validateParametersData.arrayRequiredLength || !validateNumber(validateParametersData.arrayRequiredLength)) {

        // Throw an exception with all relevant parameter’s names.
        throw new Error(translate.error_missing.replace('#params#', getErrorParametersString(['validateParametersData', 'targetArray', 'arrayLength'])));
    }

    // Validate on the basic validation function.
    validateParameters(validateParametersData);

    // Check for type of array with specific count and check if array lengths not equals.
    if (!Array.isArray(validateParametersData.props[validateParametersData.targetArray]) ||
        validateParametersData.props[validateParametersData.targetArray].length !== validateParametersData.arrayRequiredLength) {

        // Throw an exception with all relevant parameter’s names.
        throw new Error(translate.error_invalid.replace('#params#', getErrorParametersString(['targetArray', 'arrayRequiredLength'])));
    }
};

// This function validates the search key in the search bar.
export const validateSearchKey = (value) => {

    // Check for existence of the value parameter. If not exists, return false.
    if (!value) {

        // Parameters are empty - False result.
        return false;
    }

    // Return calculated result.
    return baseValidateAlphanumeric({
        value: value,
        exceptionCharactersArray: null
    });
};

// This function validates a given string that exists in an array list of a specific type.
export const validateEnumValue = (validateEnumData) => {

    // Validate existence and validity of the validateEnumData parameters. If not exists, return false.
    if (!validateEnumData || !validateEnumData.enum || !validateEnumData.value) {

        // Parameters are empty - False result.
        return false;
    }

    // Check if the value is existing within a given array. Return false if not.
    if (Object.values(validateEnumData.enum).indexOf(validateEnumData.value) < 0) {

        // Parameters are empty - False result.
        return false;
    }

    // Return true if the value is existing within a given array.
    return true;
};

// This function validates the search option - Email domains in the search options panel.
export const validateEmailDomains = (value) => {

    // Check for existence of the value parameter. If not exists, return false.
    if (!value) {

        // Parameters are empty - False result.
        return false;
    }

    // Return calculated result.
    return baseValidateMultiValues({
        value: value,
        validateFunction: baseValidateEmailDomain
    });
};

// This function validates the search option - Email keys in the search options panel.
export const validateEmailKeys = (value) => {

    // Check for existence of the value parameter. If not exists, return false.
    if (!value) {

        // Parameters are empty - False result.
        return false;
    }

    // Return calculated result.
    return baseValidateMultiValues({
        value: value,
        validateFunction: baseValidateEmailKey
    });
};

// This function validates the search option - URL domains in the search options panel.
export const validateURLDomains = (value) => {

    // Check for existence of the value parameter. If not exists, return false.
    if (!value) {

        // Parameters are empty - False result.
        return false;
    }

    // Return calculated result.
    return baseValidateMultiValues({
        value: value,
        validateFunction: validateURL
    });
};

// This function validates the user comments when the user clicks on
// 'Add' button to add the email to this emails list on add email modal.
export const validateAddEmailComments = (value) => {

    // Check for existence of the value parameter. If not exists, return false.
    if (!value) {

        // Parameters are empty - False result.
        return false;
    }

    // Return calculated result.
    return baseValidateAlphanumeric({
        value: value,
        exceptionCharactersArray: ['.', ',', '-']
    });
};

// This function validates multi values (In case of email domains, email keys, and URL domains in search option panel)
const baseValidateMultiValues = (multiValuesData) => {

    // Will hold the invalid value if it would find any.
    let invalidValue = null;

    // Check for existence of the multiValuesData parameter. If it does not exist, stop any further action.
    if (!multiValuesData || !multiValuesData.validateFunction) {
        return {
            isValid: invalidValue === null,
            invalidValue: invalidValue
        };
    }

    // Loop on each value and validate according to the function.
    if (multiValuesData.value) {

        // Trim the value.
        multiValuesData.value = multiValuesData.value.trim();

        // Split the value into an array.
        const values = multiValuesData.value.split(',');

        // Check that the array exists and has items.
        if (validateArrayItems(values)) {

            // Run on every loop.
            values.every((value) => {

                // Trim the single value.
                value = value.trim();

                // Check if the value is existing. If not, assign the value to mark it and return false.
                if (!multiValuesData.validateFunction(value)) {

                    // Assign the value and return false.
                    invalidValue = value;
                    return false;
                }

                // Value exists.
                return true;
            });
        }
    }

    // Return calculated result.
    return {
        isValid: invalidValue === null,
        invalidValue: invalidValue
    };
};

// This function validates that a given string is a valid URL address.
export const validateURL = (value) => {

    // Check for existence of the value parameter. If not exists, return false.
    if (!value) {

        // Parameters are empty - False result.
        return false;
    }

    // Check that the given URL address has already been http or https. If no - Give it.
    const prefix = 'http://';
    const prefixSSL = 'https://';
    if (value.substr(0, prefix.length) !== prefix && value.substr(0, prefixSSL.length) !== prefixSSL) {
        value = `${prefix}${value}`;
    }

    // Create the regular expression instance.
    const regexExpression = new RegExp(
        '^' +
        // protocol identifier.
        '(?:(?:https?|ftp)://)' +
        // user:pass authentication.
        '(?:\\S+(?::\\S*)?@)?' +
        '(?:' +
        // IP address exclusion.
        // private & local networks.
        '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
        '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
        '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
        // IP address dotted notation octets.
        // excludes loopback network 0.0.0.0.
        // excludes reserved space >= 224.0.0.0.
        // excludes network & broadcast addresses.
        // (First & last IP address of each class).
        '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
        '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
        '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
        '|' +
        // host name.
        '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
        // domain name.
        '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
        // TLD identifier.
        '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
        // TLD may end with a dot.
        '\\.?' +
        ')' +
        // port number.
        '(?::\\d{2,5})?' +
        // resource path.
        '(?:[/?#]\\S*)?' +
        '$', 'i'
    );

    // Return calculated result.
    return regexExpression.test(value);
};

// This function validates that a given string is a valid email address.
export const validateEmail = (value) => {

    // Check for existence of the value parameter. If not exists, return false.
    if (!value) {

        // Parameters are empty - False result.
        return false;
    }

    // Validate base structure with regular expression.
    const regexExpression = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return regexExpression.test(value);
};

// This function validates password on registration - Password must contain:
/* ^ - The password string will start this way.
(?=.*[a-z]) - The string must contain at least 1 lowercase alphabetical character.
(?=.*[A-Z]) - The string must contain at least 1 uppercase alphabetical character.
(?=.*[0-9]) - The string must contain at least 1 numeric character.
(?=.*[!@#\$%\^&\*]) - The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict. */
export const validatePassword = (value) => {

    // Check for existence of the value parameter.
    if (!value) {

        // Parameters are empty - False result.
        return false;
    }

    // Return calculated result.
    const regexExpression = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])');
    return regexExpression.test(value);
};

// This function validates a given value of maximum / minimum length.
export const validateCharactersLength = (validateLengthData) => {

    // Check for existence and validity of the validateLengthData parameters. If not exists, return false.
    if (!validateLengthData || !validateLengthData.value || !validateLengthData.validationType ||
        !validateLengthData.charactersCount || !validateNumber(validateLengthData.charactersCount)) {

        // Are invalid or missing parameters, return false;
        return false;
    }

    // Check if to validate by maximum / minimum length and return calculated result.
    switch (validateLengthData.validationType) {
        case enums.ValidateCharactersType.MAXIMUM:
            return validateLengthData.value.length < validateLengthData.charactersCount;
        case enums.ValidateCharactersType.MINIMUM:
            return validateLengthData.value.length > validateLengthData.charactersCount;
        default:

            // If no matching key, return false.
            return false;
    }
};

// This function validates that value is a valid date.
export const validateDate = (date) => {

    // Check for existence of the date parameter. If not exists, return false.
    if (!date) {

        // Parameters are empty - False result.
        return false;
    }

    // Return calculated result.
    return date instanceof Date && !validateNumber(date);
};

// This function determines if a given string is a number of not.
export const validateNumber = (number) => {

    // Return calculated result.
    return typeof number === 'number' && !isNaN(number) && isFinite(number);
};

// This function validates that the value's type is a string.
export const validateString = (value) => {

    // Check for existence of the value parameter. If not exists, return false.
    if (!value) {

        // Parameters are empty - False result.
        return false;
    }

    // Return calculated result.
    return typeof value.emailCreationDate === 'string' || value.emailCreationDate instanceof String;
};

// This function validates that array exists and any items exist in that array.
export const validateArrayItems = (array) => {

    // Return calculated result.
    return array && array.length > 0;
};

// This function determines if there is a valid response from the server or not.
// This short logic becomes a function since it recreates in many places in the sagas.
// Note that this function relevant only for Firebase database, not for other external
// Node.js REST API may be implemented in the future without the 'data' property.
// Take this to consideration.
export const validateAPIResponse = (response) => {

    // Return calculated response.
    return response && response.data;
};

// This function validates a string alphanumeric with possible allowed characters.
// a-z0-9 - Alphanumeric characters.
// \u0590-\u05FF - Hebrew characters.
// exceptionCharactersArray - Dynamic characters.
// Also space is allowed.
const baseValidateAlphanumeric = (validateAlphanumericData) => {

    // Check for existence of the validateAlphanumericData parameter. If not exists, return false.
    if (!validateAlphanumericData || !validateAlphanumericData.value) {

        // Parameters are empty - False result.
        return false;
    }

    // Merge all allowed characters (If exists) to one string.
    let exceptions = '';
    if (validateArrayItems(validateAlphanumericData.exceptionCharactersArray)) {
        validateAlphanumericData.exceptionCharactersArray.forEach((c) => {
            exceptions += c;
        });
    }

    // Return calculated result.
    const regexExpression = new RegExp(`^[a-z0-9\u0590-\u05FF ${exceptions}]+$`, 'i');
    return regexExpression.test(validateAlphanumericData.value);
};

// This function validates the search option of the domain, that the given value is a valid domain.
const baseValidateEmailDomain = (value) => {

    // Check for existence of the value parameter. If not exists, return false.
    if (!value) {

        // Parameters are empty - False result.
        return false;
    }

    // Return calculated result.
    const regexExpression = new RegExp('^[a-z0-9@]+([-.][a-z0-9]+)*\\.[a-z]{2,}$', 'i');
    return regexExpression.test(value);
};

// This function validates the search option of the email key, that the given value is a valid email key.
const baseValidateEmailKey = (value) => {

    // Check for existence of the value parameter. If not exists, return false.
    if (!value) {

        // Parameters are empty - False result.
        return false;
    }

    // Return calculated result.
    return baseValidateAlphanumeric({
        value: value,
        exceptionCharactersArray: ['.', '-']
    });
};