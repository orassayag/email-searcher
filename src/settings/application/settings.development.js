// Settings for the development environment only. The settings effects on entire
// application behavior, URLs, keys, secrets, and other configurations. All the
// settings repeats themselves all over the site, so it's better to implement
// these settings and configurations in one file.

const applicationSettings = {

    // This field define the API URL address of the REST API and the database.
    // Note that the default is now Firebase, but in the future may be changed
    // to a Node.js independent API server URL. Also note that all of the calls
    // to this API URL related to any CRUD operations, except the user authentication
    // to the site. The authentication has another URL, due to Firebase policy. In
    // case of independent REST API base on Node.js, only API URL address will
    // be implemented.
    apiBaseURL: 'https://email-searcher-9a370.firebaseio.com/',

    // This API URL is in charge of all Firebase user authentications
    // processes (Login, register, provide secure user token, and other actions).
    apiBaseUserAuthenticationURL: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/',

    // This is the key that provides an authentication to process user
    // authentication actions against Firebase database.
    apiBaseUserAuthenticationKey: 'AIzaSyDAat5vzOC0CEdAJecUj0Wm5zPMmaG4dQs',

    // This field define the milliseconds count that after that, the user
    // token that authenticated to the site application is expired and the
    // user redirected to search-page (Home-page) and needs to login to the
    // system once again.
    apiUserAuthenticationTokenMillisecondsCount: 1000,

    // This field define the creator's email address of the person who
    // built the application, and will be linked to open an email link
    // email program once the email will be clicked on. It would
    // displayed on the bottom of the footer link.
    creatorEmail: 'orassayag@gmail.com',

    // This field define the creator's full name of the person who built
    // the application. It will appear on the bottom of the footer and
    // will be a link to send email to the creator.
    creatorName: 'Or Assayag',

    // This field determine the link for the site that provided all icon
    // images on the site (For example, the logo of the site, and the icon
    // images on some of the modal windows) as their policy demand to
    // put link on the bottom of their page if you use some of them
    // free icon images. The link will open their site, and will be
    // placed on the bottom of the footer.
    iconsURL: 'https://icons8.com/',

    // This field determine the name of the icons URL provider that provided
    // the icons for the site and will be displayed on the bottom of the footer
    // as the link text to go to their site once the user clicks on the link.
    iconsName: 'icons8',

    // This field define the site application's creation year, and will be
    // displayed on the bottom of the footer. Also, it will be included in the
    // logic that will calculate the year that created until the current year
    // and will be displayed on the footer, once the year is passed.
    applicationCreationYear: 2018,

    // This field determine the maximum capacity count limit of each user to
    // save emails on his emails limit. Once the limit is reached, the user
    // will be unable to save emails on this emails list until he will
    // delete old emails from his emails list to clear some space for new
    // emails to be saved.
    maximumUserEmailsTotalCountLimit: 60,

    // This field determine the init key words of each site application's
    // localStorage value that will be stored in the localStorage. This is
    // required to not override some other localStorage values that the
    // user's browser saved from other browsing sites.
    emailSearcherInit: 'email_searcher',

    // This field determine the default local culture of the site's language.
    // It will display the translations from the translate folder with the
    // file ending with the culture valued on this field. Currently only English
    // language is implemented, but in the future other languages can be
    // implemented (May need to change other logics as well).
    emailDefaultCulture: 'en',

    // This flag field determine if on each time of the first load of the site,
    // to generate and store in the database new fake emails (The count of the
    // emails can be found on the logic settings). If true, it will generate new
    // fake emails into the database. The user will not notice this operation.
    isGenerateFakeEmails: false,

    // This flag field determine if on the load of the first time, the operation will
    // check if any of the fake emails exists on the database on Firebase. If not,
    // fake emails will be generated by code and will automatically inserted by API calls
    // to the Firebase database, to simulate search processes. If fake emails already exist
    // on the database, no operation will take place.
    isVerifyFakeEmailsExistsOnDatabase: true
};

export default applicationSettings;