// This file utilizes all the functions that related to the UI actions,
// like scrolling the window to an element, or load images, and other functions.
// Only functions that are related to the UI should be placed here.

import * as enums from '../enums/enums';
import logicSettings from '../settings/logic/logicSettings';
import UISettings from '../settings/logic/UISettings';
import translate from '../translate/translate';
import { validateEnumValue } from './validationUtils';
import { generateRandomBoolean } from './textUtils';

// This function takes a ref element and performs
// animation scroll into the given position of the ref element.
export const scrollToElementByRef = (ref) => {

    // Validate the existence of the ref parameter. If not exists, return stop any further actions.
    if (!ref || !ref.current) {

        // Stop any further actions.
        return;
    }

    // Scroll into an element.
    ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
    });
};

// This function returns image source by modal authentication
// type after validation of the authentication type modal.
export const getAuthenticationImageSourceByType = (authenticationRequiredModalType) => {

    // Will hold the final image source result.
    let imageSourceURL = null;

    // Check the existence of the authenticationRequiredModalType parameter. If not, return an empty image source.
    if (authenticationRequiredModalType) {

        // If invalid enum key, throw new exception to the user.
        if (!validateEnumValue({
            enum: enums.AuthenticationRequiredModalType,
            value: authenticationRequiredModalType
        })) {

            // Throw an exception to the user.
            throw new Error(translate.error_invalid.replace('#params#', 'authenticationRequiredModalType'));
        }

        // Load the image by authenticationRequiredModalType parameter.
        imageSourceURL = require(`../assets/img/user-authentication-${authenticationRequiredModalType}.png`);
    }

    // Return the image source.
    return imageSourceURL;
};

// This function checks if the window size is more than 1170
// pixel width. If so, it's not a small device screen or mobile screen.
// If less, it's a small device.
export const isStandardScreen = () => {

    // Return calculated result.
    return window.innerWidth > logicSettings.minimumMobileWindowSize;
};

// This function calculates and returns the UI settings for the PageShell component,
// to determine and configure the animation transition effect settings to display
// to the user while browsing from one page to another.
export const getTransitionSettings = () => {

    // Will hold the final result.
    const transitionSettings = {
        PageTransitionAppear: UISettings.PageTransitionAppear,
        PageTransitionAppearTimeout: UISettings.PageTransitionAppearTimeout,
        PageTransitionEnterTimeout: UISettings.PageTransitionEnterTimeout,
        PageTransitionLeaveTimeout: UISettings.PageTransitionLeaveTimeout,
        PageTransitionType: null
    };

    // Calculate the effect type of the transition.
    switch (UISettings.PageTransitionType) {
        case enums.PageTransitionType.FADE_IN:
            transitionSettings.PageTransitionType = 'In';
            break;
        case enums.PageTransitionType.FADE_OUT:
            transitionSettings.PageTransitionType = 'Out';
            break;
        case enums.PageTransitionType.RANDOM:
            transitionSettings.PageTransitionType = generateRandomBoolean() ? 'In' : 'Out';
            break;
        default:

            // If not a match case found - Throw exception with relevant parameter name.
            throw new Error(translate.error_invalid.replace('#params#', 'UISettings.PageTransitionType'));
    };

    // Return calculated result.
    return transitionSettings;
};