// This component displayed in the emails list of the user in the user-emails page,
// to enable the user to select the count of email items to view each page.
// Each time the user changes his selection, the page refreshes with the updated
// emails count selected by the user.

import React from 'react';
import PropTypes from 'prop-types';
import './EmailsCounter.less';
import translate from '../../../translate/translate';
import logicSettings from '../../../settings/logic/logicSettings';
import { getEqualLowerNumbers } from '../../../utils/textUtils';

// Components parameter and functions PropTypes validations.
const propTypes = {
    isCounterShow: PropTypes.bool.isRequired,
    emailsCountPerPage: PropTypes.number.isRequired,
    totalEmailsCount: PropTypes.number.isRequired,
    onCounterChange: PropTypes.func
};

// Components default values.
const defaultProps = {
    onCounterChange: null
};

const EmailsCounter = (props) => {

    // If the user is in search-page (Home-page), or has less than a logic settings number of emails, or for some
    // reason don't have emailsCountPerPage parameter, don't show the counter.
    if (!props.isCounterShow || !props.emailsCountPerPage || props.totalEmailsCount <= logicSettings.minimumEmailsCountToShowCounter) {

        // Don't render the email counter component.
        return null;
    }

    // Get the array options to display on the drop down select according to the user's total emails count.
    const countsArray = getEqualLowerNumbers({
        targetArray: logicSettings.emailsCounterOptionsList,
        targetNumber: props.totalEmailsCount
    });

    // Generates the counter dropdown options.
    const countOptions = countsArray.map((ctrl, i) => (
        <option key={i} value={ctrl}>{ctrl}</option>
    ));

    return (
        <div className="section">
            <div className="page-subheader">
                <div className="items-per-page">
                    <label>
                        {translate.email_counter_label}
                    </label>
                    <div className="sel">
                        <select name="per_page" defaultValue={props.emailsCountPerPage} onChange={props.onCounterChange}>
                            {countOptions}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Set the PropTypes validators and default values.
EmailsCounter.propTypes = propTypes;
EmailsCounter.defaultProps = defaultProps;

export default EmailsCounter;