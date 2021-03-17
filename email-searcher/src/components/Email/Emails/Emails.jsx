// This component represents a list of Email components, and it displayed both
// on search-page (Home-page) and on user-emails page, and in both of these
// pages there is an email list that is displayed to the user. In the search-page (Home-page),
// the emails list represents a list of emails fetched from the server API search
// process operation or by fake emails (On first load of the page), and in the user-emails
// page, it displayed a list of the user emails that he saved from the search-page (Home-page)
// via search process. Also, there are the Pager and Counter components, that displayed
// only in the user-emails page (Not in the search-page (Home-page), since the search results are
// limited to very few items each search process), to enable the user to navigate
// within his emails list.

import React from 'react';
import PropTypes from 'prop-types';
import './Emails.less';
import emailShape from '../../../models/proptypes/email';
import logicSettings from '../../../settings/logic/logicSettings';
import { generateClassName } from '../../../utils/textUtils';
import { validateArrayItems } from '../../../utils/validationUtils';
import { Email, EmailsCounter, EmailsPager } from '../';
import { Loader } from '../../UI';

// Components parameter and functions PropTypes validations.
const propTypes = {
    isLoadingEmails: PropTypes.bool.isRequired,
    isEmailsError: PropTypes.bool.isRequired,
    isNotFound: PropTypes.bool.isRequired,
    isHomePage: PropTypes.bool.isRequired,
    topTitle: PropTypes.string,
    subTitle: PropTypes.string,
    emailsCountPerPage: PropTypes.number,
    pagesCountToShow: PropTypes.number,
    currentPageNumber: PropTypes.number,
    totalEmailsCount: PropTypes.number,
    totalPagesCount: PropTypes.number,
    emails: PropTypes.arrayOf(emailShape.isRequired),
    onActionIconClick: PropTypes.func.isRequired,
    onMoreInformationToggleClick: PropTypes.func,
    onCounterChange: PropTypes.func,
    onChangePage: PropTypes.func
};

// Components default values.
const defaultProps = {
    topTitle: '',
    subTitle: '',
    emailsCountPerPage: logicSettings.defaultUserEmailsCountPerPage,
    pagesCountToShow: logicSettings.defaultPagesCountToShow,
    currentPageNumber: logicSettings.defaultUserEmailsCurrentPageNumber,
    totalEmailsCount: 0,
    totalPagesCount: 0,
    emails: null,
    onMoreInformationToggleClick: null,
    onCounterChange: null,
    onChangePage: null
};

const Emails = React.forwardRef((props, ref) => {

    // Create a template object of all the needed data to design the emails list.
    const emailsData = {
        haveEmails: validateArrayItems(props.emails),
        containerClass: props.isHomePage ? 'col-md-12 col-sm-12' : 'col-md-11 pr-30',
        subTitle: props.subTitle ? (<p className="count-result">{props.subTitle}</p>) : null,
        emailsTitle: null,
        notFoundClass: null,
        emailsBody: null,
        emailsHtml: null
    };

    // Generates a class for the top title if not found or error.
    if (!props.isLoadingEmails && props.topTitle) {
        emailsData.notFoundClass = generateClassName({
            condition: props.emailsError ? props.isEmailsError : props.isNotFound,
            originalClassName: 'col-md-10 col-md-offset-1 col-sm-12 text-center page-title search',
            newClassName: props.isEmailsError ? 'error' : 'not-found'
        });

        // Generate the title and the sub title.
        emailsData.emailsTitle = (
            <div className={emailsData.notFoundClass}>
                <p>{props.topTitle}</p>
                {emailsData.subTitle}
            </div>
        );
    }

    // If loading - Show the loader animation.
    if (props.isLoadingEmails) {
        emailsData.emailsBody = (<Loader isInsideModal={false} />);
    }

    // If any emails exist and no error, loop all the emails to render them.
    else if (emailsData.haveEmails && !props.isEmailsError) {

        // Generates all emails within a loop.
        emailsData.emailsHtml = props.emails.map(ctrl => (
            <Email
                key={ctrl.emailId}
                email={ctrl}
                isHomePage={props.isHomePage}
                onMoreInformationToggleClick={props.isHomePage ? null : props.onMoreInformationToggleClick}
                onActionIconClick={props.onActionIconClick}
            />
        ));

        emailsData.emailsBody = (
            <div className="content-area" ref={ref}>
                <div className="container">
                    <div className="row">
                        <div className={emailsData.containerClass}>
                            <EmailsCounter
                                isCounterShow={!props.isHomePage}
                                emailsCountPerPage={props.emailsCountPerPage}
                                totalEmailsCount={props.totalEmailsCount}
                                onCounterChange={props.onCounterChange}
                            />
                            <div className="section">
                                <div className="property-th-list">
                                    {emailsData.emailsHtml}
                                </div>
                            </div>
                            <EmailsPager
                                isPagerShow={!props.isHomePage}
                                totalEmailsCount={props.totalEmailsCount}
                                pagesCountToShow={props.pagesCountToShow}
                                currentPageNumber={props.currentPageNumber}
                                totalPagesCount={props.totalPagesCount}
                                onChangePage={props.onChangePage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="recent-property">
            {emailsData.emailsTitle}
            {emailsData.emailsBody}
        </div>
    );
});

// Set the PropTypes validators and default values.
Emails.propTypes = propTypes;
Emails.defaultProps = defaultProps;

export default Emails;