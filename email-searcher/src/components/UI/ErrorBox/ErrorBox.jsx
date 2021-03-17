// This component represent an error box that appears below a text box or text-area,
// or just above or below a button, to display a message that something is not
// right, a validation message about invalid inputs that the users entered,
// or some general bug that occurred.

import React from 'react';
import PropTypes from 'prop-types';
import './ErrorBox.less';
import { generateClassName } from '../../../utils/textUtils';

// Components parameter and functions PropTypes validations.
const propTypes = {
    isNoArrow: PropTypes.bool.isRequired,
    isSearchOption: PropTypes.bool.isRequired,
    isSearchOptionGeneral: PropTypes.bool.isRequired,
    text: PropTypes.string
};

// Components default values.
const defaultProps = {
    text: ''
};

const ErrorBox = (props) => {

    // Will hold the template data to design the error component.
    const dataClasses = {
        containerClass: null,
        errorMessageClass: null
    };

    // Calculate the design by the position of the error in the application.
    dataClasses.containerClass = generateClassName({
        condition: props.text,
        originalClassName: 'error-container',
        newClassName: 'active'
    });
    dataClasses.containerClass = generateClassName({
        condition: props.isSearchOption,
        originalClassName: dataClasses.containerClass,
        newClassName: 'search-option-error'
    });
    dataClasses.containerClass = generateClassName({
        condition: props.isSearchOptionGeneral,
        originalClassName: dataClasses.containerClass,
        newClassName: 'search-option-general'
    });
    dataClasses.errorMessageClass = generateClassName({
        condition: props.isNoArrow,
        originalClassName: 'error-message',
        newClassName: 'no-arrow'
    });

    return (
        <div className={dataClasses.containerClass} aria-live="assertive" aria-hidden="false">
            <div className={dataClasses.errorMessageClass}>{props.text}</div>
        </div>
    );
};

// Set the PropTypes validators and default values.
ErrorBox.propTypes = propTypes;
ErrorBox.defaultProps = defaultProps;

export default ErrorBox;