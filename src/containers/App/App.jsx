// This is container is the heart of the application, and wrapped all layout hoc with all the routing
// and the SEO tags. In this component all the routing is configured, from normal routes
// that are available to all users, to private routes that are available for authenticated
// users only. On each time this component load, there is a check within onUserAuthenticationCheckState
// that if the user is authenticated, the user token is still valid and the expiration time
// is not reached it limit. Also, SEO tags are programmatically generated for each single page.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Routes from '../../routes/routes';
import * as actions from '../../store/actions/actions';
import { isUserAuthenticated } from '../../utils/userAuthenticationUtils';
import translate from '../../translate/translate';
import settings from '../../settings/application/settings';
import userAuthenticationShape from '../../modals/proptypes/userAuthentication';
import Loader from '../../components/UI/Loader/Loader';
import Logout from '../../components/UserAuthentication/Logout/Logout';
import { Auxiliary, Layout } from '../../hoc/hoc';
import { AppRoute, PrivateRoute } from '../../components/Navigation/Navigation';
import * as containers from '../../containers/containers';

// Components parameter and functions PropTypes validations.
const propTypes = {
  userAuthentication: userAuthenticationShape,
  onUserAuthenticationCheckState: PropTypes.func.isRequired,
  onAppOnLoadStart: PropTypes.func.isRequired
};

// Components default values.
const defaultProps = {
  userAuthentication: null
};

// State properties from sagas.
const mapStateToProps = (state) => {
  return {
    isComponentMounted: state.app.isComponentMounted,
    userAuthentication: state.userAuthentication.userAuthentication
  };
};

// Dispatch functions from actions to reducers / sagas.
const mapDispatchToProps = (dispatch) => {
  return {
    onUserAuthenticationCheckState: () => {
      return dispatch(actions.onUserAuthenticationCheckState());
    },
    onAppOnLoadStart: () => {
      return dispatch(actions.onAppOnLoadStart());
    }
  };
};

class App extends Component {

  // Will determine if the user is authenticated or not.
  isUserAuthenticated = false;

  // On page load, check if user have user-authentication credentials on localStorage, if so - Auto login.
  componentDidMount() {

    const props = this.props;

    // On load, check if the user is already authenticated to the site by checking the
    // localStorage. If so, initial the state according to the localStorage values
    // within this saga.
    props.onUserAuthenticationCheckState();

    // Delay the loading of the site to let the UI load,
    // meanwhile display a loading animation to the user.
    props.onAppOnLoadStart();
  }

  render() {

    const props = this.props;

    // Will hold the JSX code of the layout body.
    let layoutBody = (<Loader isInsideModal={false} />);

    // Check if the component is mounted to check if the user is authenticated.
    if (props.isComponentMounted) {
      this.isUserAuthenticated = isUserAuthenticated(props.userAuthentication);

      // Check user-authentication data for relevant pages:
      // If user is authenticated don't allow to redirect to user-authentication (Login / registration) page,
      // If user is not authenticated, don't allow redirect to user-emails page.
      // Default values for user not authenticated.

      // Private routes - Only authenticated users are allowed to be redirect to the page.
      // App route - All users can be redirected to the page.

      layoutBody = (
        <Auxiliary>
          <Helmet>
            <meta property="og:title" content={translate.general_meta_title} />
            <meta property="og:description" content={translate.general_meta_description} />
            <meta property="og:url" content={`${process.env.PUBLIC_URL}`} />
            <meta name="description" content={translate.general_meta_description} />
            <meta name="title" content={translate.general_meta_title} />
            <meta name="author" content={settings.creatorName} />
            <meta name="keyword" content={translate.general_meta_keywords} />
            <title>{translate.general_browser_title}</title>
          </Helmet>
          <Layout>
            <Switch>
              <PrivateRoute
                path={`/${Routes.USER_EMAILS}`}
                exact={true}
                isUserAuthenticated={this.isUserAuthenticated}
                component={containers.UserEmails}
              />
              <PrivateRoute
                path={`/${Routes.LOGOUT}`}
                exact={true}
                isUserAuthenticated={this.isUserAuthenticated}
                component={Logout}
              />
              <PrivateRoute
                path={`/${Routes.USER_AUTHENTICATION}`}
                exact={true}
                isUserAuthenticated={!this.isUserAuthenticated}
                component={containers.UserAuthentication}
              />
              <AppRoute
                path={Routes.SEARCH}
                exact={true}
                component={containers.Search}
              />
              <AppRoute
                path={Routes.NOT_FOUND}
                exact={false}
                component={containers.NotFound}
              />
              <Redirect to={Routes.SEARCH} />
            </Switch>
          </Layout>
        </Auxiliary>
      );
    }
    return layoutBody;
  }
}

// Set the PropTypes validations and default values.
App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));