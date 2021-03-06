// The layout hoc is the base root of the application, holds the content of each page,
// the top menu and the bottom menu. Whether the component, it represents the same menus
// each time. It's like 'MasterPage.master' in ASP.NET ASPX or 'Layout.chtml' in
// ASP.NET MVC, where the idea is to set static content that will be available no
// matter there the user is redirected. Note that some of the links that will display
// in the top and bottom are depending if the user is authenticated or not.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Layout.less';
import userAuthenticationShape from '../../models/proptypes/userAuthentication';
import { Header, Footer } from '../../components/Navigation';

// Components parameter and functions PropTypes validations.
const propTypes = {
    userAuthentication: userAuthenticationShape,
    children: PropTypes.node
};

// Components default values.
const defaultProps = {
    userAuthentication: null,
    children: null
};

// State properties from sagas.
const mapStateToProps = (state) => {
    return {
        userAuthentication: state.userAuthentication.userAuthentication
    };
};

class Layout extends Component {

    render() {

        // Take the scoped props. Can be split into specific props, but due to saving memory, we can avoid this.
        const { props } = this;

        return (
            <div className="main-container">
                <Header userAuthentication={props.userAuthentication} />
                {props.children}
                <Footer userAuthentication={props.userAuthentication} />
            </div>
        );
    }
}

// Set the PropTypes validators and default values.
Layout.propTypes = propTypes;
Layout.defaultProps = defaultProps;

export default connect(mapStateToProps)(Layout);