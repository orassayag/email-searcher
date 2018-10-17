// This container implement all the search operations, load fake emails (In the
// first load) and enable the user to preform search of emails by any key or URL
// and other search options he entered, and to manage his emails by adding them
// throw add email operation into his emails list. This long and complicated
// file calls multi sagas to perform all the operations mentioned.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Routes from '../../routes/routes';
import * as actions from '../../store/actions/actions';
import * as enums from '../../enums/enums';
import * as shapes from '../../modals/proptypes/proptypes';
import { scrollToElementByRef, isStandartScreen } from '../../utils/UIUtils';
import logicSettings from '../../settings/logic/logicSettings';
import translate from '../../translate/translate';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Emails from '../../components/Email/Emails/Emails';
import Modal from '../../components/UI/Modal/Modal';
import AuthenticationRequired from '../../components/UserAuthentication/AuthenticationRequired/AuthenticationRequired';
import { isUserAuthenticated } from '../../utils/userAuthenticationUtils';
import { SearchAddEmail, SearchBar, SearchEmailsLimit } from '../../components/Search/Search';

// Components parameter and functions PropTypes validations.
const propTypes = {
    history: PropTypes.object,
    userAuthentication: shapes.userAuthenticationShape,
    userEmails: shapes.userEmailsShape,
    isComponentMounted: PropTypes.bool.isRequired,
    isLoadingEmails: PropTypes.bool.isRequired,
    searchKeyTempValue: PropTypes.string,
    searchKeyInputValue: PropTypes.string,
    searchKeyErrorMessage: PropTypes.string,
    searchErrorRefType: PropTypes.string,
    searchMode: PropTypes.string.isRequired,
    searchOptionsGeneralErrorMessage: PropTypes.string,
    isShowSearchOptions: PropTypes.bool.isRequired,
    isEmailsError: PropTypes.bool.isRequired,
    searchOptions: shapes.searchOptionsShape,
    isShowModal: PropTypes.bool.isRequired,
    authenticationRequiredModalType: PropTypes.string,
    isLoadingModal: PropTypes.bool.isRequired,
    errorMessageModal: PropTypes.string,
    addEmailComments: PropTypes.string,
    addEmail: shapes.manageEmailShape,
    emails: PropTypes.arrayOf(shapes.emailShape.isRequired),
    onSearchOnLoadStart: PropTypes.func.isRequired,
    onSearchKeyChangeSuccess: PropTypes.func.isRequired,
    onSearchProcessStart: PropTypes.func.isRequired,
    onSearchOptionsToggleSuccess: PropTypes.func.isRequired,
    onSearchModeChangeStart: PropTypes.func.isRequired,
    onSearchOptionChangeStart: PropTypes.func.isRequired,
    onSearchModalToggleStart: PropTypes.func.isRequired,
    onSearchAddEmailModalToggleStart: PropTypes.func.isRequired,
    onSearchAddEmailCommentsChangeSuccess: PropTypes.func.isRequired,
    onSearchAddEmailProcessStart: PropTypes.func.isRequired
};

// Components default values.
const defaultProps = {
    history: null,
    userAuthentication: null,
    userEmails: null,
    searchKeyTempValue: '',
    searchKeyInputValue: '',
    searchKeyErrorMessage: '',
    searchErrorRefType: '',
    searchOptionsGeneralErrorMessage: '',
    searchOptions: null,
    authenticationRequiredModalType: '',
    errorMessageModal: '',
    addEmailComments: '',
    addEmail: null,
    emails: null
};

// State properties from sagas.
const mapStateToProps = (state) => {
    return {
        userAuthentication: state.userAuthentication.userAuthentication,
        userEmails: state.userEmails.userEmails,
        isComponentMounted: state.search.isComponentMounted,
        isLoadingEmails: state.search.isLoadingEmails,
        searchKeyTempValue: state.search.searchKeyTempValue,
        searchKeyInputValue: state.search.searchKeyInputValue,
        searchKeyErrorMessage: state.search.searchKeyErrorMessage,
        searchErrorRefType: state.search.searchErrorRefType,
        searchMode: state.search.searchMode,
        searchOptionsGeneralErrorMessage: state.search.searchOptionsGeneralErrorMessage,
        isShowSearchOptions: state.search.isShowSearchOptions,
        isEmailsError: state.search.isEmailsError,
        searchOptions: state.search.searchOptions,
        isShowModal: state.search.isShowModal,
        authenticationRequiredModalType: state.search.authenticationRequiredModalType,
        isLoadingModal: state.search.isLoadingModal,
        errorMessageModal: state.search.errorMessageModal,
        addEmailComments: state.search.addEmailComments,
        addEmail: state.search.addEmail,
        emails: state.search.emails
    };
};

