// This class represents a result validation in multiple places of
// add / delete email from / to user emails list. We use this class in several places.

class ManageEmailValidationResult {

    constructor() {

        // The email item row to add / delete from emails list.
        this.emailItem = null;

        // If an unexpected error results in the validation process, assign it to this field and print it to the console.
        this.errorToConsole = null;

        // If an error (Unexpected or not - Or the validation field) occurred.
        this.errorMessage = null;
    }
}

export default ManageEmailValidationResult;