// This component display a switcher of "on" and "off", enable the user the
// look and feel like he is switching between two options. This component used
// in the search-page (Home-page), in the search options panel inside the search bar component,
// enable the user the options to switch from a TEXT to URL search mode, or to
// include or to exclude some parameters he can input within the search process.

import React from 'react';
import PropTypes from 'prop-types';
import './SearchSelect.less';
import { validateParameters } from '../../../utils/validationUtils';
import { Auxiliary } from '../../../hoc';

// Components parameter and functions PropTypes validations.
const propTypes = {
    searchOptionType: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onTitle: PropTypes.string.isRequired,
    offTitle: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

// Components default values.
const defaultProps = {};

const SearchSelect = (props) => {

    // Manually validate parameters just in case.
    validateParameters({
        props: props,
        parametersList: ['title', 'onTitle', 'offTitle']
    });

    return (
        <Auxiliary>
            <div className="search-label">{props.title}</div>
            <label className="search-option">
                <input data-id={props.searchOptionType} type="checkbox" onChange={props.onChange} />
                <div className="search-option-slider round">
                    <span className="off">{props.offTitle}</span>
                    <span className="on">{props.onTitle}</span>
                </div>
            </label>
        </Auxiliary>
    );
};

// Set the PropTypes validations and default values.
SearchSelect.propTypes = propTypes;
SearchSelect.defaultProps = defaultProps;

export default SearchSelect;