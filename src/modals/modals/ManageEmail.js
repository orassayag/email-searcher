// This class will hold all the data needed to perform a
// adding / deleting email process operation from / to the user's emails list.
// When the user (That authenticated to the site application)
// clicks on the X/+ icon next to the email row, before the
// add / delete email modal window is displayed, the email Id and the
// email address will be assigning to prepare the email details
// to be added / deleted within an API server call with the basic details.

class ManageEmail {

    constructor(manageEmailData) {

        // Check if manageEmailData received exists. If not -
        // Assign default values so the object instance will not be null.
        if (manageEmailData) {

            // This field will hold the email Id of the email that
            // the user selected from the emails array list.
            this.emailId = manageEmailData.emailId;

            // This field will hold the email address of
            // the email that the user selected from the emails array list.
            this.emailAddress = manageEmailData.emailAddress;

            // This field represent an error message of add / delete
            // modal window to display in case that invalid input
            // (In case of adding email comments) or unexpected error occurred.
            this.errorMessage = manageEmailData.errorMEssage;

        } else {

            // Assign empty emailId.
            this.emailId = null;

            // Assign empty emailAddress.
            this.emailAddress = null;

            // Assign empty errorMEssage.
            this.errorMessage = null;
        }
    }
}

export default ManageEmail;