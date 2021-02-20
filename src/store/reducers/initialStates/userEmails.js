// This file contains the initialState of the user-emails container
// and store reducer. It contains all the inputs of the get emails
// and delete emails.

import { toManageEmail } from '../../../modals/conversion/manageEmail';

// The initial state of the user-emails part.
export const initialState = {

    // This field determine if the user-emails component
    // is mounted or not.
    isComponentMounted: false,

    // This flag field will determine if to scroll to the results emails each
    // time the emails refreshed on the page or not. The scrolling
    // animation occurred happen only on mobile or small devices.
    isScrollToResults: false,

    // This field represent the loading animation on the on
    // the user-emails component. On load it's true.
    isLoadingEmails: true,

    // This field will flag to display error message instead
    // of list of email in case of unexpected error during
    // the error user emails load operation process.
    isEmailsError: false,

    // This object field will hold an instance of the UserEmails that is
    // responsible for the data used in user-emails page and for the
    // user's emails count for other pages.
    userEmails: null,

    // This flag field will determine if the modal window of delete emails
    // is displayed to the user or not, due to some click on X on the corner
    // on the email item that the user performed.
    isShowModal: false,

    // This flag field will determine if to display a loading animation
    // after the user deleted an email from his emails list and waiting
    // for the API server call and saga to end the process.
    isLoadingModal: false,

    // This object class instance will hold all the data needed to prepare
    // deleting the email from the user emails list, and each time the user clicks
    // on the X icon next to the email row, the email Id, and email address
    // update in this object. If needed, if unexpected error occurred,
    // an error message is displayed and updated in this object.
    deleteEmail: toManageEmail()
};