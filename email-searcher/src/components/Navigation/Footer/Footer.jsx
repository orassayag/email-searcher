// This component represents the bottom menu of the application,
// and like in the header component, the user can redirect within
// different pages in the application. Also, there are details about
// the creators and year of creation of the application.

import React from 'react';
import './Footer.less';
import settings from '../../../settings/application/settings';
import translate from '../../../translate/translate';
import Routes from '../../../routes/routes';
import { getCreationYear } from '../../../utils/textUtils';
import { isUserAuthenticated } from '../../../utils/userAuthenticationUtils';
import userAuthenticationShape from '../../../models/proptypes/userAuthentication';
import { NavigationItem } from '../';

// Components parameter and functions PropTypes validations.
const propTypes = {
    userAuthentication: userAuthenticationShape
};

// Components default values.
const defaultProps = {
    userAuthentication: null
};

const Footer = (props) => {

    // Check user-authentication data for relevant pages:
    // If user is authenticated don't display a link to user-authentication (Login / Registration) page,
    // If user is not authenticated, don't display link to user-emails page.
    // Default values for users that are not authenticated.
    let footerData = null;
    if (isUserAuthenticated(props.userAuthentication)) {
        footerData = {
            linkPath: Routes.USER_EMAILS,
            linkText: translate.footer_emails_label
        };
    }
    else {

        // In case of an not authenticated user, create appropriate data to display.
        footerData = {
            linkPath: Routes.USER_AUTHENTICATION,
            linkText: translate.footer_user_authentication_label
        };
    }

    return (
        <div className="footer-area">
            <div className="footer-copy">
                <div className="container">
                    <div className="row">
                        <div className="pull-left">
                            <span> {translate.footer_rights_symbol} <a href={`mailto:${settings.creatorEmail}`} alt={settings.creatorName} title={settings.creatorName}>{settings.creatorName}</a>,&nbsp;
                            {translate.footer_rights} {getCreationYear()} | {translate.footer_icons}&nbsp;
                            <a href={settings.iconsURL} target="_blank" rel="noopener noreferrer" alt={settings.iconsName} title={settings.iconsName}>{settings.iconsName}</a></span>
                        </div>
                        <div className="bottom-menu">
                            <ul>
                                <NavigationItem
                                    link={Routes.SEARCH}
                                    linkText={translate.footer_home_label}
                                    exact={true}
                                />
                                <NavigationItem
                                    link={`/${footerData.linkPath}`}
                                    linkText={footerData.linkText}
                                    exact={true}
                                />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Set the PropTypes validators and default values.
Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

export default Footer;