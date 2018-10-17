// This component represent a button (That can be submit or within other behavior)
// that with a specific design of the site. All of the buttons in the application
// site use this component. The button component does some action on the click of the button itself.
// The button can be displayed within two colors options.

import React from 'react';
import PropTypes from 'prop-types';
import './SubmitButton.less';
import { validateParametersAndType } from '../../../utils/validationUtils';
import { generateClassName } from '../../../utils/textUtils';
import * as enums from '../../../enums/enums';

// Components parameter and functions PropTypes validations.
const propTypes = {
    buttonType: PropTypes.string.isRequired,
    isDifferentColor: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

// Components default values.
const defaultProps = {};

const SubmitButton = (props) => {

    // Manually validate parameters just in case.
    validateParametersAndType({
        props: props,
        parametersList: ['buttonType', 'title'],
        targetParameters: ['buttonType'],
        validationTypes: [enums.ValidationFunctionType.BUTTON]
    });

    // Get the class of the button within the desired color.
    const differentClass = generateClassName({
        condition: props.isDifferentColor,
        originalClassName: 'btn btn-default',
        newClassName: 'different'
    });

    return (
        <button type={props.buttonType} className={differentClass} onClick={props.onClick} title={props.title}>{props.title}</button>
    );
};

// Set the PropTypes validations and default values.
SubmitButton.propTypes = propTypes;
SubmitButton.defaultProps = defaultProps;

export default SubmitButton;