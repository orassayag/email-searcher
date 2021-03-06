// This component represents a link in the email’s pager in the pager component
// that enables the user to navigate and throw all his emails in his emails list.
// Each link can be a number, or an arrow to the next or previous page, and will
// be disable when the pager is the start or in the end of the emails list.

import React from 'react';
import PropTypes from 'prop-types';
import './EmailsPagerLink.less';

// Components parameter and functions PropTypes validations.
const propTypes = {
    value: PropTypes.node.isRequired,
    isActive: PropTypes.bool.isRequired,
    onChangePage: PropTypes.func.isRequired,
    children: PropTypes.node
};

// Components default values.
const defaultProps = {
    children: null
};

const EmailsPagerLink = (props) => {

    // Determine if the class has a different design whether it's active or not.
    // If the user is currently in an active page, the design of the link will be different.
    const activeClass = props.isActive ? 'active' : null;

    return (
        <li className={activeClass}><a data-id={props.value} href={null} onClick={props.onChangePage}>{props.children}</a></li>
    );
};

// Set the PropTypes validators and default values.
EmailsPagerLink.propTypes = propTypes;
EmailsPagerLink.defaultProps = defaultProps;

export default EmailsPagerLink;