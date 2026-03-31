// Settings to affect animations, delays, and other options that
// effects on the user look and feel experience.

import * as enums from '../../enums/enums';

const UISettings = {

    // PAGE SHELL

    // Determine if the transition effect will appear when the user browses from page to page.
    PageTransitionAppear: true,

    // Determine the amount of time of the fade-in / fade-out effect. The time is in milliseconds.
    PageTransitionAppearTimeout: 600,

    // Determine the enter fade effect duration. The time is in milliseconds.
    PageTransitionEnterTimeout: 600,

    // Determine the leave fade effect duration. The time is in milliseconds.
    PageTransitionLeaveTimeout: 200,

    // Determine the type of the effect to display to the user when browsing from one
    // page to another. Fade-in, fade-out, or random between them. The default value is random.
    PageTransitionType: enums.PageTransitionType.RANDOM,

    // APP

    // Determine the durations to display loader until all the application
    // site is visible to the user, while rendering the CSS for the UI.
    // The time is in milliseconds.
    appPageInitialDelay: 500,

    // SEARCH

    // Determine the number of durations to delay until the loader will be
    // gone and the emails list will be displayed to the user in the search-page (Home-page).
    // The time is in milliseconds.
    searchEmailInitialDelay: 500,

    // Determine the number of durations to delay between each loop round after
    // an email (Fake or sample) inserted by an API call to the Firebase's database.
    // This limit meant to not harm the system and to not to overheat the CPU.
    // The time is in milliseconds.
    searchStoreEmailDelay: 100,

    // Determine the number of durations to display the modal error message and
    // to keep the modal open until it will automatically be closed after an unexpected
    // error occurred in the system while trying to add user email to the user emails list.
    // The time is in milliseconds.
    searchAddEmailFailureModalDelay: 5000,

    // Determine the number of durations to wait in delay until
    // displaying the add email animation effect to the user.
    // The time is in milliseconds.
    searchAddEmailEffectDelay: 100,

    // USER AUTHENTICATION

    // Determine the number of durations to delay and display a loader each time the user
    // clicks on the link on bottom of the authentication form to switch between
    // registration and login modes and via versa. The time is in milliseconds.
    userAuthenticationSwitchModeDelay: 100,

    // USER EMAILS

    // Determine the number of durations to display the modal error message and
    // to keep the modal open until it will automatically be closed after an unexpected
    // error occurred in the system while trying to delete user email from the user emails list.
    // The time is in milliseconds.
    userEmailsDeleteEmailFailureModalDelay: 5000,

    // Determine the number of durations to wait in delay until
    // displaying the delete email animation effect to the user.
    // The time is in milliseconds.
    userEmailsDeleteEmailEffectDelay: 100
};

export default UISettings;