// Dispatch functions from actions to reducers / sagas.
const mapDispatchToProps = (dispatch) => {
    return {
        onSearchOnLoadStart: () => {
            return dispatch(actions.onSearchOnLoadStart());
        },
        onSearchKeyChangeSuccess: (searchKeyTempValue) => {
            return dispatch(actions.onSearchKeyChangeSuccess(searchKeyTempValue));
        },
        onSearchProcessStart: (searchData) => {
            return dispatch(actions.onSearchProcessStart(searchData));
        },
        onSearchOptionsToggleSuccess: () => {
            return dispatch(actions.onSearchOptionsToggleSuccess());
        },
        onSearchModeChangeStart: (searchModeData) => {
            return dispatch(actions.onSearchModeChangeStart(searchModeData));
        },
        onSearchOptionChangeStart: (searchOptionData) => {
            return dispatch(actions.onSearchOptionChangeStart(searchOptionData));
        },
        onSearchModalToggleStart: (toggleModalData) => {
            return dispatch(actions.onSearchModalToggleStart(toggleModalData));
        },
        onSearchAddEmailModalToggleStart: (toggleAddEmailModalData) => {
            return dispatch(actions.onSearchAddEmailModalToggleStart(toggleAddEmailModalData));
        },
        onSearchAddEmailCommentsChangeSuccess: (addEmailComments) => {
            return dispatch(actions.onSearchAddEmailCommentsChangeSuccess(addEmailComments));
        },
        onSearchAddEmailProcessStart: (addEmailData) => {
            return dispatch(actions.onSearchAddEmailProcessStart(addEmailData));
        }
    };
};

class Search extends Component {

    constructor(props) {
        super(props);

        // Will determine if the user authenticated or not.
        this.isUserAuthenticated = isUserAuthenticated(this.props.userAuthentication);

        // All references points to scroll down to each location on mobile or small devices.
        this.scrollMobileRefs = Object.values(enums.SearchScrollPosition).map(item => ({ item, ref: React.createRef() }));

        // Bind all the functions.
        this.handleCommentsChange = this.handleCommentsChange.bind(this);
        this.handleSearchSelectChange = this.handleSearchSelectChange.bind(this);
        this.handleSearchOptionChange = this.handleSearchOptionChange.bind(this);
    }

    // This life-cycle handler method reform on load actions
    // on the search saga and pull out fake emails on first load.
    componentDidMount() {

        const props = this.props;

        // If there is a need in development mode to create and store on the database fake emails,
        // there is a call to a special saga that do it, or to verify existence of fake emails on Firebase database.
        props.onSearchOnLoadStart();

        // Since its first time loading the search-page (Home-page), call the saga to fetch some
        // fake emails to display the user.
        this.handleSearchEmails({
            isFakeProcess: true,
            isToggleSearchOption: false
        });
    }

    // This life-cycle handler method checks if any ref elements
    // updated, to scroll in case of tan error on mobile devices or small screens.
    componentDidUpdate() {

        const props = this.props;

        // If there is validation error in the search, scroll down to the problematic field (Mobile and small screens only).
        if (props.searchErrorRefType) {

            // Scroll to the element of the error on mobile devices or small screens only.
            this.handleScrollToElement(props.searchErrorRefType);
        }
    }

    // This handler method handles when the user clicks on the email plus icon on each email on the right,
    // This method called to show modal according to the logic on toggle saga.
    handleToggleModalClick = (e) => {

        // Stop any default actions.
        e.preventDefault();

        const props = this.props;

        // If the user is not authenticated or - Show to the user the authentication required (Login / register) modal window.
        // Since its email action icon click, display the add authentication required modal.
        if (!this.isUserAuthenticated) {

            // Show the authentication modal.
            this.handleToggleAuthenticationModal();

            // Stop any further actions.
            return;
        }

        // If the user reached the maximum limit of emails to save - Show to the user the emails maximum limit reached modal window.
        // Since its email action icon click, display the emails maximum limit reached modal window.
        if (props.userEmails.isUserEmailsTotalCountLimitExceeded()) {

            // Show the authentication modal.
            this.handleToggleAuthenticationModal();

            // Stop any further actions.
            return;
        }

        // If search options still opens, or if there is any error that the user sees -
        // Don't allow to add new emails to the user emails list. This action prevents
        // the user to add emails with invalid search key from previous search processes.
        if (props.isShowSearchOptions || props.searchKeyErrorMessage || props.searchOptionsGeneralErrorMessage ||
            props.searchOptions.findIndex((src) => src.errorMessage) >= 0) {

            // Stop any further actions.
            return;
        }

        // If the user is authenticated - Go to toggle add email modal saga and try show open the modal to the user.
        props.onSearchAddEmailModalToggleStart({
            emailActionType: enums.EmailActionType.ADDED,
            emailId: e.currentTarget.dataset.id,
            emails: props.emails
        });
    }

