// This component is the heart of the application site. It represents the search text box that the user
// can enter some input to perform search operation (By search key mode or by URL search mode). One main
// feature of this component is the search options panel, that the user can use to perform the search
// operation to get some more desired and specific results. The toggle panel open by a box button
// component and display the search mode and the three search options (Email domains, email keys, and URLs), and
// for each one of them the user can include or exclude the relevant input he entered, during the search
// process. There is also the submit button to perform the search, and several validation errors will
// be displayed if the user enters some invalid data. The search operation is available only for
// authenticated users, if the user tries to search and he is not authenticated, a modal window will display.

import React from 'react';
import PropTypes from 'prop-types';
import './SearchBar.less';
import * as enums from '../../../enums/enums';
import { generateClassName } from '../../../utils/textUtils';
import { validateParametersAndArray } from '../../../utils/validationUtils';
import searchOptionsShape from '../../../modals/proptypes/searchOptions';
import logicSettings from '../../../settings/logic/logicSettings';
import translate from '../../../translate/translate';
import { SearchSelect, SearchOption } from '../';
import { BoxButton, ErrorBox, SubmitButton, TextBox } from '../../UI';

// Components parameter and functions PropTypes validations.
const propTypes = {
    searchMode: PropTypes.string.isRequired,
    isShowSearchOptions: PropTypes.bool.isRequired,
    searchOptionsGeneralErrorMessage: PropTypes.string,
    searchKeyErrorMessage: PropTypes.string,
    searchOptions: searchOptionsShape,
    onToggleSearchOptions: PropTypes.func.isRequired,
    onSearchClick: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onSearchOptionChange: PropTypes.func.isRequired,
    onSearchSelectChange: PropTypes.func.isRequired
};

// Components default values.
const defaultProps = {
    searchOptionsGeneralErrorMessage: null,
    searchKeyErrorMessage: null,
    searchOptions: null
};

const SearchBar = React.forwardRef((props, ref) => {

    // Manually validate parameters just in case.
    validateParametersAndArray({
        props: props,
        parametersList: ['searchOptions', 'searchMode'],
        targetArray: 'searchOptions',
        arrayRequiredLength: logicSettings.searchOptionsArrayCount
    });

    // Create classes to show or hide search options, error, and other design.
    const searchBarData = {
        toggleClass: generateClassName({
            condition: false,
            originalClassName: props.isShowSearchOptions ? 'down' : 'up',
            newClassName: 'hide-slideup'
        }),
        searchBarClass: generateClassName({
            condition: props.searchKeyErrorMessage,
            originalClassName: 'search-bar',
            newClassName: 'error'
        }),
        searchErrorClass: generateClassName({
            condition: props.searchOptionsGeneralErrorMessage,
            originalClassName: 'search-option-general-error',
            newClassName: 'active'
        })
    };

    // Implement all search options.
    const searchOptions = props.searchOptions.map(ctrl => {

        // Get the search options ref to scroll down in mobile devices. If not exists, throw exception.
        const scrollMobileRef = ref.find((srcRef) => srcRef.item === ctrl.searchOptionType);
        if (!scrollMobileRef) {

            // Throw exception to the user.
            throw new Error(translate.error_not_found.replace('#param#', 'Search option ref'));
        }

        // Will hold a key to replace on the translations.
        const searchOptionType = ctrl.searchOptionType.replace('-', '_');

        return (
            <SearchOption
                key={ctrl.searchOptionType}
                searchOptionType={ctrl.searchOptionType}
                isSearchOptionShow={ctrl.isSearchOptionShow}
                title={translate[`search_bar_${searchOptionType}_title`]}
                descriptionText={translate[`search_bar_${searchOptionType}_description`]}
                exampleText={translate[`search_bar_${searchOptionType}_example`]}
                onTitle={translate.search_bar_search_include_label}
                offTitle={translate.search_bar_search_exclude_label}
                ref={scrollMobileRef.ref}
                onSearchOptionChange={props.onSearchOptionChange}
                onSearchSelectChange={props.onSearchSelectChange}
                errorMessage={ctrl.errorMessage}
            />
        );
    });

    return (
        <div className="slider-area">
            <div className="slider-content">
                <div className="row">
                    <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1 col-sm-12">
                        <h2>{translate.search_bar_title}</h2>
                        <div className="search-form pulse animated">
                            <form action="" className="form-inline" onSubmit={props.onSearchClick}>
                                <BoxButton
                                    buttonType="button"
                                    buttonTitle={translate.search_options_button_title}
                                    classType="toggle"
                                    iconType="bars"
                                    onClick={props.onToggleSearchOptions}
                                />
                                <div className="form-group">
                                    <TextBox
                                        inputType="text"
                                        classType={searchBarData.searchBarClass}
                                        placeHolder={translate[`search_bar_textbox_${props.searchMode}_placeholder`]}
                                        errorMessage={props.searchKeyErrorMessage}
                                        onChange={props.onSearchChange}
                                        autoComplete="on"
                                    />
                                </div>
                                <BoxButton
                                    buttonType="submit"
                                    buttonTitle={translate.search_submit_button_title}
                                    classType="search"
                                    iconType="search"
                                    onClick={null}
                                />
                                <div className={`search-toggle slide${searchBarData.toggleClass}`}>
                                    <div className="row row-centered">
                                        <h3>{translate.search_bar_search_title}</h3>
                                        <div className="row">
                                            <SearchSelect
                                                searchOptionType={enums.SearchElementType.MODE}
                                                title={translate.search_bar_search_mode_label}
                                                onTitle={enums.SearchMode.TEXT}
                                                offTitle={enums.SearchMode.URL}
                                                onChange={props.onSearchSelectChange}
                                            />
                                            <p className="search-type">
                                                {translate.search_bar_search_mode_text_description}<br />
                                                {translate.search_bar_search_mode_url_description}
                                            </p>
                                        </div>
                                        {searchOptions}
                                        <div className="search-ok">
                                            <div className={searchBarData.searchErrorClass}>
                                                <ErrorBox
                                                    isNoArrow={true}
                                                    isSearchOption={false}
                                                    isSearchOptionGeneral={true}
                                                    text={props.searchOptionsGeneralErrorMessage}
                                                />
                                            </div>
                                            <SubmitButton
                                                buttonType="button"
                                                isDifferentColor={false}
                                                title={translate.search_bar_search_apply_button_label}
                                                onClick={props.onToggleSearchOptions}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Set the PropTypes validations and default values.
SearchBar.propTypes = propTypes;
SearchBar.defaultProps = defaultProps;

export default SearchBar;