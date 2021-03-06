// This component represents a link to a route to a page within the application.
// This component is created since each component navigation is wrapped by the
// hoc PageShell component that enables the animation fade-in and fade-out effect.
// So, in order to not repeat on the warping of the component in each
// router, this component has been created to serve this purpose.

import React from 'react';
import PropTypes from 'prop-types';
import { validateParameters } from '../../../utils/validationUtils';
import { Route } from 'react-router-dom';
import { PageShell } from '../../../hoc';

// Components parameter and functions PropTypes validations.
const propTypes = {
    path: PropTypes.string.isRequired,
    exact: PropTypes.bool.isRequired,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired
};

// Components default values.
const defaultProps = {};

const AppRoute = (props) => {

    // Manually validate parameters just in case.
    validateParameters({
        props: props,
        parametersList: ['path', 'component']
    });

    return (
        <Route
            path={props.path}
            exact={props.exact}
            component={PageShell(props.component)}
        />
    );
};

// Set the PropTypes validators and default values.
AppRoute.propTypes = propTypes;
AppRoute.defaultProps = defaultProps;

export default AppRoute;