    // This handler method handles toggle the search options panel (Click on search button or
    // "Apply" button on the bottom of the search panel).
    handleToggleSearchOptionsClick = () => {

        const props = this.props;

        // If the user is authenticated and the search options panel is already opened,
        // call the search emails function to validate only the search options inputs
        // (If entered by the user).
        if (this.isUserAuthenticated && props.isShowSearchOptions) {

            // Call the search emails method.
            this.handleSearchEmails({
                isFakeProcess: false,
                isToggleSearchOption: true
            });
        }
        else {

            // Toggle the search options panel show / hide state.
            props.onSearchOptionsToggleSuccess();
        }
    }

    // This handler method handles on add email modal, track on comments text-box changes.
    handleCommentsChange = (e) => {

        const props = this.props;

        // If the user is not authenticated, don't do nothing.
        // The add comments process is only for authenticated users.
        if (!this.isUserAuthenticated) {

            // Stop any further actions.
            return;
        }

        // Call the change comments saga.
        props.onSearchAddEmailCommentsChangeSuccess(e.target.value);
    }

    // This handler method handles to track any change of the text-areas of the search options.
    handleSearchOptionChange = (e) => {

        const props = this.props;

        // Update the search option text-area (Email key, email domain, etc...).
        props.onSearchOptionChangeStart({
            searchOptions: props.searchOptions,
            propertyName: enums.SearchOptionProperty.VALUE,
            currentSearchOptionType: e.currentTarget.dataset.id,
            newValue: e.target.value
        });
    }

    // This handler method handles to track of any change of search option when user
    // include / exclude it, or when search option changed (TEXT / URL).
    handleSearchSelectChange = (e) => {

        const props = this.props;

        // Check if the element is mode. If so, the update the mode of search option selects.
        if (e.currentTarget.dataset.id === enums.SearchElementType.MODE) {
            props.onSearchOptionChangeStart({
                searchOptions: props.searchOptions,
                propertyName: enums.SearchOptionProperty.IS_SEARCH_OPTION_SHOW,
                currentSearchOptionType: enums.SearchElementType.URLS,
                newValue: enums.SearchOptionProperty.TOGGLE
            });

            // Update the search mode.
            props.onSearchModeChangeStart({
                newSearchMode: e.target.checked ? enums.SearchMode.URL : enums.SearchMode.TEXT,
                currentSearchMode: props.searchMode
            });
        }
        else {

            // Update the search option (Email key, email domain, etc...).
            props.onSearchOptionChangeStart({
                searchOptions: props.searchOptions,
                propertyName: enums.SearchOptionProperty.MODE,
                currentSearchOptionType: e.currentTarget.dataset.id,
                newValue: e.target.checked ? enums.SearchOption.INCLUDE : enums.SearchOption.EXCLUDE
            });
        }
    }

    // This handler method handles to track on changes of the search key on the search bar.
    handleSearchChange = (e) => {

        // Call the saga to track the change of the search key on the state.
        this.props.onSearchKeyChangeSuccess(e.target.value);
    }

    // This handler method handles to commit search operation when the user clicks on the search button.
    handleSearchClick = (e) => {

        // Stop any default actions.
        e.preventDefault();

        const props = this.props;

        // Check if not in the middle of a previous search.
        // If so - Cancel the new one and wait for the user to click again.
        if (props.isLoadingEmails) {

            // Stop any further actions.
            return;
        }

        // Call the search process saga to handle the search.
        this.handleSearchEmails({
            isFakeProcess: false,
            isToggleSearchOption: false
        });
    }

    // This handler method handles when the user clicks on "Add" button click on add email modal window -
    // There is call to add email saga to add the email selected by the user to his emails list.
    handleAddEmailClick = () => {

        const props = this.props;

        // If user is not authenticated- Don't do nothing.
        // The add email to list process is for authenticated users only.
        if (!this.isUserAuthenticated) {

            // Stop any further actions.
            return;
        }

        // Start the add email saga.
        props.onSearchAddEmailProcessStart({
            userAuthentication: props.userAuthentication,
            emailId: props.addEmail.emailId,
            comments: props.addEmailComments,
            searchMode: props.searchMode,
            searchKey: props.searchKeyInputValue,
            emails: props.emails
        });
    }

