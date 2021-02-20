// This component displayed inside a modal window, and appear when the user is not
// authenticated to the site, tells the user that in order to add email to his emails
// list or to enable a search operation, he must be a registered user.
// This modal will be displayed in the search-page (Home-page).
// The user can either close the window by cancel button, or to click
// on login / register button to be redirect to user-authentication page to
// preform login / registration process.

import React from 'react';
import PropTypes from 'prop-types';
import './AuthenticationRequired.less';
import translate from '../../../translate/translate';
import { getAuthenticationImageSourceByType } from '../../../utils/UIUtils';
import { Auxiliary } from '../../../hoc';
import { SubmitButton } from '../../UI';

// Components parameter and functions PropTypes validations.
const propTypes = {
    authenticationRequiredModalType: PropTypes.string,
    onAuthenticationClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired
};

// Components default values.
const defaultProps = {};

const AuthenticationRequired = (props) => {

    // Get the image source by authentication type.
    const imageSourceURL = getAuthenticationImageSourceByType(props.authenticationRequiredModalType);

    return (
        <Auxiliary>
            <div className="modal-header">
                <h4 className="modal-title">{translate.user_authentication_modal_title}</h4>
            </div>
            <div className="modal-body">
                <img src={imageSourceURL} alt={translate.user_authentication_modal_image_alt_title} title={translate.user_authentication_modal_image_alt_title} role="presentation" />
                <p>{translate[`user_authentication_modal_${props.authenticationRequiredModalType}_emails_text`]}</p>
            </div>
            <div className="modal-footer">
                <SubmitButton
                    buttonType="button"
                    isDifferentColor={true}
                    title={translate.user_authentication_modal_cancel_button}
                    onClick={props.onCancelClick}
                />
                <SubmitButton
                    buttonType="button"
                    isDifferentColor={false}
                    title={translate.user_authentication_modal_register_login_button}
                    onClick={props.onAuthenticationClick}
                />
            </div>
        </Auxiliary>
    );
};

// Set the PropTypes validations and default values.
AuthenticationRequired.propTypes = propTypes;
AuthenticationRequired.defaultProps = defaultProps;

export default AuthenticationRequired;