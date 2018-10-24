// This component implement label and text-box, it displays on the user-authentication page
// for email and password, to enable the user to input data and receive it.

import React from 'react';
import PropTypes from 'prop-types';
import './FieldBox.less';
import { validateParameters } from '../../../utils/validationUtils';
import { TextBox } from '../../UI';

// Components parameter and functions PropTypes validations.
const propTypes = {
    labelText: PropTypes.string.isRequired,
    inputType: PropTypes.string.isRequired,
    placeHolder: PropTypes.string.isRequired,
    onTextBoxChange: PropTypes.func.isRequired,
    autoComplete: PropTypes.string.isRequired,
    errorMessage: PropTypes.string
};

// Components default values.
const defaultProps = {
    errorMessage: ''
};

const FieldBox = (props) => {

    // Manually validate parameters just in case.
    validateParameters({
        props: props,
        parametersList: ['labelText', 'inputType', 'placeHolder']
    });

    // Calculate the class to display.
    const classType = props.errorMessage ? 'error' : null;

    return (
        <div className="form-group">
            <label htmlFor={props.inputType}>{props.labelText}</label>
            <TextBox
                inputType={props.inputType}
                classType={classType}
                placeHolder={props.placeHolder}
                errorMessage={props.errorMessage}
                onChange={props.onTextBoxChange}
                autoComplete={props.autoComplete}
            />
        </div>
    );
};

// Set the PropTypes validations and default values.
FieldBox.propTypes = propTypes;
FieldBox.defaultProps = defaultProps;

export default FieldBox;