// This file contains the initialState of the search container
// and store reducer. It contains emails list and all the relevant
// properties for all the functionality that needed for the search
// process and search options, and adding email to the use emails list.

import * as enums from '../../../enums/enums';
import { setMultiSearchOptions } from '../../../utils/searchUtils';
import { toSearchOption } from '../../../modals/conversion/searchOption';
import { toManageEmail } from '../../../modals/conversion/manageEmail';

// The initial state of the search process and add email parts.
export const initialState = {

    // This field determine if the search component is mounted or not.
    isComponentMounted: false,

    // This field represent the loading animation on the section of the
    // emails. On load it's true.
    isLoadingEmails: true,

    // Will hold the key of the search bar text input. Each time
    // the user key-up or key-down, this field is updated.
    searchKeyTempValue: '',

    // Will hold the final key search after the user decided to
    // perform the search process with the entered key, and
    // will display on the result's title.
    searchKeyInputValue: '',

    // Will hold error message of the key search, if the user
    // entered invalid search key on the input, or if there is
    // unexpected error during the search process.
    searchKeyErrorMessage: null,

    // Will hold the ref point for the error on the search option.
    // The ref point relevant for mobile or small screen only,
    // to scroll into their position, to notify the user about
    // the error.
    searchErrorRefType: null,

    // The current search mode that the user selected. The user
    // can select search key or URL address to find emails
    // within the search process. The default is text mode.
    searchMode: enums.SearchMode.TEXT,

    // This field will hold a general message error when an
    // unexpected error occurred while the user edits or enter
    // his preference on the search options panel.
    searchOptionsGeneralErrorMessage: null,

    // This field will hold the flag that determine if the
    // search options panel is displayed to the user or not.
    isShowSearchOptions: false,

    // This field will flag to display error message instead
    // of list of email in case of unexpected error during
    // the error search operation process.
    isEmailsError: false,

    // The array of all the search options available for the
    // user to be specific about the search process of the emails.
    // He can exclude or include in each search option. The
    // search options available at this moment are: Email domains (To include
    // or exclude email domains from the search process), email Keys
    // (To include or exclude email keys and parts from the search process),
    // and URLs addresses (To include or exclude specific URLs domains
    // in the search process).
    searchOptions: [
        toSearchOption(enums.SearchElementType.DOMAINS),
        toSearchOption(enums.SearchElementType.KEYS),
        toSearchOption(enums.SearchElementType.URLS)
    ],

    // This flag field will determine if the modal window
    // is displayed to the user or not, due to some action
    // that the user performed.
    isShowModal: false,

    // This field will hold the authentication required modal type,
    // in case the user in not authenticated to the site and tries to
    // add or to search emails, will determine which content and
    // text to display in the authentication required modal window.
    authenticationRequiredModalType: null,

    // This flag field will determine if to display a loading animation
    // after the user added an email to his emails list and waiting
    // for the API server call and saga to end the process.
    isLoadingModal: false,

    // This field will hold the error message in case some unexpected
    // error happen while the user tries to add an email to his emails
    // list, and the error message will be displayed inside the modal window.
    errorMessageModal: null,

    // This field will hold the comments of the user on the text-area
    // input on the add email modal window, and each time the user key-up
    // or key-down on the text-area, this filed is been updated.
    addEmailComments: '',

    // This object class instance will hold all the data needed to prepare
    // adding the email to the user emails list, and each time the user clicks
    // on the plus icon next to the email row, the email Id, and email address
    // update in this object. If needed, the input that the user entered is
    // invalid, an error message is displayed and updated in this object.
    addEmail: toManageEmail(),

    // Will hold the emails array list that contains multi Email
    // class instances to display the user, where it's fake emails
    // or real emails generated from the API server after a successful
    // search process.
    emails: null
};

// This inner function clears any existing error displayed on search options toggle panel.
// This logic repeats itself multiply times, so the best thing is to create this inner function.
export const clearSearchOptionsErrors = (state) => {

    // Clear all errors in any of the search options or search key.
    return setMultiSearchOptions({
        searchOptions: state.searchOptions,
        searchOptionsToUpdate: state.searchOptions.map(src => {
            return {
                searchOptionType: src.searchOptionType,
                errorMessage: null
            };
        }),
        propertyName: enums.SearchOptionProperty.ERROR_MESSAGE
    });
};