// This component represents a small and tiny button with only an icon inside of it.
// This component can be seen in the search bar component, and in other places.
// in the application site. The button is like all buttons - Perform an
// action by clicking on the button.

import React from 'react';
import PropTypes from 'prop-types';
import './BoxButton.less';
import { validateParametersAndType } from '../../../utils/validationUtils';
import * as enums from '../../../enums/enums';

// Components parameter and functions PropTypes validations.
const propTypes = {
    buttonType: PropTypes.string.isRequired,
    buttonTitle: PropTypes.string.isRequired,
    classType: PropTypes.string.isRequired,
    iconType: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

// Components default values.
const defaultProps = {
    onClick: null
};

const BoxButton = (props) => {

    // Manually validate parameters just in case.
    validateParametersAndType({
        props: props,
        parametersList: ['buttonType', 'classType', 'iconType', 'buttonTitle'],
        targetParameters: ['buttonType'],
        validationTypes: [enums.ValidationFunctionType.BUTTON]
    });

    return (
        <button type={props.buttonType} className={`btn ${props.classType}-btn`} onClick={props.onClick} title={props.buttonTitle}>
            <i className={`fa fa-${props.iconType}`} title={props.buttonTitle}></i>
        </button>
    );
};

// Set the PropTypes validators and default values.
BoxButton.propTypes = propTypes;
BoxButton.defaultProps = defaultProps;

export default BoxButton;