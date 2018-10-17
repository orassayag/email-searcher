// This component represent a link to a page, and implemented both
// on the header and footer components. Created to save syntax and simplify it.

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { validateParameters } from '../../../utils/validationUtils';

// Components parameter and functions PropTypes validations.
const propTypes = {
    link: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    exact: PropTypes.bool.isRequired,
    children: PropTypes.node
};

// Components default values.
const defaultProps = {
    children: null
};

const NavigationItem = (props) => {

    // Manually validate parameters just in case.
    validateParameters({
        props: props,
        parametersList: ['link', 'linkText']
    });

    return (
        <li className="fadeIn">
            <NavLink
                to={props.link}
                exact={props.exact}>{props.linkText}</NavLink>
        </li>
    );
};

// Set the PropTypes validations and default values.
NavigationItem.propTypes = propTypes;
NavigationItem.defaultProps = defaultProps;

export default NavigationItem;