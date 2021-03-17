// This shape object is the PropType object of the array of SearchOption
// instances class object that appears in several components.
// Since the search option object shape repeats itself in many places,
// we declare it once here and import where needed.

import PropTypes from 'prop-types';

// Create the searchOptionShape shape PropType.
const searchOptionsShape = PropTypes.arrayOf(
    PropTypes.shape({
        searchOptionType: PropTypes.string.isRequired,
        isSearchOptionShow: PropTypes.bool.isRequired,
        mode: PropTypes.string.isRequired,
        value: PropTypes.string,
        errorMessage: PropTypes.string
    }).isRequired
).isRequired;

export default searchOptionsShape;