    // This handler method handles if the modal has a "Cancel" button, it handles the click - Close
    // the modal window without saving any changed or doing any action.
    handleCancelModalClick = () => {

        // Hide the modal window after cancel button has been clicked.
        this.props.onSearchModalToggleStart({
            isToggle: false,
            isShowModal: false,
            authenticationRequiredModalType: null
        });
    }

    // This handler method handles when the user-authentication modal window - When user click on "Login / Register" button -
    // Redirect the user to the user-authentication page.
    handleRedirectToAuthenticationClick = () => {

        const props = this.props;

        // If user is not authenticated, or the user token expired,
        // close any modal that the user sees before redirect to other page.
        if (!this.isUserAuthenticated) {

            // Hide any modal window that is displayed.
            props.onSearchModalToggleStart({
                isToggle: false,
                isShowModal: false,
                authenticationRequiredModalType: null
            });
        }

        // Redirect the user to user-authentication page.
        props.history.push(Routes.USER_AUTHENTICATION);
    }

    // This method handles a request to fetch emails for display.
    handleSearchEmails = (searchConfig) => {

        const props = this.props;

        // If the user is not authenticated or - Show to the user the authentication required register / login modal window.
        // Since its email action icon click, display the "search" type authentication required modal.
        if (!searchConfig.isFakeProcess && !this.isUserAuthenticated) {

            // Toggle search options panel.
            props.onSearchModalToggleStart({
                isToggle: true,
                isShowModal: null,
                authenticationRequiredModalType: enums.AuthenticationRequiredModalType.SEARCH
            });
        }
        else {
            // Perform the search emails process saga. If the user is not authenticated, fake emails will be displayed in the results.
            props.onSearchProcessStart({
                userAuthentication: props.userAuthentication,
                isFakeProcess: searchConfig.isFakeProcess,
                isToggleSearchOption: searchConfig.isToggleSearchOption,
                searchOptions: props.searchOptions,
                emailsCount: logicSettings.maximumSearchProcessEmailsCount,
                searchMode: props.searchMode,
                searchKeyTempValue: props.searchKeyTempValue
            });
        }
    }

    // This method handles toggle the AuthenticationRequired modal window.
    handleToggleAuthenticationModal = () => {

        // Call the saga to toggle a modal window.
        this.props.onSearchModalToggleStart({
            isToggle: true,
            isShowModal: null,
            authenticationRequiredModalType: enums.AuthenticationRequiredModalType.ADD
        });
    };

    // This method handles to scroll to element by ref (On mobile device or small screens only).
    handleScrollToElement = (elementType) => {

        // Check the parameters and also check if the user is not on mobile device - Don't scroll.
        if (isStandartScreen() || !elementType) {

            // Stop any further actions.
            return;
        }

        // Get the data by the current search option. If not exists - Throw exception to the user.
        const currentSearchOptionsRef = this.scrollMobileRefs.find((srcRef) => srcRef.item === elementType);
        if (!currentSearchOptionsRef) {

            // Throw exception to the user.
            throw new Error(translate.error_not_found.replace('#param#', 'Search option ref'));
        }

        // Animate the scroll if user is on mobile device / small screen.
        scrollToElementByRef(currentSearchOptionsRef.ref);
    }

    // This method handles the titles (If found emails after search and the count of the found emails) of the emails area.
    handleInitRender = () => {

        const props = this.props;

        // Will hold the data to generate the title and sub title.
        const emailsData = {
            isEmailsError: props.isEmailsError ? translate.error_general : null,
            emailsCount: !props.emails ? 0 : props.emails.length,
            searchTitle: null,
            countTitle: null
        };

        // If there was an error in the call to the API for the search process,
        // display a message instead of the emails list.
        if (emailsData.isEmailsError) {
            emailsData.searchTitle = emailsData.isEmailsError;
            emailsData.countTitle = null;
        }
        else {

            // If this is the first time that the page load, display the example title.
            if (props.isComponentMounted && !props.searchKeyInputValue) {
                emailsData.searchTitle = translate.search_page_example_results;
                emailsData.countTitle = translate.search_page_count_results.replace('#count#', emailsData.emailsCount);
            }
            else if (!props.isLoadingEmails) {

                // If the request is not the first time that the page load, display the title and
                // sub title by the search key that the user entered.
                emailsData.searchTitle = `${emailsData.emailsCount > 0 ? translate.search_page_results_title :
                    translate.search_page_results_not_found} "${props.searchKeyInputValue}":`;
                emailsData.countTitle = translate.search_page_count_results.replace('#count#', emailsData.emailsCount);
            }
        }

        // Return rendered tittles.
        return emailsData;
    }

