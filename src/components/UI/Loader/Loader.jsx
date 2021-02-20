// This component display a loading animation to let the user know that an
// action process is taking place at the moment and he should wait until
// the operation process will be finish for further actions to take place.
// This loader component displayed on the load of the site, when an action
// preformed in a modal window, or when loading emails list.

import React from 'react';
import PropTypes from 'prop-types';
import './Loader.less';
import translate from '../../../translate/translate';
import { generateClassName } from '../../../utils/textUtils';

// Components parameter and functions PropTypes validations.
const propTypes = {
    isInsideModal: PropTypes.bool.isRequired
};

// Components default values.
const defaultProps = {};

const Loader = (props) => {

    // Generates the loader with appropriate class if inside a modal or not.
    const loaderClass = generateClassName({
        condition: props.isInsideModal,
        originalClassName: 'loader',
        newClassName: 'modal'
    });

    return (
        <div className={loaderClass} title={translate.loader_alternative_text}>{translate.loader_alternative_text}</div>
    );
};

// Set the PropTypes validations and default values.
Loader.propTypes = propTypes;
Loader.defaultProps = defaultProps;

export default Loader;