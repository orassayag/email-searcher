// This component is the actually container of the NotFound container,
// and display to the user when he tries to redirect to a page that not
// exists in the site (Via 404 error code). The user will see a message that
// the requested page not found and a button to return to the search-page (Home-page).

import React from 'react';
import PropTypes from 'prop-types';
import './Page404.less';
import translate from '../../../translate/translate';
import { SubmitButton } from '../../UI';

// Components parameter and functions PropTypes validations.
const propTypes = {
    onHomeClick: PropTypes.func.isRequired
};

// Components default values.
const defaultProps = {};

const Page404 = (props) => {
    return (
        <div className="error-page">
            <div className="container">
                <div className="row">
                    <div className="col-md-10 col-md-offset-1 col-sm-12 text-center">
                        <h2 className="error-title">{translate.page_not_found_sub_title}</h2>
                        <p>{translate.page_not_found_text}</p>
                        <SubmitButton
                            buttonType="button"
                            isDifferentColor={false}
                            title={translate.page_not_found_home_button}
                            onClick={props.onHomeClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Set the PropTypes validations and default values.
Page404.propTypes = propTypes;
Page404.defaultProps = defaultProps;

export default Page404;