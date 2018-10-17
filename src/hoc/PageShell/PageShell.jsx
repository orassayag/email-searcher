// This is a hoc container component, that enable the effect of fade-in and
// fade-out when routing and navigating between pages. The random function is
// placed because we want to sometime fade-in and fade-out the effect, not always
// preform the same effect to let the user feel like something is changing and no
// always the same effect occurred.

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './PageShell.less';
import { generateRandomBoolean } from '../../utils/textUtils';

const PageShell = (Container) => {
    return (props) => (
        <ReactCSSTransitionGroup
            transitionAppear={true}
            transitionAppearTimeout={600}
            transitionEnterTimeout={600}
            transitionLeaveTimeout={200}
            transitionName={`Slide${generateRandomBoolean() ? 'In' : 'Out'}`}
        >
            <Container {...props} />
        </ReactCSSTransitionGroup>
    );
};
export default PageShell;