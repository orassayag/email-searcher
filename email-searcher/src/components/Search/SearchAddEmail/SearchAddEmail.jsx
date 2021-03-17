// This component is displayed inside a modal window, and takes place when the
// user is authenticated to the application site in the search-page (In the
// home-page) when the user wants to add specific email to his emails list.
// In this form there is a confirmation of adding the email to the emails list,
// with the option to add some of your own comment, and the user can enter
// some input to add comments, that will be displayed on the user-emails page.
// The user can leave the comments text-area empty and not to leave some
// comments, and can cancel the adding process by clicking on X on the
// corner or on the cancel button. The user is limited to add emails for
// a certain number of emails from the settings.js file.

import React from 'react';
import PropTypes from 'prop-types';
import './SearchAddEmail.less';
import translate from '../../../translate/translate';
import { Auxiliary } from '../../../hoc';
import { ErrorBox, SubmitButton } from '../../UI';

// Components parameter and functions PropTypes validations.
const propTypes = {
    emailAddress: PropTypes.string,
    commentsValue: PropTypes.string,
    errorMessage: PropTypes.string,
    onCommentsChange: PropTypes.func.isRequired,
    onAddClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired
};

// Components default values.
const defaultProps = {
    emailAddress: null,
    commentsValue: '',
    errorMessage: null
};

const SearchAddEmail = (props) => {

    // Check if email address exists. If no email address exists - Don't raise the model.
    if (!props.emailAddress) {

        // Don't render any content of the modal window.
        return null;
    }

    return (
        <Auxiliary>
            <div className="modal-header">
                <h4 className="modal-title">{translate.add_email_modal_title}</h4>
                <p>{translate.add_email_modal_text} {props.emailAddress}?</p>
            </div>
            <div className="modal-body">
                <textarea className="form-control" onChange={props.onCommentsChange} value={props.commentsValue} spellCheck={false} rows="5"></textarea>
                <ErrorBox
                    isNoArrow={false}
                    isSearchOption={false}
                    isSearchOptionGeneral={false}
                    text={props.errorMessage}
                />
            </div>
            <div className="modal-footer">
                <SubmitButton
                    buttonType="button"
                    isDifferentColor={true}
                    title={translate.add_email_modal_cancel_button}
                    onClick={props.onCancelClick}
                />
                <SubmitButton
                    buttonType="submit"
                    isDifferentColor={false}
                    title={translate.add_email_modal_ok_button}
                    onClick={props.onAddClick}
                />
            </div>
        </Auxiliary>
    );
};

// Set the PropTypes validators and default values.
SearchAddEmail.propTypes = propTypes;
SearchAddEmail.defaultProps = defaultProps;

export default SearchAddEmail;