// This component represents the top part of the application, includes links
// to pages in the site, that all users can reach to and only authenticated
// users allowed to be redirected to. Also, display the logo of the
// application site. Note that there are 2 parts of this component, one
// menu for the normal standard view, and one for the mobile and small devices.
// The one for mobile is the 'Hamburger' menu that displays when clicked on a button
// by toggle down and reveal the menu links. Also, when the user authenticated
// the username of the user, to let the user know he is authenticated to the system.

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.less';
import translate from '../../../translate/translate';
import Routes from '../../../routes/routes';
import logo from '../../../assets/img/logo.png';
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

const Header = (props) => {

    // Check user-authentication data for relevant pages:
    // If user is authenticated don't display a link to user-authentication (Login / registration) page,
    // If user is not authenticated, don't display link to user-emails page.
    // Default values for users that are not authenticated.
    let headerData = null;
    if (isUserAuthenticated(props.userAuthentication)) {
        headerData = {
            linkPath: Routes.USER_EMAILS,
            linkText: translate.header_emails_label,
            userName: null,
            logoutLink: (<NavigationItem
                link={`/${Routes.LOGOUT}`}
                linkText={translate.header_logout_label}
                exact={true}
            />)
        };

        // If the username exists, create a tab on the side with the username.
        if (props.userAuthentication.userName) {
            headerData.userName = (
                <li className="fadeIn">
                    <span>{props.userAuthentication.userName}</span>
                </li>
            );
        }
    }
    else {

        // In case of an not authenticated user, create appropriate data to display.
        headerData = {
            linkPath: Routes.USER_AUTHENTICATION,
            linkText: translate.header_user_authentication_label,
            userName: null,
            logoutLink: null
        };
    }

    return (
        <nav className="navbar navbar-default">
            <div className="container">
                {/* Brand and toggle get grouped for better mobile display. */}
                <div className="navbar-header">
                    <label htmlFor="toggle" className="navbar-toggle collapsed">
                        <span className="sr-only">{translate.header_mobile_menu_title}</span>
                        {[...Array(3)].map((ctrl, i) => <span key={i} className="icon-bar"></span>)}
                    </label>
                    <NavLink
                        to={Routes.SEARCH}
                        className="navbar-brand">
                        <img src={logo} alt={translate.header_logo_alt_title} title={translate.header_logo_alt_title} role="presentation" />
                    </NavLink>
                </div>
                {/* Collect the nav links. */}
                <input id="toggle" type="checkbox" name="toggle" />
                <div className="sub-menu">
                    <ul className="main-nav nav navbar-nav navbar-right">
                        <NavigationItem
                            link={Routes.SEARCH}
                            linkText={translate.header_home_label}
                            exact={true}
                        />
                        <NavigationItem
                            link={`/${headerData.linkPath}`}
                            linkText={headerData.linkText}
                            exact={true}
                        />
                        {headerData.userName}
                        {headerData.logoutLink}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

// Set the PropTypes validators and default values.
Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;