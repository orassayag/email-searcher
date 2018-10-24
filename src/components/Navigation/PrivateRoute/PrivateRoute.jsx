// This route component enable the user to redirect to paths that are only
// available for user that authenticated to the application. If the user is
// not authenticated and tries to enter these pages, it will automatically
// will redirect back to the search-page (Home-page). The route itself is AppRoute
// component, like all routes in this application site.

import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Routes from '../../../routes/routes';
import { AppRoute } from '../';

// Components parameter and functions PropTypes validations.
const propTypes = {
    isUserAuthenticated: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    exact: PropTypes.bool.isRequired,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired
};

// Components default values.
const defaultProps = {};

const PrivateRoute = (props) => {

    // In private route the default is not to allowed the user to get into the
    // path. If the user is authenticated- Only then he is allowed to be redirected to the path.
    let route = (<Redirect to={Routes.SEARCH} />);

    // Check is the user is authenticated. If so, create the private route.
    if (props.isUserAuthenticated) {
        route = (<AppRoute
            path={props.path}
            exact={props.exact}
            component={props.component}
        />);
    }

    // Return the render route (Or redirect).
    return route;
};

// Set the PropTypes validations and default values.
PrivateRoute.propTypes = propTypes;
PrivateRoute.defaultProps = defaultProps;

export default PrivateRoute;