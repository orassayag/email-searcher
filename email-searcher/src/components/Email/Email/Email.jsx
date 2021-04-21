// This component displays an Email item (By instance of Email class) with all the details about the
// email fetches from the search process or a fake email or user email.
// Since this is a multi-use component, the email can be displayed with a full details panel (In user-emails page)
// or with minimum information in the search-page (Home-page).
// The email display the email address, link, search engine, key, user comments, creation
// and added date, and also, an action item on the right side that changes depending on the
// page (User can add the email to his emails list on the search-page (Home-page), or
// can remove it in the user-emails page from this emails list).

import React from 'react';
import PropTypes from 'prop-types';
import './Email.less';
import emailShape from '../../../models/proptypes/email';
import translate from '../../../translate/translate';
import * as enums from '../../../enums/enums';
import { formatDate } from '../../../utils/textUtils';
import { EmailDetail, EmailAction } from '../';

// Components parameter and functions PropTypes validations.
const propTypes = {
    email: emailShape,
    isHomePage: PropTypes.bool.isRequired,
    onActionIconClick: PropTypes.func.isRequired,
    onMoreInformationToggleClick: PropTypes.func
};

// Components default values.
const defaultProps = {
    email: null,
    onMoreInformationToggleClick: null
};

const Email = (props) => {

    // Manually validate parameters just in case. If any of them is missing
    // - Don't print the email data, but no need to throw errors.
    if (!props.email || !props.email.emailId || !props.email.emailAddress || !props.email.emailLink ||
        !props.email.emailCreationDate || !props.email.emailSearchEngine || !props.email.emailSearchKey) {

        // Don't render the email row.
        return null;
    }

    // Create the template data that affects the logic of the email.
    const emailDesignData = {
        modeClass: '',
        moreInformation: null,
        sideIcon: 'plus-circle',
        containerClass: 'col-md-4 p0',
        moreInformationClass: `result-toggle slide${props.email.isEmailMoreInformationMode ? 'down' : 'up'}`
    };

    // Set the display behavior of the email according to the type.
    switch (props.email.emailActionType) {
        case enums.EmailActionType.ADDED:
            emailDesignData.modeClass = ' added';
            emailDesignData.sideIcon = 'check-circle';
            break;
        case enums.EmailActionType.DELETED:
            emailDesignData.containerClass += ' slideup';
            break;
        case enums.EmailActionType.CREATED:
        default:

            // If a match case is found - Don't do anything.
            break;
    }

    // If the user is not in the search-page (Home-page), he is in the user-emails
    // page, and for that, the actions of each email are different,
    // and enable the user to view the 'More information' panel and comments.
    if (!props.isHomePage) {
        emailDesignData.modeClass = ' user-emails';
        emailDesignData.sideIcon = 'close';

        // Will hold the user's email comments.
        let comments = null;

        // If there are comments for the email, display them in the appropriate component.
        if (props.email.emailComments) {
            comments = (
                <EmailDetail
                    colNumberClass={12}
                    labelText={translate.email_item_comments_label}
                    value={props.email.emailComments}
                    isLinkMode={false}
                    valueClass="result-dynamic"
                />
            );
        }

        // Creates the 'More information' panel with all the email's details.
        emailDesignData.moreInformation = (
            <div className={emailDesignData.moreInformationClass}>
                <div className="row">
                    <EmailDetail
                        colNumberClass={4}
                        labelText={translate.email_item_creation_date_label}
                        value={formatDate(props.email.emailCreationDate)}
                        isLinkMode={false}
                        valueClass="result-dynamic-small"
                    />
                    <EmailDetail
                        colNumberClass={4}
                        labelText={translate.email_item_add_date_label}
                        value={formatDate(props.email.emailUserAddedDate)}
                        isLinkMode={false}
                        valueClass="result-dynamic-small"
                    />
                    <EmailDetail
                        colNumberClass={3}
                        labelText={translate.email_item_search_engine_label}
                        value={props.email.emailSearchEngine}
                        isLinkMode={false}
                        valueClass=""
                    />
                    <EmailDetail
                        colNumberClass={5}
                        labelText={translate.email_item_search_key_label}
                        value={`"${props.email.emailSearchKey}"`}
                        isLinkMode={false}
                        valueClass="result-dynamic"
                    />
                    {comments}
                </div>
            </div>
        );
    }

    return (
        <div data-id={props.email.emailId} className={emailDesignData.containerClass} onClick={props.onMoreInformationToggleClick}>
            <div className="item-result">
                <div className={`result-container${emailDesignData.modeClass}`}>
                    <div className="row result-top">
                        <EmailDetail
                            colNumberClass={5}
                            labelText={translate.email_item_email_label}
                            value={props.email.emailAddress}
                            isLinkMode={false}
                            valueClass="result-dynamic"
                        />
                        <EmailDetail
                            colNumberClass={6}
                            labelText={translate.email_item_link_label}
                            value={props.email.emailLink}
                            isLinkMode={true}
                            valueClass="result-dynamic"
                        />
                        <EmailAction
                            id={props.email.emailId}
                            sideIcon={emailDesignData.sideIcon}
                            onActionIconClick={props.onActionIconClick}
                            modeClass={emailDesignData.modeClass}
                        />
                    </div>
                </div>
                {emailDesignData.moreInformation}
            </div>
        </div>
    );
};

// Set the PropTypes validators and default values.
Email.propTypes = propTypes;
Email.defaultProps = defaultProps;

export default Email;