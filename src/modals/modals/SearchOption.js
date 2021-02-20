// This class responsible to store and represent the data of a search
// options that the user can use for more specific search process,
// like email parts to exclude or to include, URLS to excel cue or
// include from the search, and more. There are three search options
// types: Email domains, Email keys, and URLs.

import * as enums from '../../enums/enums';

class SearchOption {

    constructor(searchOptionType) {

        // Check if searchOptionType received exists. If not -
        // Don't assign any value to the SearchOption instance.
        if (!searchOptionType) {

            // Stop any further actions.
            return;
        }

        // This field hold the key and the type of the search option from
        // the SearchOptionType enum that include email domain, email
        // key, and URL. This will represent the search options when need
        // to be unidentified.
        this.searchOptionType = searchOptionType;

        // This flag field will determine if the search options is displayed
        // to the user or not, also will determine if to validate the input
        // that the user entered. For example, if the user selects to preform
        // a search mode with URL mode, no URLS search option will be displayed.
        this.isSearchOptionShow = true;

        // This field will hold the switcher input config, that the user can
        // select to switch from exclude to include and via versa. This will
        // effect the search process to include or to exclude the data input
        // that the user enters.
        this.mode = enums.SearchOption.INCLUDE;

        // This field will hold the value of the text-area of the search option,
        // each time the user will key-up or key-down on the search option's text-area,
        // this specific field will be updated.
        this.value = '';

        // This field will hold the error message for the specific search option.
        // If the user inputs some invalid data in the text-area of the search option
        // and tries to perform a search, under the text-area will be displayed an
        // error message with the value in this field.
        this.errorMessage = null;
    }
}

export default SearchOption;