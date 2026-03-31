// This shape object is the PropType object of the UserAuthentication class.
// Since the user-authentication object shape repeats itself in many places,
// we declare it once here and import where needed.

import PropTypes from 'prop-types';

// Create the userAuthenticationShape shape PropType.
const userAuthenticationShape = PropTypes.shape({
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    userToken: PropTypes.string.isRequired,
    userTokenExpirationDate: PropTypes.instanceOf(Date).isRequired
});

export default userAuthenticationShape;