// This component is part of the email component, and it represent a single
// label and value (Like email address, link, creation date, etc...).

import React from 'react';
import PropTypes from 'prop-types';
import './EmailDetail.less';
import { generateClassName } from '../../../utils/textUtils';
import { validateParameters } from '../../../utils/validationUtils';

// Components parameter and functions PropTypes validations.
const propTypes = {
    colNumberClass: PropTypes.number.isRequired,
    labelText: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    isLinkMode: PropTypes.bool.isRequired,
    valueClass: PropTypes.string
};

// Components default values.
const defaultProps = {
    valueClass: ''
};

const EmailDetail = (props) => {

    // Manually validate parameters just in case.
    validateParameters({
        props: props,
        parametersList: ['colNumberClass', 'labelText', 'value']
    });

    // Only if this is a link mode, generates a link.
    let value = props.value;
    if (props.isLinkMode) {
        value = (
            <a href={props.value} className="url" target="_blank" rel="noopener noreferrer">{props.value}</a>
        );
    }

    // Get class according to the cols number.
    const resultClass = generateClassName({
        condition: props.valueClass,
        originalClassName: 'result-value',
        newClassName: props.valueClass
    });

    return (
        <div className={`col-sm-${props.colNumberClass}`}>
            <div className="result-label">
                {props.labelText}:
        </div>
            <div className={resultClass}>
                {value}
            </div>
        </div>
    );
};

// Set the PropTypes validations and default values.
EmailDetail.propTypes = propTypes;
EmailDetail.defaultProps = defaultProps;

export default EmailDetail;