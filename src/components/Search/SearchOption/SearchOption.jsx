// This component is combination of a few component, and actually it's the hole search
// option component, that include a switcher (SelectOption component), and text-area
// with error of validation comments. Each of the 3 search options enable the user
// to input data about the search process when he wants more desired and specific
// results. Note that in URL mode text, the "URLS" search option will be invisible
// and the validation won this search option will not take place (Due to the search
// on specific URL and not needed URLS to exclude or include).

import React from 'react';
import PropTypes from 'prop-types';
import './SearchOption.less';
import { generateClassName } from '../../../utils/textUtils';
import { validateParameters } from '../../../utils/validationUtils';
import SearchSelect from '../SearchSelect/SearchSelect';
import ErrorBox from '../../UI/ErrorBox/ErrorBox';

// Components parameter and functions PropTypes validations.
const propTypes = {
    searchOptionType: PropTypes.string.isRequired,
    isSearchOptionShow: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    descriptionText: PropTypes.string.isRequired,
    exampleText: PropTypes.string.isRequired,
    onTitle: PropTypes.string.isRequired,
    offTitle: PropTypes.string.isRequired,
    onSearchOptionChange: PropTypes.func.isRequired,
    onSearchSelectChange: PropTypes.func.isRequired,
    errorMessage: PropTypes.string
};

// Components default values.
const defaultProps = {
    errorMessage: null
};

const SearchOption = React.forwardRef((props, ref) => {

    // Manually validate parameters just in case.
    validateParameters({
        props: props,
        parametersList: ['title', 'descriptionText', 'exampleText']
    });

    // Generate classes according to search option mode and error message existence.
    const searchOptionData = {
        containerClass: generateClassName({
            condition: !props.isSearchOptionShow,
            originalClassName: 'col-md-3 col-centered',
            newClassName: 'fade-out'
        }),
        textAreaClass: generateClassName({
            condition: props.errorMessage,
            originalClassName: 'form-control',
            newClassName: 'error'
        })
    };

    return (
        <div className={searchOptionData.containerClass} ref={ref}>
            <SearchSelect
                searchOptionType={props.searchOptionType}
                title={props.title}
                onTitle={props.onTitle}
                offTitle={props.offTitle}
                onChange={props.onSearchSelectChange}
            />
            <div className="search-info">
                {props.descriptionText}
                <br /> {props.exampleText}
            </div>
            <div className="option-input">
                <textarea data-id={props.searchOptionType} className={searchOptionData.textAreaClass} onChange={props.onSearchOptionChange} spellCheck={false} rows="5"></textarea>
                <ErrorBox
                    isNoArrow={false}
                    isSearchOption={true}
                    isSearchOptionGeneral={false}
                    text={props.errorMessage}
                />
            </div>
        </div>
    );
});

// Set the PropTypes validations and default values.
SearchOption.propTypes = propTypes;
SearchOption.defaultProps = defaultProps;

export default SearchOption;