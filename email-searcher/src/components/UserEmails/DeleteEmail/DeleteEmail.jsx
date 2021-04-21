// This component displayed inside a modal window, in the user-emails page,
// right after the user clicked on an X to remove an email item from this
// emails list. This component displays a message that asks the user to confirm
// the email removal. The user can cancel the operation by clicking on the
// cancel button, and can confirm it by clicking on the 'Delete' button.

import React from 'react';
import PropTypes from 'prop-types';
import './DeleteEmail.less';
import translate from '../../../translate/translate';
import { Auxiliary } from '../../../hoc';
import { SubmitButton } from '../../UI';

// Components parameter and functions PropTypes validations.
const propTypes = {
    onDeleteClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    emailAddress: PropTypes.string,
    errorMessage: PropTypes.string
};

// Components default values.
const defaultProps = {
    emailAddress: '',
    errorMessage: ''
};

const DeleteEmail = (props) => {

    // Check if the email address exists. If the email address is missing,
    // don't display the content of this modal window.
    if (!props.emailAddress) {

        // Don't render the content of the modal window.
        return null;
    }

    return (
        <Auxiliary>
            <div className="modal-header">
                <h4 className="modal-title">{translate.delete_email_modal_title}</h4>
                <p>{translate.delete_email_modal_text} {props.emailAddress}?</p>
            </div>
            <div className="modal-footer">
                <SubmitButton
                    buttonType="button"
                    isDifferentColor={true}
                    title={translate.delete_email_modal_cancel_button}
                    onClick={props.onCancelClick}
                />
                <SubmitButton
                    buttonType="submit"
                    isDifferentColor={false}
                    title={translate.delete_email_modal_ok_button}
                    onClick={props.onDeleteClick}
                />
            </div>
        </Auxiliary>
    );
};

// Set the PropTypes validators and default values.
DeleteEmail.propTypes = propTypes;
DeleteEmail.defaultProps = defaultProps;

export default DeleteEmail;