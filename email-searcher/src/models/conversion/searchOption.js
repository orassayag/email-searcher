// This conversion file holds a function to convert string
// of SearchOptionType enum into a search option instance
// after successful validation.

import SearchOption from '../models/SearchOption';

// This function converts a single data of string search option type into SearchOption class instance.
export const toSearchOption = (searchOptionType) => {

    // Check for existence of searchOptionType parameter. If not exists return null instance.
    if (!searchOptionType) {

        // Don't create any new instance.
        return null;
    }

    // Return a new SearchOption object instance.
    return new SearchOption(searchOptionType);
};