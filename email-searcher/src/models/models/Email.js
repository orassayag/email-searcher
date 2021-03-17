// This class represents an email row that is displayed in the search-page (Home-page) and in
// the user-emails. Each row of email represents an instance of this class. Each email
// contains all the email details that related to the search process: the email address,
// the link that the email was found in, the creation date, the search engine that the
// email was found within, and so on.

import * as enums from '../../enums/enums';
import { getDateConverted } from '../../utils/textUtils';

class Email {

    constructor(emailData) {

        // Check if data received exists. If not -
        // Don't assign any value to the Email instance.
        if (!emailData) {

            // Stop any further actions.
            return;
        }

        // The Id of the user as generated by database or by the
        // code (Depending if it's fake email or not).
        this.emailId = emailData.emailId;

        // Check if the emailUserId exists, to assign it. Only when the
        // user adds the email to his emails list, the emailUserId is added.
        // This is the user Id of the user that saved the emails into his emails list.
        // In fake emails we don't have this field. Once user decide to save
        // an email into his emails list, this field added dynamically.
        this.emailUserId = emailData.emailUserId;

        // Check if the emailUserAddedDate exists, to assign it. Only when the
        // user adds the email to his emails list, the emailUserAddedDate is added.
        // This is the date of when the user saved the email into his emails list.
        // In fake emails we don't have this field. Once user decide to save
        // an email into his emails list, this field added dynamically.
        this.emailUserAddedDate = getDateConverted(emailData.emailUserAddedDate);

        // The email address was generated by the API server search process or
        // by random string and domain ending (Depending if it's a fake email or not).
        this.emailAddress = emailData.emailAddress;

        // This is the URL that the email was found inside its view-source code.
        // In fake emails type it also a random string with random domain name.
        this.emailLink = emailData.emailLink;

        // The creation date of the email. The API server search process is the date of
        // the email that was found. In fake emails, it's just a random date.
        // Note that we check that if the given value is a string, we try to convert it.
        this.emailCreationDate = getDateConverted(emailData.emailCreationDate);

        // The search engine website that the email was found in. In fake emails it's a random within SearchEngine enum.
        this.emailSearchEngine = emailData.emailSearchEngine;

        // The search key that within the search process found the email. In fake emails it's a random string.
        this.emailSearchKey = emailData.emailSearchKey;

        // Check if there are comments.
        // The comments added when the user decide to add the email to his emails
        // list, although the comments are not required for adding the email to the emails
        this.emailComments = emailData.emailComments;

        // This field determines the type of the email, whether it's created by the result of the search process
        // or by a result of generating by a random fake operation just to show data on the search-page (Home-page).
        this.emailType = emailData.emailType;

        // This is a field that is generated for UI purposes and therefore not included
        // in the database. For each action from EmailActionType enum.
        // The default value is 'CREATED' which does not affect the UI in any case.
        this.emailActionType = enums.EmailActionType.CREATED;

        // This field is also responsible for showing or hiding the full details panel on the
        // user-emails page, so this field is also not included in the database.
        // The default value is false.
        this.isEmailMoreInformationMode = false;
    }
}

export default Email;