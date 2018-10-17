// Settings to that effect’s logic, that related to limits of fields, all over the application site,
// and due to multiply times they are needed, it's better to put all of them together
// in one center place.

const logicSettings = {

    // GENERAL

    // The minimum size in pixels for small devices (Mobile, iPad, iPhone, Android, etc...).
    // This help to detect special browser operations only for those users.
    minimumMobileWindowSize: 1170,

    // SEARCH

    // The maximum string characters length of search key in text mode to
    // enter input in the text box of search bar component.
    maximumTextSearchLength: 200,

    // The maximum string characters length of search key in URL mode to
    // enter input in the text box of search bar component.
    maximumURLSearchLength: 1500,

    // The maximum total characters length of all domain keys that entered in
    // the search option of domain keys text-area in the search option panel.
    maximumDomainsLength: 300,

    // The maximum total characters length of all email keys that entered in
    // the search option of email keys text-area in the search option panel.
    maximumKeysLength: 300,

    // The maximum total characters length of all URLs that entered in
    // the search option of URLs text-area in the search option panel.
    maximumURLSLength: 1000,

    // The number of fake emails to create each time the searchStoreFakeEmailsStartSaga saga is take place.
    // This number need to be very small, since it's creating the email and store it on the database via API server call.
    // The recommended and default number is 20.
    fakeEmailsCountToCreate: 20,

    // The number of search options available on the panel of search options.
    // We keep this number to validate that the search bar component gets the
    // exact number of search options, since the operation that generates them
    // is dynamic within a loop, so there is a need to determine the real
    // number of expected search options. The current number is 3. If you
    // planning to add more or remove some search options in the future,
    // don't forget to this number.
    searchOptionsArrayCount: 3,

    // The maximum number of emails to fetch from the API server.
    // As much as the number will be lowered, the more it will allow a fast,
    // smart, and random search process operations to take place.
    // The recommended and default number is 10.
    maximumSearchProcessEmailsCount: 10,

    // EMAIL

    // The maximum characters length of email address within an Email class
    // that allowed to be created.
    maximumEmailAddressLength: -1,

    // The maximum characters length of URL within an Email class
    // that allowed to be created.
    maximumEmailLinkLength: -1,

    // The maximum characters length of search key within an Email class
    // that allowed to be created.
    maximumEmailSearchKeyLength: -1,

    // The maximum characters length of comments within an Email class
    // that allowed to be created.
    maximumEmailCommentsLength: 300,

    // USER

    // The maximum characters length of the email that the user can enter when he registers to the application site.
    maximumUserEmailLength: 150,

    // The minimum characters length of the email that the user can enter when he registers to the application site.
    minimumUserEmailLength: 5,

    // The maximum characters length of the password that the user can enter when he registers to the application site.
    maximumUserPasswordLength: 20,

    // The minimum characters length of the password that the user can enter when he registers to the application site.
    minimumUserPasswordLength: 10,

    // The default count of emails to display each page in the user-emails page. The user can change that.
    defaultUserEmailsCountPerPage: 10,

    // The minimum count of emails to display the pager on the bottom of the user-emails page.
    minimumEmailsCountToShowPager: 10,

    // The minimum count of emails to display the emails count select dropdown on the top of the user-emails page.
    minimumEmailsCountToShowCounter: 10,

    // The default page number in the user-emails page, in case that in this page the
    // user can navigate between email’s pages and have pager component displayed.
    defaultUserEmailsCurrentPageNumber: 1,

    // The default page number count to display in the pager component, in case the user
    // have more than the number in minimumEmailsCountToShowPager parameter. For example,
    // if the number here is 4 (Which is the default number), the user will see 4 links
    // each time at the pager (Only if he has a count that calculated to contain 4 pages
    // of emails items according to the emails count he selected to display).
    defaultPagesCountToShow: 4,

    // The maximum number of emails that the user deletes on user-emails page until
    // will be refresh. The refresh operation of the page serve update to the counter
    // and the pager of this page.
    emailsCountToRefreshPage: 3,

    // This array of numbers represent the options to select on the user-emails page
    // from the top dropdown select, to select the number of email items to display in each page.
    emailsCounterOptionsList: [10, 20, 50]
};

export default logicSettings;