    // This method generates the emails list component to display to
    // the user each time the page is mounted or updated.
    handleEmailsContent = () => {

        const props = this.props;
        const emailsData = this.handleInitRender();

        return (
            <Emails
                isLoadingEmails={props.isLoadingEmails}
                isEmailsError={props.isEmailsError}
                isNotFound={emailsData.emailsCount <= 0}
                isHomePage={true}
                topTitle={emailsData.searchTitle}
                subTitle={emailsData.countTitle}
                emailsCountPerPage={0}
                pagesCountToShow={0}
                currentPageNumber={0}
                totalEmailsCount={0}
                totalPagesCount={0}
                emails={props.emails}
                ref={this.scrollMobileRefs[0].ref}
                onActionIconClick={this.handleToggleModalClick}
                onMoreInformationToggleClick={null}
                onCounterChange={null}
                onChangePage={null}
            />
        );
    }

    // This method responsible for calculating which modal should be displayed when the
    // user click on the email plus icon on each email row on the right side, display
    // the authentication required modal, the limit modal, or the add comments modal.
    handleModals = () => {

        const props = this.props;
        const modalContent = {
            isLargeModal: false,
            name: '',
            content: ''
        };

        // Check if the user is authenticated, if so, continue to the next check.
        if (this.isUserAuthenticated) {

            // Check if the user is over the limit of saving emails to his emails list, if so, display the limit exceeded modal.
            if (props.userEmails.isUserEmailsTotalCountLimitExceeded()) {
                modalContent.modalName = enums.ModalName.EMAILS_LIMIT_EXCEEDED;
                modalContent.modalContent = (
                    <SearchEmailsLimit onOkClick={this.handleCancelModalClick} />
                );
            }
            else {

                // If the user is not over the limit, display the add comment (Add email to the emails list) modal.
                modalContent.isLargeModal = true;
                modalContent.modalName = enums.ModalName.ADD_EMAIL;
                modalContent.modalContent = (
                    <SearchAddEmail
                        emailAddress={props.addEmail.emailAddress}
                        commentsValue={props.addEmailComments}
                        errorMessage={props.addEmail.errorMessage}
                        onCommentsChange={this.handleCommentsChange}
                        onAddClick={this.handleAddEmailClick}
                        onCancelClick={this.handleCancelModalClick}
                    />
                );
            }
        }
        else {

            // If the user is not authenticated, display the authentication required (Login / register) modal.
            modalContent.modalName = enums.ModalName.AUTHENTICATION_REQUIRED;
            modalContent.modalContent = (
                <AuthenticationRequired
                    authenticationRequiredModalType={props.authenticationRequiredModalType}
                    onAuthenticationClick={this.handleRedirectToAuthenticationClick}
                    onCancelClick={this.handleCancelModalClick}
                />
            );
        }

        // Return calculated modal to render.
        return modalContent;
    }

    render() {

        const props = this.props;
        const contentData = {
            emailsContent: this.handleEmailsContent(),
            modalContent: this.handleModals()
        };

        return (
            <Auxiliary>
                <SearchBar
                    searchMode={props.searchMode}
                    isShowSearchOptions={props.isShowSearchOptions}
                    searchOptionsGeneralErrorMessage={props.searchOptionsGeneralErrorMessage}
                    searchKeyErrorMessage={props.searchKeyErrorMessage}
                    searchOptions={props.searchOptions}
                    ref={this.scrollMobileRefs.slice(1)}
                    onToggleSearchOptions={this.handleToggleSearchOptionsClick}
                    onSearchClick={this.handleSearchClick}
                    onSearchChange={this.handleSearchChange}
                    onSearchOptionChange={this.handleSearchOptionChange}
                    onSearchSelectChange={this.handleSearchSelectChange}
                />
                {contentData.emailsContent}
                <Modal
                    modalName={contentData.modalContent.modalName}
                    isShowModal={props.isShowModal}
                    isLoadingModal={props.isLoadingModal}
                    isLargeModal={contentData.modalContent.isLargeModal}
                    onCloseClick={this.handleToggleModalClick}
                    errorMessage={props.errorMessageModal}
                >
                    {contentData.modalContent.modalContent}
                </Modal>
            </Auxiliary>
        );
    }
}

// Set the PropTypes validations and default values.
Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps)(Search);