// This component represent the action on each email row item that the user
// can perform, whether its action of adding to emails list or removing
// from emails list.

import React from 'react';
import PropTypes from 'prop-types';
import './EmailAction.less';
import { validateParameters } from '../../../utils/validationUtils';

// Components parameter and functions PropTypes validations.
const propTypes = {
    id: PropTypes.string.isRequired,
    sideIcon: PropTypes.string.isRequired,
    onActionIconClick: PropTypes.func.isRequired,
    modeClass: PropTypes.string
};

// Components default values.
const defaultProps = {
    modeClass: ''
};

const EmailAction = (props) => {

    // Manually validate parameters just in case.
    validateParameters({
        props: props,
        parametersList: ['id', 'sideIcon']
    });

    return (
        <div className="col-sm-1">
            <div className="item-delete">
                <a data-id={`email-${props.id}`} href={null} onClick={props.onActionIconClick} className={`list-group-item${props.modeClass}`}>
                    {<span className={`fa fa-${props.sideIcon}`}></span>}
                </a>
            </div>
        </div>
    );
};

// Set the PropTypes validations and default values.
EmailAction.propTypes = propTypes;
EmailAction.defaultProps = defaultProps;

export default EmailAction;