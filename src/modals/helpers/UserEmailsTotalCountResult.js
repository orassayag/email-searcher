// This class represent a result validation in multi places of
// getting the user emails total count. We use this class in several places.

class UserEmailsTotalCountResult {

    constructor() {

        // The default count of the user emails in the beginning of the validation process.
        this.userEmailsTotalCount = 0;

        // Will hold the error object from the server in case of an error such as that occurred.
        this.errorObject = null;

        // If an unexpected error results in the validation process, assigning it to this field and print it to the console.
        this.errorToConsole = null;

        // If an error (Unexpected or not - Or the validation field) occurred.
        this.errorMessage = null;
    }
}

export default UserEmailsTotalCountResult;