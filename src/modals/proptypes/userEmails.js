// This shape object is the PropType object of the UserEmails class.
// Since the user emails object shape repeats itself in many places,
// we declare it once here and import where needed.

import PropTypes from 'prop-types';
import emailShape from './email';

// Create the userEmailsShape shape PropType.
const userEmailsShape = PropTypes.shape({
    userEmailsList: PropTypes.arrayOf(emailShape),
    userEmailsTotalCount: PropTypes.number.isRequired,
    userEmailsCountPerPage: PropTypes.number.isRequired,
    userEmailsPagesTotalCount: PropTypes.number.isRequired,
    userEmailsCurrentPageNumber: PropTypes.number.isRequired,
    userEmailsPagesCountToShow: PropTypes.number.isRequired,
    userEmailsDeletedCount: PropTypes.number.isRequired
});

export default userEmailsShape;