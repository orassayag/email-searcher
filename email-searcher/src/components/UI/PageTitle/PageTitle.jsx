// This component displays a title on top of each page on the application.

import React from 'react';
import PropTypes from 'prop-types';
import './PageTitle.less';
import { validateParameters } from '../../../utils/validationUtils';

// Components parameter and functions PropTypes validations.
const propTypes = {
    title: PropTypes.string.isRequired
};

// Components default values.
const defaultProps = {};

const PageTitle = (props) => {

    // Manually validate parameters just in case.
    validateParameters({
        props: props,
        parametersList: ['title']
    });

    return (
        <div className="page-head">
            <div className="container">
                <div className="row">
                    <div className="page-head-content">
                        <h1 className="page-title">{props.title}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Set the PropTypes validators and default values.
PageTitle.propTypes = propTypes;
PageTitle.defaultProps = defaultProps;

export default PageTitle;