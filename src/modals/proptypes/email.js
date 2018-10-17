// This shape object is the PropType object of the Email class.
// Since the email object shape repeats itself in many places,
// we declare it once here and import where needed.

import PropTypes from 'prop-types';

// Create the emailShape shape PropType.
const emailShape = PropTypes.shape({
    emailId: PropTypes.string.isRequired,
    emailUserId: PropTypes.string,
    emailUserAddedDate: PropTypes.instanceOf(Date),
    emailAddress: PropTypes.string.isRequired,
    emailLink: PropTypes.string.isRequired,
    emailCreationDate: PropTypes.instanceOf(Date).isRequired,
    emailSearchEngine: PropTypes.string.isRequired,
    emailSearchKey: PropTypes.string.isRequired,
    emailComments: PropTypes.string,
    emailType: PropTypes.string.isRequired,
    emailActionType: PropTypes.string.isRequired,
    isEmailMoreInformationMode: PropTypes.bool.isRequired
});

export default emailShape;