// This container include the Page404 component that tells the user the
// page he entered not exists and he need to check again for the page
// he wants to offer the user a button to click on and to be redirected
// back to the search-page (Home-page).

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from '../../translate/translate';
import Routes from '../../routes/routes';
import { Auxiliary } from '../../hoc';
import { PageTitle } from '../../components/UI';
import { Page404 } from '../../components/NotFound';

// Components parameter and functions PropTypes validations.
const propTypes = {
    history: PropTypes.object
};

// Components default values.
const defaultProps = {
    history: null
};

class NotFound extends Component {

    // This handler method handles a click of the home-page button - To redirect the user back to search-page (Home-page).
    handleHomeClick = () => {

        // Redirect to search-page (Home-page).
        this.props.history.push(Routes.SEARCH);
    }

    render() {
        return (
            <Auxiliary>
                <PageTitle title={translate.page_not_found_main_title} />
                <Page404 onHomeClick={this.handleHomeClick} />
            </Auxiliary>
        );
    }
}

// Set the PropTypes validators and default values.
NotFound.propTypes = propTypes;
NotFound.defaultProps = defaultProps;

export default NotFound;