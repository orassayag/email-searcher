// This component represent a number of links that enable the user to navigates throw his
// emails list, according to the count of emails selected by the user, to display in each page.
// A list of links will be displayed according to the number of exists emails in the
// list, and to the user's userEmailsPagesCountToShow field. Some of the links may be disabled
// at certain point of the navigation when the limit has been reached (Or in the beginning).

import React from 'react';
import PropTypes from 'prop-types';
import './EmailsPager.less';
import * as enums from '../../../enums/enums';
import logicSettings from '../../../settings/logic/logicSettings';
import EmailsPagerLink from '../EmailsPagerLink/EmailsPagerLink';

// Components parameter and functions PropTypes validations.
const propTypes = {
    isPagerShow: PropTypes.bool.isRequired,
    totalEmailsCount: PropTypes.number.isRequired,
    pagesCountToShow: PropTypes.number.isRequired,
    currentPageNumber: PropTypes.number.isRequired,
    totalPagesCount: PropTypes.number.isRequired,
    onChangePage: PropTypes.func
};

// Components default values.
const defaultProps = {
    onChangePage: null
};

const EmailsPager = (props) => {

    // If the user is in search-page (Home-page) or less than a logic settings number of emails,
    // and totalPagesCount is one or less, or invalid parameters, don't show the pager.
    if (!props.isPagerShow || props.totalEmailsCount <= logicSettings.minimumEmailsCountToShowPager || !props.pagesCountToShow ||
        !props.currentPageNumber || !props.totalPagesCount || props.totalPagesCount <= 1) {

        // Don't render the emails pager.
        return null;
    }

    // Calculate and build the link of pages.
    const firstPagePar = Number(props.pagesCountToShow / 2);
    let firstShownPage = 1;
    if (props.currentPageNumber > firstPagePar) {
        firstShownPage = props.currentPageNumber - firstPagePar;
    }

    // Generate the paging links within an array.
    const emailLinksArray = [];
    for (let i = firstShownPage; i < (firstShownPage + props.pagesCountToShow) && i <= props.totalPagesCount; i++) {
        emailLinksArray.push(
            <EmailsPagerLink key={i} value={i} isActive={props.currentPageNumber === i} onChangePage={props.onChangePage}>{i}</EmailsPagerLink>
        );
    }

    return (
        <div className="section">
            <div className="pull-right">
                <div className="pagination">
                    <ul>
                        <EmailsPagerLink
                            value={enums.PagerLink.PREVIOUS}
                            isActive={false}
                            onChangePage={props.onChangePage}>&lt;</EmailsPagerLink>
                        {emailLinksArray}
                        <EmailsPagerLink
                            value={enums.PagerLink.NEXT}
                            isActive={false}
                            onChangePage={props.onChangePage}>&gt;</EmailsPagerLink>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Set the PropTypes validations and default values.
EmailsPager.propTypes = propTypes;
EmailsPager.defaultProps = defaultProps;

export default EmailsPager;