// This component represent a text box and error box component in one component,
// so, when the user submits some input he entered, a validation operation is
// taken place and if the input is invalid, he displayed an error. Example of
// this component implementation can be found on the search bar to perform
// a search operation by user input.

import React from 'react';
import PropTypes from 'prop-types';
import { validateParametersAndType } from '../../../utils/validationUtils';
import { generateClassName } from '../../../utils/textUtils';
import * as enums from '../../../enums/enums';
import { Auxiliary } from '../../../hoc';
import { ErrorBox } from '../';

// Components parameter and functions PropTypes validations.
const propTypes = {
    inputType: PropTypes.string.isRequired,
    classType: PropTypes.string,
    placeHolder: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
    onChange: PropTypes.func,
    autoComplete: PropTypes.string.isRequired
};

// Components default values.
const defaultProps = {
    classType: '',
    errorMessage: '',
    onChange: null
};

const TextBox = (props) => {

    // Manually validate parameters just in case.
    validateParametersAndType({
        props: props,
        parametersList: ['inputType', 'placeHolder', 'autoComplete'],
        targetParameters: ['inputType', 'autoComplete'],
        validationTypes: [enums.ValidationFunctionType.INPUT, enums.ValidationFunctionType.AUTOCOMPLETE]
    });

    // Get specific behavior of the text box by adding additional class.
    const typeClass = generateClassName({
        condition: props.classType,
        originalClassName: 'form-control',
        newClassName: props.classType
    });

    return (
        <Auxiliary>
            <input data-id={props.inputType} type={props.inputType} className={typeClass} placeholder={props.placeHolder} onChange={props.onChange} autoComplete={props.autoComplete} spellCheck={false} />
            <ErrorBox
                isNoArrow={false}
                isSearchOption={false}
                isSearchOptionGeneral={false}
                text={props.errorMessage}
            />
        </Auxiliary>
    );
};

// Set the PropTypes validations and default values.
TextBox.propTypes = propTypes;
TextBox.defaultProps = defaultProps;

export default TextBox;