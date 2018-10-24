// This component is placed inside a modal window, and taking place on the
// search-page (Home-page) when the user is authenticated to the site application
// and tries to add email to this emails list, while he reached his limit of
// saving emails to his account. This modal will display a message that tells
// him that, and he need to go to remove some emails form his emails list to
// enable to add new emails again.

import React from 'react';
import PropTypes from 'prop-types';
import './SearchEmailsLimit.less';
import settings from '../../../settings/application/settings';
import full from '../../../assets/img/full.png';
import translate from '../../../translate/translate';
import { Auxiliary } from '../../../hoc';
import { SubmitButton } from '../../UI';

// Components parameter and functions PropTypes validations.
const propTypes = {
    onOkClick: PropTypes.func.isRequired
};

// Components default values.
const defaultProps = {};

const SearchEmailsLimit = (props) => {
    return (
        <Auxiliary>
            <div className="modal-header">
                <h4 className="modal-title">{translate.emails_limit_modal_title}</h4>
            </div>
            <div className="modal-body">
                <img src={full} alt={translate.emails_limit_modal_image_alt_title} title={translate.emails_limit_modal_image_alt_title} role="presentation" />
                <p>{translate.emails_limit_modal_text.replace('#count#', settings.maximumUserEmailsTotalCountLimit)}</p>
            </div>
            <div className="modal-footer">
                <SubmitButton
                    buttonType="button"
                    isDifferentColor={false}
                    title={translate.emails_limit_modal_ok_button}
                    onClick={props.onOkClick}
                />
            </div>
        </Auxiliary>
    );
};

// Set the PropTypes validations and default values.
SearchEmailsLimit.propTypes = propTypes;
SearchEmailsLimit.defaultProps = defaultProps;

export default SearchEmailsLimit;