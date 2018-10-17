// This file contains the initialState of the user-authentication container
// and store reducer. It contains all the inputs of the login and
// registration processes.

import * as enums from '../../../enums/enums';

// The initial state of the user-authentication part.
export const initialState = {

    // This object field will hold an instance of the UserAuthentication class
    // that will appear in many components in the site application to check
    // if the user is authenticated or not.
    userAuthentication: null,

    // This field represent the authentication mode of the user on the user-authentication page, it's
    // the type of the action the user will like to perform, a login process
    // or a registration process, and he sees texts on the forms that indicates the current
    // authentication mode. The user can change the authentication mode by clicking on the form's bottom
    // link, and actually update this field.
    userAuthenticationMode: enums.UserAuthenticationModeType.REGISTRATION,

    // This flag field will determine if to display loading animation
    // or not (For example, when the user switch between login
    // to registration modes, and vice versa).
    isLoading: false,

    // This field holds the username text field (The email address)
    // text-box both on login and registration forms. Each time the
    // user key-up or key-down on the email text-box, this field is being updated.
    emailText: '',

    // This field holds the password text field text-box both on
    // login and registration forms. Each time the user key-up or key-down
    // on the password text-box, this field is being updated.
    passwordText: '',

    // This field will hold an error message related to the email address
    // (Username) field, and each time the user will submit a request to
    // login / register to the system with invalid email address, an error
    // message, re-assign to this field, will be displayed and the process
    // will not continue.
    emailError: null,

    // This field will hold an error message related to the password
    // field, and each time the user will submit a request to
    // login / register to the system with invalid password, an error
    // message, re-assign to this field, will be displayed and the process
    // will not continue.
    passwordError: null,

    // This field will hold a general error message what will be re-assign
    // and displayed to the user once an unexpected error will occur during
    // the login / registration API call or the hole authentication saga.
    generalError: null
};