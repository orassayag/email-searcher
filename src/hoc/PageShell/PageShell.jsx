// This is a hoc container component, that enable the effect of fade-in and
// fade-out when routing and navigating between pages. The random function is
// placed because we want to sometime fade-in and fade-out the effect, not always
// preform the same effect to let the user feel like something is changing and no
// always the same effect occurred.

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './PageShell.less';
import { getTransitionSettings } from '../../utils/UIUtils';

const PageShell = (Container) => {

    // Get the settings to determine the transition effects configurations.
    const settings = getTransitionSettings();

    return (props) => (
        <ReactCSSTransitionGroup
            transitionAppear={settings.PageTransitionAppear}
            transitionAppearTimeout={settings.PageTransitionAppearTimeout}
            transitionEnterTimeout={settings.PageTransitionEnterTimeout}
            transitionLeaveTimeout={settings.PageTransitionLeaveTimeout}
            transitionName={`Slide${settings.PageTransitionType}`}
        >
            <Container {...props} />
        </ReactCSSTransitionGroup>
    );
};
export default PageShell;