// This shape object is the PropType object of the ManageEmail class.
// Since the manage email object shape repeats itself in many places,
// we declare it once here and import where needed.

import PropTypes from 'prop-types';

// Create the manageEmailShape shape PropType.
const manageEmailShape = PropTypes.shape({
    emailId: PropTypes.string,
    emailAddress: PropTypes.string,
    errorMessage: PropTypes.string
}).isRequired;

export default manageEmailShape;